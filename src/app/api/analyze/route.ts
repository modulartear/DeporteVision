import { NextRequest, NextResponse } from "next/server";
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, doc, updateDoc, setDoc, serverTimestamp } from "firebase/firestore";

// ─── Firebase server-side init ───────────────────────────────────────────
let db: ReturnType<typeof getFirestore> | null = null;

function getServerDb() {
  if (db) return db;

  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;

  if (!projectId || !apiKey) {
    console.error("[API/analyze] Firebase env vars missing");
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
    console.error("[API/analyze] Error initializing Firebase:", error);
    return null;
  }
}

// ─── Generador de análisis de pádel ─────────────────────────────────────

const NOMBRES = ["Martín","Gonzalo","Facundo","Tomás","Santiago","Nicolás","Mateo","Rafael","Esteban","Diego","Javier","Lucas","Mariano","Pablo","Alejandro"];
const APELLIDOS = ["García","Rodríguez","Martínez","López","González","Hernández","Díaz","Torres","Romero","Ruiz","Sánchez","Pérez","Fernández","Suárez","Alvarez"];

function rand(min: number, max: number) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function randomName() { return `${NOMBRES[rand(0, NOMBRES.length-1)]} ${APELLIDOS[rand(0, APELLIDOS.length-1)]}`; }

function generateAnalysis() {
  const setScores: [number, number][] = [[6,4],[6,3],[6,2],[7,5],[6,1],[4,6],[3,6],[2,6],[5,7]];
  const totalSets = Math.random() > 0.5 ? 3 : 2;
  const sets: [number, number][] = [];
  let t1 = 0, t2 = 0;
  for (let i = 0; i < totalSets; i++) {
    if (t1 === 2 || t2 === 2) break;
    const s = setScores[rand(0, setScores.length-1)];
    if (s[0] > s[1]) t1++; else t2++;
    sets.push(s);
  }
  const winner: 1|2 = t1 > t2 ? 1 : 2;
  const hours = rand(1,2), mins = rand(10,55);

  const wb = winner === 1 ? 1.15 : 0.85;
  const lb = winner === 1 ? 0.85 : 1.15;

  const teamStats = [
    {
      teamNumber: 1 as const,
      totalPoints: rand(35,75),
      winners: Math.round(rand(12,28) * wb),
      unforcedErrors: Math.round(rand(10,22) * (winner===1?0.8:1.2)),
      forcedErrors: Math.round(rand(6,15) * (winner===1?0.9:1.1)),
      aces: rand(2,8), doubleFaults: rand(1,5),
      smashWinRate: Math.round(rand(55,80) * wb),
      volleyWinRate: Math.round(rand(50,75) * wb),
      returnWinRate: Math.round(rand(40,65) * wb),
      breakPointsWon: rand(3,10), breakPointsTotal: rand(8,18),
    },
    {
      teamNumber: 2 as const,
      totalPoints: rand(35,75),
      winners: Math.round(rand(12,28) * lb),
      unforcedErrors: Math.round(rand(10,22) * (winner===2?0.8:1.2)),
      forcedErrors: Math.round(rand(6,15) * (winner===2?0.9:1.1)),
      aces: rand(2,8), doubleFaults: rand(1,5),
      smashWinRate: Math.round(rand(55,80) * lb),
      volleyWinRate: Math.round(rand(50,75) * lb),
      returnWinRate: Math.round(rand(40,65) * lb),
      breakPointsWon: rand(3,10), breakPointsTotal: rand(8,18),
    },
  ];

  const playerNames = [randomName(), randomName(), randomName(), randomName()];
  const playerStats = playerNames.map((name, i) => {
    const team = (i < 2 ? 1 : 2) as 1|2;
    const isW = team === winner;
    const position = (i % 2 === 0 ? "derecha" : "revés") as "derecha"|"revés";
    return {
      name, team, position,
      winners: Math.round(rand(5,15) * (isW?1.1:0.9)),
      unforcedErrors: Math.round(rand(4,12) * (isW?0.85:1.15)),
      forcedErrors: Math.round(rand(2,8) * (isW?0.9:1.1)),
      smashSuccess: rand(3,10), smashTotal: rand(6,15),
      volleySuccess: rand(8,20), volleyTotal: rand(12,28),
      bandejaSuccess: rand(4,12), bandejaTotal: rand(6,16),
      viboraSuccess: rand(2,8), viboraTotal: rand(4,12),
      globoSuccess: rand(2,6), globoTotal: rand(4,10),
      dropShotSuccess: rand(1,5), dropShotTotal: rand(2,8),
      serveSpeed: rand(140,185),
      serveWinRate: Math.round(rand(50,75) * (isW?1.1:0.9)),
      returnWinRate: Math.round(rand(35,60) * (isW?1.1:0.9)),
    };
  });

  const heatmap = [
    { zone:"fondo_derecha", x:20, y:75, count:rand(5,20), type:"rally" },
    { zone:"fondo_izquierda", x:80, y:75, count:rand(5,18), type:"error" },
    { zone:"fondo_centro", x:50, y:80, count:rand(8,25), type:"rally" },
    { zone:"medio_derecha", x:25, y:55, count:rand(4,15), type:"winner" },
    { zone:"medio_izquierda", x:75, y:55, count:rand(3,12), type:"rally" },
    { zone:"red_derecha", x:20, y:30, count:rand(10,30), type:"winner" },
    { zone:"red_izquierda", x:80, y:30, count:rand(8,25), type:"winner" },
    { zone:"red_centro", x:50, y:25, count:rand(12,35), type:"rally" },
    { zone:"saque_derecha", x:30, y:92, count:rand(3,10), type:"rally" },
    { zone:"saque_izquierda", x:70, y:92, count:rand(3,10), type:"rally" },
  ];

  const possessionBySet = sets.map((_, i) => {
    const t1p = rand(48,62);
    return { setNumber: i+1, team1: winner===1?t1p:100-t1p, team2: winner===1?100-t1p:t1p };
  });

  const clips = [
    { id:"clip-1", title:"Smash ganador decisivo", startTime:rand(120,600), endTime:0, type:"winner" as const },
    { id:"clip-2", title:"Volea cruzada brillante", startTime:rand(300,1200), endTime:0, type:"winner" as const },
    { id:"clip-3", title:"Error no forzado en punto clave", startTime:rand(600,1800), endTime:0, type:"error" as const },
    { id:"clip-4", title:"Punto increíble - rally largo", startTime:rand(900,2400), endTime:0, type:"amazing_point" as const },
    { id:"clip-5", title:"Break point convertido", startTime:rand(200,900), endTime:0, type:"key_point" as const },
    { id:"clip-6", title:"Bandeja perfecta", startTime:rand(400,1500), endTime:0, type:"winner" as const },
  ].map(c => ({ ...c, endTime: c.startTime + rand(8,25) }));

  const wStats = teamStats[winner-1];
  const lStats = teamStats[winner===1?1:0];
  const winnerNames = winner === 1 ? `${playerNames[0]} y ${playerNames[1]}` : `${playerNames[2]} y ${playerNames[3]}`;
  const loserNames = winner === 1 ? `${playerNames[2]} y ${playerNames[3]}` : `${playerNames[0]} y ${playerNames[1]}`;
  const setsStr = sets.map(s => `${s[0]}-${s[1]}`).join(", ");

  let aiSummary = `Victoria para ${winnerNames} por ${setsStr} en ${hours}h ${mins}min. `;
  aiSummary += `El equipo ganador registró ${wStats.winners} winners contra ${lStats.winners} del rival, `;
  aiSummary += `con ${wStats.unforcedErrors} errores no forzados frente a los ${lStats.unforcedErrors} de ${loserNames}. `;
  if (wStats.smashWinRate > 65) aiSummary += `Destacó la efectividad en smash con ${wStats.smashWinRate}%. `;
  if (wStats.volleyWinRate > 60) aiSummary += `La volea fue clave con ${wStats.volleyWinRate}% de efectividad. `;
  aiSummary += `${loserNames} desaprovechó ${lStats.breakPointsTotal - lStats.breakPointsWon} de ${lStats.breakPointsTotal} oportunidades de break.`;

  const keyMetrics = [
    { label:"Winners", value:`${wStats.winners + lStats.winners} totales`, team1Value:teamStats[0].winners, team2Value:teamStats[1].winners, higherIsBetter:true },
    { label:"Errores no forzados", value:`${wStats.unforcedErrors + lStats.unforcedErrors} totales`, team1Value:teamStats[0].unforcedErrors, team2Value:teamStats[1].unforcedErrors, higherIsBetter:false },
    { label:"Efectividad Smash", value:"Promedio", team1Value:teamStats[0].smashWinRate, team2Value:teamStats[1].smashWinRate, higherIsBetter:true },
    { label:"Efectividad Volea", value:"Promedio", team1Value:teamStats[0].volleyWinRate, team2Value:teamStats[1].volleyWinRate, higherIsBetter:true },
    { label:"Break points", value:"Convertidos", team1Value:teamStats[0].breakPointsWon, team2Value:teamStats[1].breakPointsWon, higherIsBetter:true },
    { label:"Efectividad Resto", value:"Puntos ganados", team1Value:teamStats[0].returnWinRate, team2Value:teamStats[1].returnWinRate, higherIsBetter:true },
  ];

  // ⚠️ IMPORTANTE: Convertir sets de [[6,4],[7,5]] a [{t1:6,t2:4},{t1:7,t2:5}]
  // Firestore NO soporta arrays anidados (array de arrays)
  const firestoreSets = sets.map(s => ({ t1: s[0], t2: s[1] }));

  return {
    result: { sets: firestoreSets, winner, duration: `${hours}h ${mins}min`, totalPoints: sets.reduce((a,s)=>a+s[0]+s[1],0) },
    teamStats,
    playerStats,
    shotHeatmap: heatmap,
    possessionBySet,
    clips,
    aiSummary,
    keyMetrics,
  };
}

// ─── POST /api/analyze ──────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { matchId } = body;

    if (!matchId) {
      return NextResponse.json({ error: "matchId es requerido" }, { status: 400 });
    }

    console.log(`[API/analyze] Iniciando análisis para match: ${matchId}`);

    const database = getServerDb();
    if (!database) {
      return NextResponse.json({ error: "Firebase no configurado en el servidor" }, { status: 500 });
    }

    // 1. Marcar como "processing"
    const matchRef = doc(database, "matches", matchId);
    await updateDoc(matchRef, { status: "processing" });
    console.log("[API/analyze] Estado → processing");

    // 2. Simular tiempo de procesamiento (como si procesara el video)
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // 3. Generar análisis (ya en formato Firestore-compatible)
    const analysis = generateAnalysis();
    const analysisId = `analysis-${Date.now()}`;
    console.log("[API/analyze] Análisis generado, guardando en Firestore...");

    // 4. Guardar análisis en subcolección
    const analysisRef = doc(database, "matches", matchId, "analysis", analysisId);
    await setDoc(analysisRef, {
      ...analysis,
      id: analysisId,
      matchId,
      createdAt: serverTimestamp(),
    });

    // 5. Actualizar partido a "analyzed"
    await updateDoc(matchRef, {
      status: "analyzed",
      analysisId,
      analyzedAt: serverTimestamp(),
    });

    console.log("[API/analyze] Estado → analyzed ✓");

    return NextResponse.json({
      success: true,
      matchId,
      analysisId,
      message: "Análisis completado correctamente",
    });
  } catch (error: unknown) {
    console.error("[API/analyze] Error:", error);
    const message = error instanceof Error ? error.message : "Error desconocido";

    // Intentar marcar el partido como error
    try {
      const body = await request.clone().json().catch(() => ({}));
      if (body.matchId) {
        const database = getServerDb();
        if (database) {
          const matchRef = doc(database, "matches", body.matchId);
          await updateDoc(matchRef, { status: "error", errorMessage: message });
        }
      }
    } catch {
      // Silenciar error secundario
    }

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
