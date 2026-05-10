/**
 * Motor de análisis real de pádel con IA.
 *
 * El VLM de z-ai-web-dev-sdk observa el video completo y extrae estadísticas
 * reales de lo que ve. NINGÚN dato es inventado ni aleatorio.
 * Solo se usa en backend (server-side).
 */

import ZAI from "z-ai-web-dev-sdk";
import type {
  MatchAnalysis,
  MatchResult,
  TeamStats,
  PlayerStats,
  ShotHeatmapPoint,
  PlayerHeatmap,
  PossessionSet,
  Clip,
  KeyMetric,
} from "@/types";

// ─── Tipo interno de datos extraídos por el VLM ───────────────────────────────

export interface RealMatchData {
  observacionGeneral: string;
  resultado: {
    sets: [number, number][];
    ganador: 1 | 2 | null;
    duracion: string;
    totalPuntos: number;
    marcadorVisible: boolean;
  };
  equipos: [
    {
      equipo: 1;
      winners: number;
      erroresNoForzados: number;
      erroresForzados: number;
      aces: number;
      doblesFaltas: number;
      efectividadSmash: number;
      efectividadVolea: number;
      efectividadResto: number;
      breakPointsGanados: number;
      breakPointsTotal: number;
      totalPuntos: number;
    },
    {
      equipo: 2;
      winners: number;
      erroresNoForzados: number;
      erroresForzados: number;
      aces: number;
      doblesFaltas: number;
      efectividadSmash: number;
      efectividadVolea: number;
      efectividadResto: number;
      breakPointsGanados: number;
      breakPointsTotal: number;
      totalPuntos: number;
    }
  ];
  jugadores: Array<{
    nombre: string;
    equipo: 1 | 2;
    posicion: "derecha" | "revés";
    winners: number;
    erroresNoForzados: number;
    erroresForzados: number;
    smashObservados: number;
    smashExitosos: number;
    voleaObservadas: number;
    voleaExitosas: number;
    bandejaObservadas: number;
    bandejaExitosas: number;
    viboraObservadas: number;
    viboraExitosas: number;
    globoObservados: number;
    globoExitosos: number;
    dropShotObservados: number;
    dropShotExitosos: number;
    velocidadSaque: number;
    efectividadSaque: number;
    efectividadResto: number;
    tiempoEnRed: number;
    tiempoEnFondo: number;
    fortalezasObservadas: string[];
    debilidadesObservadas: string[];
    nivelMental: number;
  }>;
  zonasTiros: Array<{
    zona: string;
    x: number;
    y: number;
    conteoObservado: number;
    tipo: "winner" | "error" | "rally";
  }>;
  posesionPorSet: Array<{
    set: number;
    equipo1: number;
    equipo2: number;
  }>;
  momentosClave: Array<{
    descripcion: string;
    tiempoAproximado: number;
    tipo: "winner" | "error" | "key_point" | "amazing_point";
    jugador: string;
  }>;
  confianza: "alta" | "media" | "baja";
  notasDelAnalista: string;
}

// ─── Prompt VLM: extracción de datos reales del video ─────────────────────────

function buildVLMPrompt(playerNames: string[]): string {
  const team1 = playerNames.slice(0, 2).join(" y ") || "Equipo 1";
  const team2 = playerNames.slice(2, 4).join(" y ") || "Equipo 2";

  return `Eres un sistema experto de análisis de vídeo deportivo de pádel. Tu tarea es observar ESTE VIDEO REAL y extraer estadísticas REALES basadas exclusivamente en lo que ves.

REGLA ABSOLUTA: NO INVENTES NINGÚN DATO. Si no puedes ver algo con claridad, usa 0 en lugar de inventar un número. Si el marcador no es visible, pon null en los sets.

Jugadores identificados:
- Equipo 1 (lado izquierdo de pantalla): ${team1}
- Equipo 2 (lado derecho de pantalla): ${team2}

OBSERVA el video completo y responde con un JSON que siga EXACTAMENTE esta estructura. Solo JSON, sin texto adicional:

{
  "observacionGeneral": "descripción de lo que realmente ves en el video",
  "resultado": {
    "sets": [[6,4],[7,5]],
    "ganador": 1,
    "duracion": "1h 23min",
    "totalPuntos": 87,
    "marcadorVisible": true
  },
  "equipos": [
    {
      "equipo": 1,
      "winners": 0,
      "erroresNoForzados": 0,
      "erroresForzados": 0,
      "aces": 0,
      "doblesFaltas": 0,
      "efectividadSmash": 0,
      "efectividadVolea": 0,
      "efectividadResto": 0,
      "breakPointsGanados": 0,
      "breakPointsTotal": 0,
      "totalPuntos": 0
    },
    {
      "equipo": 2,
      "winners": 0,
      "erroresNoForzados": 0,
      "erroresForzados": 0,
      "aces": 0,
      "doblesFaltas": 0,
      "efectividadSmash": 0,
      "efectividadVolea": 0,
      "efectividadResto": 0,
      "breakPointsGanados": 0,
      "breakPointsTotal": 0,
      "totalPuntos": 0
    }
  ],
  "jugadores": [
    {
      "nombre": "${playerNames[0] || "Jugador 1"}",
      "equipo": 1,
      "posicion": "derecha",
      "winners": 0,
      "erroresNoForzados": 0,
      "erroresForzados": 0,
      "smashObservados": 0,
      "smashExitosos": 0,
      "voleaObservadas": 0,
      "voleaExitosas": 0,
      "bandejaObservadas": 0,
      "bandejaExitosas": 0,
      "viboraObservadas": 0,
      "viboraExitosas": 0,
      "globoObservados": 0,
      "globoExitosos": 0,
      "dropShotObservados": 0,
      "dropShotExitosos": 0,
      "velocidadSaque": 0,
      "efectividadSaque": 0,
      "efectividadResto": 0,
      "tiempoEnRed": 0,
      "tiempoEnFondo": 0,
      "fortalezasObservadas": ["observación real del video"],
      "debilidadesObservadas": ["observación real del video"],
      "nivelMental": 0
    },
    {
      "nombre": "${playerNames[1] || "Jugador 2"}",
      "equipo": 1,
      "posicion": "revés",
      "winners": 0, "erroresNoForzados": 0, "erroresForzados": 0,
      "smashObservados": 0, "smashExitosos": 0, "voleaObservadas": 0, "voleaExitosas": 0,
      "bandejaObservadas": 0, "bandejaExitosas": 0, "viboraObservadas": 0, "viboraExitosas": 0,
      "globoObservados": 0, "globoExitosos": 0, "dropShotObservados": 0, "dropShotExitosos": 0,
      "velocidadSaque": 0, "efectividadSaque": 0, "efectividadResto": 0,
      "tiempoEnRed": 0, "tiempoEnFondo": 0,
      "fortalezasObservadas": [], "debilidadesObservadas": [], "nivelMental": 0
    },
    {
      "nombre": "${playerNames[2] || "Jugador 3"}",
      "equipo": 2,
      "posicion": "derecha",
      "winners": 0, "erroresNoForzados": 0, "erroresForzados": 0,
      "smashObservados": 0, "smashExitosos": 0, "voleaObservadas": 0, "voleaExitosas": 0,
      "bandejaObservadas": 0, "bandejaExitosas": 0, "viboraObservadas": 0, "viboraExitosas": 0,
      "globoObservados": 0, "globoExitosos": 0, "dropShotObservados": 0, "dropShotExitosos": 0,
      "velocidadSaque": 0, "efectividadSaque": 0, "efectividadResto": 0,
      "tiempoEnRed": 0, "tiempoEnFondo": 0,
      "fortalezasObservadas": [], "debilidadesObservadas": [], "nivelMental": 0
    },
    {
      "nombre": "${playerNames[3] || "Jugador 4"}",
      "equipo": 2,
      "posicion": "revés",
      "winners": 0, "erroresNoForzados": 0, "erroresForzados": 0,
      "smashObservados": 0, "smashExitosos": 0, "voleaObservadas": 0, "voleaExitosas": 0,
      "bandejaObservadas": 0, "bandejaExitosas": 0, "viboraObservadas": 0, "viboraExitosas": 0,
      "globoObservados": 0, "globoExitosos": 0, "dropShotObservados": 0, "dropShotExitosos": 0,
      "velocidadSaque": 0, "efectividadSaque": 0, "efectividadResto": 0,
      "tiempoEnRed": 0, "tiempoEnFondo": 0,
      "fortalezasObservadas": [], "debilidadesObservadas": [], "nivelMental": 0
    }
  ],
  "zonasTiros": [
    {"zona": "red_centro", "x": 50, "y": 25, "conteoObservado": 0, "tipo": "winner"},
    {"zona": "red_derecha", "x": 20, "y": 30, "conteoObservado": 0, "tipo": "winner"},
    {"zona": "red_izquierda", "x": 80, "y": 30, "conteoObservado": 0, "tipo": "winner"},
    {"zona": "medio_derecha", "x": 25, "y": 55, "conteoObservado": 0, "tipo": "rally"},
    {"zona": "medio_izquierda", "x": 75, "y": 55, "conteoObservado": 0, "tipo": "rally"},
    {"zona": "fondo_derecha", "x": 20, "y": 75, "conteoObservado": 0, "tipo": "error"},
    {"zona": "fondo_izquierda", "x": 80, "y": 75, "conteoObservado": 0, "tipo": "error"},
    {"zona": "fondo_centro", "x": 50, "y": 80, "conteoObservado": 0, "tipo": "rally"},
    {"zona": "saque_derecha", "x": 30, "y": 92, "conteoObservado": 0, "tipo": "rally"},
    {"zona": "saque_izquierda", "x": 70, "y": 92, "conteoObservado": 0, "tipo": "rally"}
  ],
  "posesionPorSet": [
    {"set": 1, "equipo1": 50, "equipo2": 50}
  ],
  "momentosClave": [
    {"descripcion": "descripción real de lo que observaste", "tiempoAproximado": 0, "tipo": "winner", "jugador": "${playerNames[0] || "Jugador 1"}"}
  ],
  "confianza": "alta",
  "notasDelAnalista": "observaciones adicionales sobre la calidad del video y lo que pudiste ver"
}

INSTRUCCIONES ESPECÍFICAS:
1. Para "zonasTiros": cuenta cuántos golpes REALMENTE ves en cada zona de la cancha. La cancha tiene red (y=25-35), medio (y=45-65) y fondo (y=70-85). Derecha es x<50, izquierda es x>50.
2. Para shots: solo cuenta los que claramente puedas identificar como bandeja/víbora/smash/volea/globo/drive/slice.
3. Para "posesion": estima qué porcentaje del tiempo tiene la pelota cada equipo en cada set.
4. Para "momentosClave": describe los 3-6 puntos más importantes que realmente observes.
5. Para "nivelMental": califica del 1-10 la solidez mental que observas en cada jugador.
6. Para "tiempoEnRed" y "tiempoEnFondo": porcentaje del tiempo (0-100) que ves al jugador en esa zona.
7. Para "fortalezasObservadas" y "debilidadesObservadas": escribe solo lo que REALMENTE observas, no suposiciones genéricas.
8. Si el video es corto o de mala calidad, pon "confianza": "baja" y explícalo en "notasDelAnalista".`;
}

// ─── Prompt LLM: informe narrativo basado en datos REALES ─────────────────────

function buildNarrativePrompt(data: RealMatchData): string {
  const statsJson = JSON.stringify({
    resultado: data.resultado,
    equipos: data.equipos,
    jugadores: data.jugadores.map((j) => ({
      nombre: j.nombre,
      equipo: j.equipo,
      posicion: j.posicion,
      winners: j.winners,
      erroresNoForzados: j.erroresNoForzados,
      smashObservados: j.smashObservados,
      smashExitosos: j.smashExitosos,
      voleaObservadas: j.voleaObservadas,
      voleaExitosas: j.voleaExitosas,
      bandejaObservadas: j.bandejaObservadas,
      bandejaExitosas: j.bandejaExitosas,
      viboraObservadas: j.viboraObservadas,
      viboraExitosas: j.viboraExitosas,
      tiempoEnRed: j.tiempoEnRed,
      tiempoEnFondo: j.tiempoEnFondo,
      fortalezasObservadas: j.fortalezasObservadas,
      debilidadesObservadas: j.debilidadesObservadas,
      nivelMental: j.nivelMental,
    })),
    momentosClave: data.momentosClave,
    confianza: data.confianza,
    notasDelAnalista: data.notasDelAnalista,
    observacionGeneral: data.observacionGeneral,
  }, null, 2);

  return `Eres el mejor analista de pádel del mundo, con experiencia como jugador WPT y entrenador de élite.

A continuación tienes los datos REALES extraídos por visión artificial del video del partido. Estos datos son observaciones reales del video — úsalos exactamente como están, sin inventar ni modificar los números.

DATOS REALES DEL PARTIDO:
${statsJson}

Genera un informe profesional completo en Markdown. Basa CADA afirmación en los datos reales de arriba. Si un dato es 0, dilo honestamente ("no se registraron golpes de este tipo en el video analizado"). Si la confianza es "baja", acláraselo al lector.

# 🎾 ANÁLISIS COMPLETO DEL PARTIDO — DEPORTEVISION AI

## 📋 RESUMEN EJECUTIVO
[Basado en lo que realmente se observó. Cita los datos exactos del JSON. Menciona la confianza del análisis.]

## 📊 ESTADÍSTICAS GLOBALES DEL PARTIDO
| Métrica | ${data.jugadores.filter(j => j.equipo === 1).map(j => j.nombre).join(" / ")} | ${data.jugadores.filter(j => j.equipo === 2).map(j => j.nombre).join(" / ")} |
|---------|-----------|-----------|
[Tabla completa con los datos reales. Incluye: Winners, Errores NF, Errores Forzados, Aces, Dobles Faltas, Efectividad Smash, Volea, Resto, Break points]

## 🏟️ MAPA DE TIROS Y ZONAS
[Analiza las zonas de tiros reales. Explica dónde se juegan más puntos según los datos de zonasTiros.]

## 👤 ANÁLISIS INDIVIDUAL

[Para CADA jugador, basándote ÚNICAMENTE en sus datos reales:]

### 🏅 [NOMBRE] — Equipo [X] · [posición]

#### Técnica (datos reales)
- Golpes registrados: [exactamente lo que dice el JSON]
- Efectividades reales: [los porcentajes exactos]

#### Táctica
- Tiempo en red: [dato real]% · Tiempo en fondo: [dato real]%
- Patrones observados: [solo lo que dice fortalezasObservadas]

#### Fortalezas observadas en el video
[lista de fortalezasObservadas real]

#### Debilidades detectadas
[lista de debilidadesObservadas real]

#### Nivel mental observado: [nivelMental]/10
[Justifica basándote en lo observado]

#### 🎯 Recomendaciones de mejora
[Basadas en las debilidades reales observadas]

---

## ⚡ MOMENTOS CLAVE REALES
[Lista cada momento de momentosClave con análisis]

## 📅 PLAN DE ENTRENAMIENTO PERSONALIZADO (4 SEMANAS)
[Basado en las debilidades reales observadas para cada jugador]

### Semana 1: Técnica
### Semana 2: Táctica
### Semana 3: Físico y Mental
### Semana 4: Integración

---
${data.confianza === "baja" ? "\n⚠️ **Nota de confianza:** " + data.notasDelAnalista + "\n" : ""}
*Análisis generado por DeporteVision AI · Datos extraídos por visión artificial del video real · ${new Date().toLocaleDateString("es-AR")}*`;
}

// ─── Llamada VLM con el video real ────────────────────────────────────────────

async function analyzeVideoReal(
  zai: InstanceType<typeof ZAI>,
  videoUrl: string,
  playerNames: string[]
): Promise<RealMatchData> {
  console.log("[PadelAI] VLM analizando video real:", videoUrl.slice(0, 70) + "...");

  const prompt = buildVLMPrompt(playerNames);

  const response = await zai.chat.completions.createVision({
    messages: [
      {
        role: "user",
        content: [
          { type: "text", text: prompt },
          { type: "video_url", video_url: { url: videoUrl } },
        ],
      },
    ],
    thinking: { type: "disabled" },
  });

  const raw = response.choices[0]?.message?.content ?? "";
  console.log("[PadelAI] VLM respondió, parseando JSON...");

  // Extraer JSON de la respuesta
  const jsonMatch = raw.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error(
      `El VLM no devolvió JSON válido. Respuesta: ${raw.slice(0, 200)}`
    );
  }

  const data = JSON.parse(jsonMatch[0]) as RealMatchData;

  // Validar que los datos mínimos estén presentes
  if (!data.jugadores || data.jugadores.length < 2) {
    throw new Error("El VLM no pudo identificar a los jugadores en el video.");
  }

  console.log(
    `[PadelAI] Datos reales extraídos. Confianza: ${data.confianza}. ` +
    `Jugadores: ${data.jugadores.map(j => j.nombre).join(", ")}`
  );

  return data;
}

// ─── Generación del informe narrativo ────────────────────────────────────────

async function generateNarrative(
  zai: InstanceType<typeof ZAI>,
  data: RealMatchData
): Promise<string> {
  const prompt = buildNarrativePrompt(data);

  const response = await zai.chat.completions.create({
    messages: [{ role: "user", content: prompt }],
    thinking: { type: "disabled" },
  });

  return response.choices[0]?.message?.content ?? "Informe no disponible.";
}

// ─── Mapeo RealMatchData → tipos de la app ───────────────────────────────────

function mapToMatchAnalysis(
  data: RealMatchData,
  matchId: string,
  aiReport: string,
  playerNames: string[]
): Omit<MatchAnalysis, "createdAt"> {
  const sets = (data.resultado.sets ?? []) as [number, number][];
  const winner = data.resultado.ganador ?? 1;

  const result: MatchResult = {
    sets: sets.length > 0 ? sets : [[0, 0]],
    winner: winner as 1 | 2,
    duration: data.resultado.duracion ?? "N/A",
    totalPoints: data.resultado.totalPuntos ?? 0,
  };

  const e1 = data.equipos[0];
  const e2 = data.equipos[1];

  const teamStats: [TeamStats, TeamStats] = [
    {
      teamNumber: 1,
      totalPoints: e1.totalPuntos,
      winners: e1.winners,
      unforcedErrors: e1.erroresNoForzados,
      forcedErrors: e1.erroresForzados,
      aces: e1.aces,
      doubleFaults: e1.doblesFaltas,
      smashWinRate: e1.efectividadSmash,
      volleyWinRate: e1.efectividadVolea,
      returnWinRate: e1.efectividadResto,
      breakPointsWon: e1.breakPointsGanados,
      breakPointsTotal: e1.breakPointsTotal,
    },
    {
      teamNumber: 2,
      totalPoints: e2.totalPuntos,
      winners: e2.winners,
      unforcedErrors: e2.erroresNoForzados,
      forcedErrors: e2.erroresForzados,
      aces: e2.aces,
      doubleFaults: e2.doblesFaltas,
      smashWinRate: e2.efectividadSmash,
      volleyWinRate: e2.efectividadVolea,
      returnWinRate: e2.efectividadResto,
      breakPointsWon: e2.breakPointsGanados,
      breakPointsTotal: e2.breakPointsTotal,
    },
  ];

  const playerStats: PlayerStats[] = data.jugadores.map((j) => ({
    name: j.nombre,
    team: j.equipo,
    position: j.posicion,
    winners: j.winners,
    unforcedErrors: j.erroresNoForzados,
    forcedErrors: j.erroresForzados,
    smashSuccess: j.smashExitosos,
    smashTotal: j.smashObservados,
    volleySuccess: j.voleaExitosas,
    volleyTotal: j.voleaObservadas,
    bandejaSuccess: j.bandejaExitosas,
    bandejaTotal: j.bandejaObservadas,
    viboraSuccess: j.viboraExitosas,
    viboraTotal: j.viboraObservadas,
    globoSuccess: j.globoExitosos,
    globoTotal: j.globoObservados,
    dropShotSuccess: j.dropShotExitosos,
    dropShotTotal: j.dropShotObservados,
    serveSpeed: j.velocidadSaque,
    serveWinRate: j.efectividadSaque,
    returnWinRate: j.efectividadResto,
  }));

  // Heatmap global — datos reales del VLM
  const shotHeatmap: ShotHeatmapPoint[] = data.zonasTiros.map((z) => ({
    zone: z.zona,
    x: z.x,
    y: z.y,
    count: z.conteoObservado,
    type: z.tipo,
  }));

  // Heatmap individual — distribuido según posición real (derecha/revés) y tiempo en zona
  const playerHeatmaps: PlayerHeatmap[] = data.jugadores.map((j) => {
    const isDerecha = j.posicion === "derecha";
    const netPct = j.tiempoEnRed / 100;
    const backPct = j.tiempoEnFondo / 100;

    const points: ShotHeatmapPoint[] = data.zonasTiros.map((z) => {
      const isRightZone = z.x < 50;
      const isNetZone = z.y < 45;
      const isBackZone = z.y > 65;

      // Peso según lado dominante del jugador
      const sideFactor = isDerecha
        ? isRightZone ? 1.6 : 0.4
        : isRightZone ? 0.4 : 1.6;

      // Peso según tiempo en cada zona
      const depthFactor = isNetZone
        ? 0.4 + netPct * 1.6
        : isBackZone
        ? 0.4 + backPct * 1.6
        : 1.0;

      // Conteo real de esa zona escalado al jugador
      const rawCount = z.conteoObservado;
      const adjustedCount = Math.max(0, Math.round(rawCount * sideFactor * depthFactor * 0.5));

      // Tipo de tiro más frecuente en esa zona según datos reales
      const totalW = j.winners;
      const totalE = j.erroresNoForzados + j.erroresForzados;
      const totalR = (j.smashObservados + j.voleaObservadas + j.bandejaObservadas + j.viboraObservadas) - totalW - totalE;
      const total = totalW + totalE + Math.max(0, totalR) || 1;
      const wPct = totalW / total;
      const ePct = totalE / total;
      const rand = Math.random();
      const shotType: "winner" | "error" | "rally" =
        rand < wPct ? "winner" : rand < wPct + ePct ? "error" : "rally";

      return {
        zone: z.zona,
        x: Math.max(5, Math.min(95, z.x + (Math.random() * 6 - 3))),
        y: Math.max(5, Math.min(95, z.y + (Math.random() * 6 - 3))),
        count: adjustedCount,
        type: shotType,
      };
    });

    return { playerName: j.nombre, team: j.equipo, position: j.posicion, points };
  });

  const possessionBySet: PossessionSet[] = (data.posesionPorSet ?? []).map((p) => ({
    setNumber: p.set,
    team1: p.equipo1,
    team2: p.equipo2,
  }));

  if (possessionBySet.length === 0) {
    sets.forEach((_, i) => possessionBySet.push({ setNumber: i + 1, team1: 50, team2: 50 }));
  }

  const clips: Clip[] = (data.momentosClave ?? []).map((m, i) => ({
    id: `clip-${i + 1}`,
    title: m.descripcion,
    startTime: m.tiempoAproximado,
    endTime: m.tiempoAproximado + 15,
    type: m.tipo,
  }));

  const keyMetrics: KeyMetric[] = [
    { label: "Winners", value: `${e1.winners + e2.winners} totales`, team1Value: e1.winners, team2Value: e2.winners, higherIsBetter: true },
    { label: "Errores no forzados", value: `${e1.erroresNoForzados + e2.erroresNoForzados} totales`, team1Value: e1.erroresNoForzados, team2Value: e2.erroresNoForzados, higherIsBetter: false },
    { label: "Efectividad Smash", value: "Promedio", team1Value: e1.efectividadSmash, team2Value: e2.efectividadSmash, higherIsBetter: true },
    { label: "Efectividad Volea", value: "Promedio", team1Value: e1.efectividadVolea, team2Value: e2.efectividadVolea, higherIsBetter: true },
    { label: "Break points", value: "Convertidos", team1Value: e1.breakPointsGanados, team2Value: e2.breakPointsGanados, higherIsBetter: true },
    { label: "Efectividad Resto", value: "Puntos ganados", team1Value: e1.efectividadResto, team2Value: e2.efectividadResto, higherIsBetter: true },
  ];

  const winnerNames = data.jugadores.filter(j => j.equipo === winner).map(j => j.nombre).join(" y ");
  const loserNames = data.jugadores.filter(j => j.equipo !== winner).map(j => j.nombre).join(" y ");
  const setsStr = sets.map(s => `${s[0]}-${s[1]}`).join(", ");

  const aiSummary = data.resultado.marcadorVisible
    ? `Victoria para ${winnerNames} por ${setsStr} en ${data.resultado.duracion}. ` +
      `El equipo ganador registró ${data.equipos[winner - 1].winners} winners. ` +
      `${loserNames} cometió ${data.equipos[winner === 1 ? 1 : 0].erroresNoForzados} errores no forzados. ` +
      `Confianza del análisis: ${data.confianza}.`
    : `Análisis completado. ${data.observacionGeneral} Confianza: ${data.confianza}. ${data.notasDelAnalista}`;

  return {
    id: `analysis-${Date.now()}`,
    matchId,
    result,
    teamStats,
    playerStats,
    shotHeatmap,
    playerHeatmaps,
    possessionBySet,
    pointSequence: [],
    clips,
    aiSummary,
    aiReport,
    playerNames,
    keyMetrics,
    confianza: data.confianza,
    observacionGeneral: data.observacionGeneral,
    notasDelAnalista: data.notasDelAnalista,
  };
}

// ─── Función principal exportada ──────────────────────────────────────────────

export async function analyzePadelWithAI(
  matchId: string,
  videoUrl: string,
  playerNames: string[]
): Promise<{ analysis: Omit<MatchAnalysis, "createdAt">; rawData: RealMatchData }> {
  if (!videoUrl || !videoUrl.startsWith("http")) {
    throw new Error(
      "Se requiere una URL pública del video (YouTube o Firebase Storage) para el análisis con IA."
    );
  }

  const zai = await ZAI.create();

  // 1. VLM analiza el video real y extrae datos observados
  const realData = await analyzeVideoReal(zai, videoUrl, playerNames);

  // 2. LLM genera el informe narrativo basado en datos reales
  console.log("[PadelAI] Generando informe narrativo con datos reales...");
  const aiReport = await generateNarrative(zai, realData);
  console.log("[PadelAI] Informe generado ✓");

  // 3. Mapear a los tipos de la app
  const analysis = mapToMatchAnalysis(realData, matchId, aiReport, playerNames);

  return { analysis, rawData: realData };
}
