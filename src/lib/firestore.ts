import { doc, getDoc, setDoc, updateDoc, serverTimestamp, collection, addDoc, query, where, orderBy, getDocs } from "firebase/firestore";
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

/**
 * Guarda el análisis completo de un partido en Firestore.
 * También actualiza el estado del partido a "analyzed".
 */
export async function saveMatchAnalysis(
  matchId: string,
  analysis: MatchAnalysis
): Promise<void> {
  if (!db) throw new Error("Firestore no está inicializado.");

  // Guardar análisis en subcolección
  const analysisRef = doc(db, "matches", matchId, "analysis", analysis.id);
  await setDoc(analysisRef, {
    ...analysis,
    createdAt: serverTimestamp(),
  });

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
  const q = query(analysisRef, orderBy("createdAt", "desc"));
  const querySnapshot = await getDocs(q);

  if (!querySnapshot.empty) {
    const doc = querySnapshot.docs[0];
    return { id: doc.id, ...doc.data() } as MatchAnalysis;
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
 */
export async function getUserMatches(userId: string): Promise<Match[]> {
  if (!db) return [];
  const matchesRef = collection(db, "matches");
  const q = query(matchesRef, where("userId", "==", userId), orderBy("createdAt", "desc"));
  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Match[];
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
