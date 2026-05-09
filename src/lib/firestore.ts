import { doc, getDoc, setDoc, updateDoc, serverTimestamp, collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { db } from "./firebase";
import type { User, Match, MatchAnalysis } from "@/types";

/**
 * Crea un documento de usuario en Firestore al registrarse.
 */
export async function createUserDocument(
  uid: string,
  name: string,
  email: string
): Promise<void> {
  if (!db) throw new Error("Firestore no está inicializado. Verificá la configuración de Firebase.");
  const userRef = doc(db, "users", uid);
  await setDoc(userRef, {
    uid,
    name,
    email,
    plan: "free",
    createdAt: serverTimestamp(),
  });
}

/**
 * Obtiene el perfil de usuario desde Firestore.
 */
export async function getUserProfile(uid: string): Promise<User | null> {
  if (!db) return null;
  const userRef = doc(db, "users", uid);
  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {
    return userSnap.data() as User;
  }
  return null;
}

/**
 * Crea un documento de partido en Firestore después de subir un video.
 * El estado inicial es "uploaded".
 */
export async function createMatchDocument(
  userId: string,
  title: string,
  sport: string,
  videoUrl: string
): Promise<string> {
  if (!db) throw new Error("Firestore no está inicializado. Verificá la configuración de Firebase.");
  const matchesRef = collection(db, "matches");
  const docRef = await addDoc(matchesRef, {
    userId,
    title,
    sport,
    videoUrl,
    status: "uploaded",
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

/**
 * Actualiza el estado de un partido (uploaded → processing → analyzed / error).
 */
export async function updateMatchStatus(
  matchId: string,
  status: "uploaded" | "processing" | "analyzed" | "error",
  errorMessage?: string
): Promise<void> {
  if (!db) throw new Error("Firestore no está inicializado.");
  const matchRef = doc(db, "matches", matchId);
  const updateData: Record<string, unknown> = { status };
  if (errorMessage) updateData.errorMessage = errorMessage;
  await updateDoc(matchRef, updateData);
}

// ─── Helpers para convertir datos entre Firestore y la app ──────────────

/**
 * Convierte el analysis a un formato compatible con Firestore.
 *
 * Firestore NO soporta arrays anidados (ej: [[6,4],[7,5]]).
 * La solución más robusta es serializar todo el análisis como JSON string,
 * ya que los datos de análisis son complejos y pueden contener
 * estructuras anidadas de varios niveles.
 *
 * Esto evita completamente los errores de "Nested arrays are not supported"
 * y simplifica el mantenimiento cuando se agregan nuevos campos.
 */
function analysisToFirestore(analysis: MatchAnalysis): Record<string, unknown> {
  // Serializar todo el análisis como JSON string
  // Firestore soporta strings sin problemas
  const serialized = JSON.stringify({
    id: analysis.id,
    matchId: analysis.matchId,
    result: analysis.result,
    teamStats: analysis.teamStats,
    playerStats: analysis.playerStats,
    shotHeatmap: analysis.shotHeatmap,
    possessionBySet: analysis.possessionBySet,
    pointSequence: analysis.pointSequence,
    clips: analysis.clips,
    aiSummary: analysis.aiSummary,
    keyMetrics: analysis.keyMetrics,
  });

  return {
    id: analysis.id,
    matchId: analysis.matchId,
    // Guardamos los datos serializados como JSON string
    data: serialized,
    // Campos de búsqueda/filtering a nivel raíz
    createdAt: serverTimestamp(),
  };
}

/**
 * Convierte datos leidos de Firestore de vuelta al formato de la app.
 * Deserializa el JSON string guardado en el campo "data".
 */
function firestoreToAnalysis(data: Record<string, unknown>): MatchAnalysis {
  const raw = data as Record<string, any>;

  // Si tiene el campo "data" serializado, deserializarlo
  if (raw.data && typeof raw.data === "string") {
    try {
      const parsed = JSON.parse(raw.data);
      return {
        ...parsed,
        createdAt: raw.createdAt,
      } as MatchAnalysis;
    } catch (e) {
      console.error("[Firestore] Error deserializando análisis:", e);
    }
  }

  // Fallback: formato anterior (por si hay datos guardados con el formato viejo)
  const sets: [number, number][] = (raw.result?.sets || []).map(
    (s: { t1: number; t2: number } | [number, number]) =>
      Array.isArray(s) ? s : [s.t1, s.t2]
  );

  return {
    id: raw.id,
    matchId: raw.matchId,
    createdAt: raw.createdAt,
    result: {
      ...raw.result,
      sets,
    },
    teamStats: raw.teamStats || [],
    playerStats: raw.playerStats || [],
    shotHeatmap: raw.shotHeatmap || [],
    possessionBySet: raw.possessionBySet || [],
    pointSequence: raw.pointSequence || [],
    clips: raw.clips || [],
    aiSummary: raw.aiSummary || "",
    keyMetrics: raw.keyMetrics || [],
  } as MatchAnalysis;
}

/**
 * Guarda el análisis completo de un partido en Firestore.
 * Serializa como JSON string para evitar problemas de tipos de Firestore.
 * También actualiza el estado del partido a "analyzed".
 */
export async function saveMatchAnalysis(
  matchId: string,
  analysis: MatchAnalysis
): Promise<void> {
  if (!db) throw new Error("Firestore no está inicializado.");

  // Convertir a formato Firestore-compatible (JSON serializado)
  const firestoreData = analysisToFirestore(analysis);

  // Guardar análisis en subcolección
  const analysisRef = doc(db, "matches", matchId, "analysis", analysis.id);
  await setDoc(analysisRef, firestoreData);

  // Actualizar el partido con referencia al análisis
  const matchRef = doc(db, "matches", matchId);
  await updateDoc(matchRef, {
    status: "analyzed",
    analysisId: analysis.id,
    analyzedAt: serverTimestamp(),
  });
}

/**
 * Obtiene el análisis de un partido.
 */
export async function getMatchAnalysis(matchId: string): Promise<MatchAnalysis | null> {
  if (!db) return null;
  const analysisRef = collection(db, "matches", matchId, "analysis");
  const q = query(analysisRef);
  const querySnapshot = await getDocs(q);

  if (!querySnapshot.empty) {
    // Ordenar por createdAt descendente manualmente (evita necesitar índice)
    const sorted = querySnapshot.docs.sort((a, b) => {
      const aTime = (a.data().createdAt as any)?.toMillis?.() || 0;
      const bTime = (b.data().createdAt as any)?.toMillis?.() || 0;
      return bTime - aTime;
    });
    const doc = sorted[0];
    return firestoreToAnalysis({ id: doc.id, ...doc.data() });
  }
  return null;
}

/**
 * Obtiene un partido individual por ID.
 */
export async function getMatchById(matchId: string): Promise<Match | null> {
  if (!db) return null;
  const matchRef = doc(db, "matches", matchId);
  const matchSnap = await getDoc(matchRef);

  if (matchSnap.exists()) {
    return { id: matchSnap.id, ...matchSnap.data() } as Match;
  }
  return null;
}

/**
 * Obtiene los partidos de un usuario ordenados por fecha.
 * Sin usar orderBy para evitar necesitar un índice compuesto.
 * Ordenamos manualmente en el cliente.
 */
export async function getUserMatches(userId: string): Promise<Match[]> {
  if (!db) return [];
  const matchesRef = collection(db, "matches");
  // Solo filtramos por userId (sin orderBy = no necesita índice compuesto)
  const q = query(matchesRef, where("userId", "==", userId));
  const querySnapshot = await getDocs(q);

  const matches = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Match[];

  // Ordenar por createdAt descendente en el cliente
  matches.sort((a, b) => {
    const aTime = a.createdAt && typeof (a.createdAt as any).toMillis === "function"
      ? (a.createdAt as any).toMillis() : 0;
    const bTime = b.createdAt && typeof (b.createdAt as any).toMillis === "function"
      ? (b.createdAt as any).toMillis() : 0;
    return bTime - aTime;
  });

  return matches;
}

/**
 * Elimina un partido y su análisis.
 */
export async function deleteMatch(matchId: string): Promise<void> {
  if (!db) throw new Error("Firestore no está inicializado.");
  const matchRef = doc(db, "matches", matchId);
  await updateDoc(matchRef, {
    status: "deleted",
    deletedAt: serverTimestamp(),
  });
}

// ─── Caché local de análisis (localStorage) ────────────────────────────
// Para evitar depender exclusivamente de Firestore, guardamos los análisis
// generados localmente en localStorage. Esto permite que el flujo funcione
// incluso si Firestore tiene problemas de permisos o conectividad.

const ANALYSIS_CACHE_KEY = "deportevision_analysis_cache";

/**
 * Guarda un análisis en la caché local (localStorage).
 */
export function cacheAnalysisLocally(matchId: string, analysis: MatchAnalysis): void {
  try {
    const cache = getLocalAnalysisCache();
    cache[matchId] = {
      ...analysis,
      // Asegurar que createdAt sea serializable
      createdAt: analysis.createdAt ? null : null,
    };
    localStorage.setItem(ANALYSIS_CACHE_KEY, JSON.stringify(cache));
  } catch (e) {
    console.warn("[Cache] No se pudo guardar en localStorage:", e);
  }
}

/**
 * Obtiene un análisis de la caché local.
 */
export function getCachedAnalysis(matchId: string): MatchAnalysis | null {
  try {
    const cache = getLocalAnalysisCache();
    const cached = cache[matchId];
    return cached || null;
  } catch {
    return null;
  }
}

/**
 * Obtiene toda la caché local de análisis.
 */
function getLocalAnalysisCache(): Record<string, MatchAnalysis> {
  try {
    const raw = localStorage.getItem(ANALYSIS_CACHE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

/**
 * Guarda el estado del match en caché local.
 */
const MATCH_CACHE_KEY = "deportevision_match_cache";

export function cacheMatchLocally(match: Match): void {
  try {
    const cache = getLocalMatchCache();
    cache[match.id] = { ...match, createdAt: null as any };
    localStorage.setItem(MATCH_CACHE_KEY, JSON.stringify(cache));
  } catch (e) {
    console.warn("[Cache] No se pudo guardar match en localStorage:", e);
  }
}

export function getCachedMatch(matchId: string): Match | null {
  try {
    const cache = getLocalMatchCache();
    return cache[matchId] || null;
  } catch {
    return null;
  }
}

function getLocalMatchCache(): Record<string, Match> {
  try {
    const raw = localStorage.getItem(MATCH_CACHE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}
