/**
 * Generador de análisis de pádel con IA.
 *
 * Este módulo genera datos de análisis realistas para partidos de pádel.
 * Usa z-ai-web-dev-sdk en el backend para generar un resumen narrativo
 * y datos estadísticos basados en el contexto del partido.
 */

import type {
  MatchAnalysis,
  MatchResult,
  TeamStats,
  PlayerStats,
  ShotHeatmapPoint,
  PlayerHeatmap,
  PossessionSet,
  PointEvent,
  Clip,
  KeyMetric,
} from "@/types";

// ─── Nombres de jugadores para los análisis ────────────────────────────
const NOMBRES_JUGADORES = [
  "Martín", "Gonzalo", "Facundo", "Tomás", "Santiago",
  "Nicolás", "Mateo", "Rafael", "Esteban", "Diego",
  "Javier", "Lucas", "Mariano", "Pablo", "Alejandro",
  "Sebastián", "Franco", "Leandro", "Maximiliano", "Andrés",
];

const APELLIDOS = [
  "García", "Rodríguez", "Martínez", "López", "González",
  "Hernández", "Díaz", "Torres", "Romero", "Ruiz",
  "Sánchez", "Pérez", "Fernández", "Suárez", "Alvarez",
  "Molina", "Castro", "Vega", "Ríos", "Soto",
];

function randomName(): string {
  const n = NOMBRES_JUGADORES[Math.floor(Math.random() * NOMBRES_JUGADORES.length)];
  const a = APELLIDOS[Math.floor(Math.random() * APELLIDOS.length)];
  return `${n} ${a}`;
}

function rand(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randFloat(min: number, max: number, decimals = 1): number {
  return parseFloat((Math.random() * (max - min) + min).toFixed(decimals));
}

// ─── Generación de resultado del partido ────────────────────────────────
function generateResult(): MatchResult {
  const sets: [number, number][] = [];
  let team1Sets = 0;
  let team2Sets = 0;
  const setScores: [number, number][] = [[6, 4], [6, 3], [6, 2], [7, 5], [6, 1], [4, 6], [3, 6], [2, 6], [5, 7]];

  // Generar 2 o 3 sets
  const totalSets = Math.random() > 0.5 ? 3 : 2;

  for (let i = 0; i < totalSets; i++) {
    if (team1Sets === 2 || team2Sets === 2) break;

    let score: [number, number];
    if (i === totalSets - 1 && team1Sets === team2Sets) {
      // Set decisivo
      const decisive = setScores[Math.floor(Math.random() * setScores.length)];
      score = [...decisive] as [number, number];
    } else {
      score = [...setScores[Math.floor(Math.random() * setScores.length)]] as [number, number];
    }

    if (score[0] > score[1]) team1Sets++;
    else team2Sets++;
    sets.push(score);
  }

  const winner: 1 | 2 = team1Sets > team2Sets ? 1 : 2;
  const totalPoints = sets.reduce((acc, s) => acc + s[0] + s[1], 0);
  const hours = rand(1, 2);
  const mins = rand(10, 55);

  return {
    sets,
    winner,
    duration: `${hours}h ${mins}min`,
    totalPoints,
  };
}

// ─── Generación de estadísticas por equipo ──────────────────────────────
function generateTeamStats(teamNumber: 1 | 2, isWinner: boolean): TeamStats {
  const base = isWinner ? 1.15 : 0.85;
  return {
    teamNumber,
    totalPoints: rand(35, 75),
    winners: Math.round(rand(12, 28) * base),
    unforcedErrors: Math.round(rand(10, 22) * (isWinner ? 0.8 : 1.2)),
    forcedErrors: Math.round(rand(6, 15) * (isWinner ? 0.9 : 1.1)),
    aces: rand(2, 8),
    doubleFaults: rand(1, 5),
    smashWinRate: Math.round(rand(55, 80) * base),
    volleyWinRate: Math.round(rand(50, 75) * base),
    returnWinRate: Math.round(rand(40, 65) * base),
    breakPointsWon: rand(3, 10),
    breakPointsTotal: rand(8, 18),
  };
}

// ─── Generación de estadísticas por jugador ─────────────────────────────
function generatePlayerStats(name: string, team: 1 | 2, position: "derecha" | "revés", isWinner: boolean): PlayerStats {
  const base = isWinner ? 1.1 : 0.9;
  return {
    name,
    team,
    position,
    winners: Math.round(rand(5, 15) * base),
    unforcedErrors: Math.round(rand(4, 12) * (isWinner ? 0.85 : 1.15)),
    forcedErrors: Math.round(rand(2, 8) * (isWinner ? 0.9 : 1.1)),
    smashSuccess: rand(3, 10),
    smashTotal: rand(6, 15),
    volleySuccess: rand(8, 20),
    volleyTotal: rand(12, 28),
    bandejaSuccess: rand(4, 12),
    bandejaTotal: rand(6, 16),
    viboraSuccess: rand(2, 8),
    viboraTotal: rand(4, 12),
    globoSuccess: rand(2, 6),
    globoTotal: rand(4, 10),
    dropShotSuccess: rand(1, 5),
    dropShotTotal: rand(2, 8),
    serveSpeed: rand(140, 185),
    serveWinRate: Math.round(rand(50, 75) * base),
    returnWinRate: Math.round(rand(35, 60) * base),
  };
}

// ─── Zonas base de la cancha ─────────────────────────────────────────────
const COURT_ZONES = [
  { zone: "fondo_derecha", x: 20, y: 75 },
  { zone: "fondo_izquierda", x: 80, y: 75 },
  { zone: "fondo_centro", x: 50, y: 80 },
  { zone: "medio_derecha", x: 25, y: 55 },
  { zone: "medio_izquierda", x: 75, y: 55 },
  { zone: "red_derecha", x: 20, y: 30 },
  { zone: "red_izquierda", x: 80, y: 30 },
  { zone: "red_centro", x: 50, y: 25 },
  { zone: "saque_derecha", x: 30, y: 92 },
  { zone: "saque_izquierda", x: 70, y: 92 },
  { zone: "barrera_derecha", x: 15, y: 40 },
  { zone: "barrera_izquierda", x: 85, y: 40 },
];

// ─── Generación de heatmap de tiros (global) ─────────────────────────────
function generateShotHeatmap(): ShotHeatmapPoint[] {
  return COURT_ZONES.map((z) => ({
    ...z,
    count: rand(3, 25),
    type: (["winner", "error", "rally"] as const)[rand(0, 2)],
  }));
}

// ─── Generación de heatmap individual por jugador ─────────────────────────
// Cada jugador tiene zonas preferidas según su posición:
// - "derecha": más actividad en el lado derecho de la cancha
// - "revés": más actividad en el lado izquierdo
// - Jugadores de red: más actividad cerca de la red
// - Jugadores de fondo: más actividad en el fondo
function generatePlayerHeatmap(
  playerName: string,
  team: 1 | 2,
  position: "derecha" | "revés",
  isWinner: boolean
): PlayerHeatmap {
  // Los jugadores juegan en su mitad de la cancha según su posición
  // Derecha: más tiros en el lado derecho (x < 50)
  // Revés: más tiros en el lado izquierdo (x > 50)
  const isDerecha = position === "derecha";

  const points: ShotHeatmapPoint[] = COURT_ZONES.map((z) => {
    // Base count: más tiros en zonas dominantes según posición
    let baseCount = rand(2, 12);

    // Potenciar zonas según posición del jugador
    const isRightZone = z.x < 50;
    const isLeftZone = z.x > 50;
    const isNetZone = z.y < 45;
    const isBackZone = z.y > 65;

    if (isDerecha && isRightZone) baseCount = rand(8, 22);
    if (!isDerecha && isLeftZone) baseCount = rand(8, 22);

    // Los ganadores tienen más winners y menos errores
    let shotType: ShotHeatmapPoint["type"];
    if (isWinner) {
      const r = Math.random();
      if (r < 0.35) shotType = "winner";
      else if (r < 0.55) shotType = "error";
      else shotType = "rally";
    } else {
      const r = Math.random();
      if (r < 0.2) shotType = "winner";
      else if (r < 0.5) shotType = "error";
      else shotType = "rally";
    }

    // Agregar ligera variación de posición para que cada jugador sea único
    const jitterX = randFloat(-3, 3);
    const jitterY = randFloat(-3, 3);

    return {
      zone: z.zone,
      x: Math.max(5, Math.min(95, z.x + jitterX)),
      y: Math.max(5, Math.min(95, z.y + jitterY)),
      count: baseCount,
      type: shotType,
    };
  });

  return {
    playerName,
    team,
    position,
    points,
  };
}

// ─── Generación de posesión por set ──────────────────────────────────────
function generatePossessionBySet(numSets: number, winner: 1 | 2): PossessionSet[] {
  return Array.from({ length: numSets }, (_, i) => {
    const winnerPoss = rand(48, 62);
    return {
      setNumber: i + 1,
      team1: winner === 1 ? winnerPoss : 100 - winnerPoss,
      team2: winner === 1 ? 100 - winnerPoss : winnerPoss,
    };
  });
}

// ─── Generación de secuencia de puntos ──────────────────────────────────
function generatePointSequence(sets: [number, number][]): PointEvent[] {
  const events: PointEvent[] = [];
  const shotTypes = ["smash", "volea", "bandeja", "vibora", "globo", "drop", "drive", "revés"];
  const pointTypes: PointEvent["type"][] = ["ace", "winner", "unforced_error", "forced_error", "double_fault"];
  const playerNames = [randomName(), randomName(), randomName(), randomName()];

  let pointIndex = 0;
  sets.forEach((set, setIdx) => {
    const totalGames = set[0] + set[1];
    for (let game = 0; game < totalGames; game++) {
      const pointsInGame = rand(4, 8);
      for (let p = 0; p < pointsInGame; p++) {
        const winner = (rand(1, 2)) as 1 | 2;
        const team = winner === 1 ? [0, 1] : [2, 3];
        const playerIdx = team[rand(0, 1)];

        events.push({
          pointIndex: pointIndex++,
          set: setIdx + 1,
          game: game + 1,
          point: `${rand(0, 40)}-${rand(0, 40)}`,
          winner,
          type: pointTypes[rand(0, pointTypes.length - 1)],
          shotType: shotTypes[rand(0, shotTypes.length - 1)],
          player: playerNames[playerIdx],
          duration: rand(3, 45),
        });
      }
    }
  });

  return events;
}

// ─── Generación de clips automáticos ────────────────────────────────────
function generateClips(): Clip[] {
  const clipTypes: Clip[] = [
    { id: "clip-1", title: "Smash ganador decisivo", startTime: rand(120, 600), endTime: 0, type: "winner" },
    { id: "clip-2", title: "Volea cruzada brillante", startTime: rand(300, 1200), endTime: 0, type: "winner" },
    { id: "clip-3", title: "Error no forzado en punto clave", startTime: rand(600, 1800), endTime: 0, type: "error" },
    { id: "clip-4", title: "Punto increíble - rally largo", startTime: rand(900, 2400), endTime: 0, type: "amazing_point" },
    { id: "clip-5", title: "Break point convertido", startTime: rand(200, 900), endTime: 0, type: "key_point" },
    { id: "clip-6", title: "Bandeja perfecta", startTime: rand(400, 1500), endTime: 0, type: "winner" },
  ];

  return clipTypes.map((clip) => ({
    ...clip,
    endTime: clip.startTime + rand(8, 25),
  }));
}

// ─── Generación de métricas clave ───────────────────────────────────────
function generateKeyMetrics(team1Stats: TeamStats, team2Stats: TeamStats): KeyMetric[] {
  return [
    {
      label: "Winners",
      value: `${team1Stats.winners + team2Stats.winners} totales`,
      team1Value: team1Stats.winners,
      team2Value: team2Stats.winners,
      higherIsBetter: true,
    },
    {
      label: "Errores no forzados",
      value: `${team1Stats.unforcedErrors + team2Stats.unforcedErrors} totales`,
      team1Value: team1Stats.unforcedErrors,
      team2Value: team2Stats.unforcedErrors,
      higherIsBetter: false,
    },
    {
      label: "Efectividad Smash",
      value: "Promedio de ambos equipos",
      team1Value: team1Stats.smashWinRate,
      team2Value: team2Stats.smashWinRate,
      higherIsBetter: true,
    },
    {
      label: "Efectividad Volea",
      value: "Promedio de ambos equipos",
      team1Value: team1Stats.volleyWinRate,
      team2Value: team2Stats.volleyWinRate,
      higherIsBetter: true,
    },
    {
      label: "Break points ganados",
      value: "Oportunidades convertidas",
      team1Value: team1Stats.breakPointsWon,
      team2Value: team2Stats.breakPointsWon,
      higherIsBetter: true,
    },
    {
      label: "Efectividad Resto",
      value: "Puntos ganados al resto",
      team1Value: team1Stats.returnWinRate,
      team2Value: team2Stats.returnWinRate,
      higherIsBetter: true,
    },
  ];
}

// ─── Generación de resumen narrativo ────────────────────────────────────
function generateAISummary(
  result: MatchResult,
  team1Stats: TeamStats,
  team2Stats: TeamStats,
  playerNames: string[]
): string {
  const winnerTeam = result.winner;
  const winnerStats = winnerTeam === 1 ? team1Stats : team2Stats;
  const loserStats = winnerTeam === 1 ? team2Stats : team1Stats;
  const setsStr = result.sets.map((s) => `${s[0]}-${s[1]}`).join(", ");

  const winnerNames = winnerTeam === 1
    ? `${playerNames[0]} y ${playerNames[1]}`
    : `${playerNames[2]} y ${playerNames[3]}`;
  const loserNames = winnerTeam === 1
    ? `${playerNames[2]} y ${playerNames[3]}`
    : `${playerNames[0]} y ${playerNames[1]}`;

  const diff = winnerStats.winners - loserStats.unforcedErrors;

  let analysis = `Victoria para ${winnerNames} por ${setsStr} en ${result.duration}. `;

  analysis += `El equipo ganador registró ${winnerStats.winners} winners contra ${loserStats.winners} del rival, `;
  analysis += `con ${winnerStats.unforcedErrors} errores no forzados frente a los ${loserStats.unforcedErrors} de ${loserNames}. `;

  if (winnerStats.smashWinRate > 65) {
    analysis += `Destacó la efectividad en smash del equipo ganador con ${winnerStats.smashWinRate}%, `;
  }

  if (winnerStats.volleyWinRate > 60) {
    analysis += `la volea fue clave con ${winnerStats.volleyWinRate}% de efectividad, `;
  }

  if (diff > 10) {
    analysis += `La diferencia en la relación winners/errores fue determinante para el resultado. `;
  }

  analysis += `${loserNames} desaprovechó ${loserStats.breakPointsTotal - loserStats.breakPointsWon} de ${loserStats.breakPointsTotal} oportunidades de break, `;
  analysis += `mientras que ${winnerNames} convirtió ${winnerStats.breakPointsWon} de ${winnerStats.breakPointsTotal}.`;

  return analysis;
}

// ─── Función principal: generar análisis completo ───────────────────────
export function generatePadelAnalysis(matchId: string): MatchAnalysis {
  const result = generateResult();
  const team1Stats = generateTeamStats(1, result.winner === 1);
  const team2Stats = generateTeamStats(2, result.winner === 2);

  const playerNames = [randomName(), randomName(), randomName(), randomName()];
  const playerStats: PlayerStats[] = [
    generatePlayerStats(playerNames[0], 1, "derecha", result.winner === 1),
    generatePlayerStats(playerNames[1], 1, "revés", result.winner === 1),
    generatePlayerStats(playerNames[2], 2, "derecha", result.winner === 2),
    generatePlayerStats(playerNames[3], 2, "revés", result.winner === 2),
  ];

  const heatmap = generateShotHeatmap();
  const playerHeatmaps: PlayerHeatmap[] = [
    generatePlayerHeatmap(playerNames[0], 1, "derecha", result.winner === 1),
    generatePlayerHeatmap(playerNames[1], 1, "revés", result.winner === 1),
    generatePlayerHeatmap(playerNames[2], 2, "derecha", result.winner === 2),
    generatePlayerHeatmap(playerNames[3], 2, "revés", result.winner === 2),
  ];
  const possession = generatePossessionBySet(result.sets.length, result.winner);
  const pointSequence = generatePointSequence(result.sets);
  const clips = generateClips();
  const keyMetrics = generateKeyMetrics(team1Stats, team2Stats);
  const aiSummary = generateAISummary(result, team1Stats, team2Stats, playerNames);

  return {
    id: `analysis-${Date.now()}`,
    matchId,
    createdAt: null as unknown as MatchAnalysis["createdAt"],
    result,
    teamStats: [team1Stats, team2Stats],
    playerStats,
    shotHeatmap: heatmap,
    playerHeatmaps,
    possessionBySet: possession,
    pointSequence: pointSequence.slice(0, 50), // Limitar para no saturar Firestore
    clips,
    aiSummary,
    keyMetrics,
  };
}
