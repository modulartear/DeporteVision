import { NextRequest, NextResponse } from "next/server";
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, doc, updateDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { analyzePadelWithAI } from "@/lib/padel-ai";

// ─── Firebase server-side init ────────────────────────────────────────────────

let db: ReturnType<typeof getFirestore> | null = null;

function getServerDb() {
  if (db) return db;

  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;

  if (!projectId || !apiKey) {
    console.warn("[API/analyze] Firebase env vars missing");
    return null;
  }

  try {
    const app = getApps().length === 0
      ? initializeApp({
          apiKey,
          authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
          projectId,
          storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
          messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
          appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
        })
      : getApp();

    db = getFirestore(app);
    return db;
  } catch (error) {
    console.error("[API/analyze] Firebase init error:", error);
    return null;
  }
}

// ─── POST /api/analyze ────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  let matchId = "";

  try {
    const body = await request.json();
    matchId = body.matchId;
    const videoUrl: string = body.videoUrl ?? "";
    const playerNames: string[] = Array.isArray(body.playerNames) ? body.playerNames : [];

    if (!matchId) {
      return NextResponse.json({ error: "matchId es requerido" }, { status: 400 });
    }

    console.log(`[API/analyze] Iniciando análisis IA para match: ${matchId}`);
    console.log(`[API/analyze] Video: ${videoUrl.slice(0, 80)}...`);
    console.log(`[API/analyze] Jugadores: ${playerNames.join(", ") || "no especificados"}`);

    const database = getServerDb();

    // Marcar como "processing" en Firestore
    if (database) {
      try {
        const matchRef = doc(database, "matches", matchId);
        await updateDoc(matchRef, { status: "processing" });
        console.log("[API/analyze] Estado → processing");
      } catch (err) {
        console.warn("[API/analyze] No se pudo marcar como processing:", err);
      }
    }

    // ── Análisis con IA real ───────────────────────────────────────────────
    const { analysis } = await analyzePadelWithAI(matchId, videoUrl, playerNames);
    console.log("[API/analyze] Análisis IA completado ✓");

    const analysisId = analysis.id ?? `analysis-${Date.now()}`;

    // ── Guardar en Firestore ───────────────────────────────────────────────
    if (database) {
      try {
        const analysisRef = doc(database, "matches", matchId, "analysis", analysisId);
        await setDoc(analysisRef, {
          id: analysisId,
          matchId,
          // Firestore no soporta arrays anidados → serializar como JSON string
          data: JSON.stringify(analysis),
          createdAt: serverTimestamp(),
        });

        const matchRef = doc(database, "matches", matchId);
        await updateDoc(matchRef, {
          status: "analyzed",
          analysisId,
          analyzedAt: serverTimestamp(),
        });

        console.log("[API/analyze] Guardado en Firestore → analyzed ✓");
      } catch (dbError) {
        console.warn("[API/analyze] Error guardando en Firestore:", dbError);
        // Intentar al menos actualizar el estado
        if (database) {
          try {
            const matchRef = doc(database, "matches", matchId);
            await updateDoc(matchRef, { status: "analyzed", analysisId, analyzedAt: serverTimestamp() });
          } catch {
            // Si esto también falla, el cliente usará el cache local
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      matchId,
      analysisId,
      analysis,
      message: "Análisis IA completado correctamente",
    });
  } catch (error: unknown) {
    console.error("[API/analyze] Error crítico:", error);
    const message = error instanceof Error ? error.message : "Error desconocido";

    // Intentar marcar el partido como error
    if (matchId) {
      const database = getServerDb();
      if (database) {
        try {
          const matchRef = doc(database, "matches", matchId);
          await updateDoc(matchRef, { status: "error", errorMessage: message });
        } catch {
          // silenciar error secundario
        }
      }
    }

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
