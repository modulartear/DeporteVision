import { Timestamp } from "firebase/firestore";

// ─── Usuario ───────────────────────────────────────────────────────────
export interface User {
  uid: string;
  name: string;
  email: string;
  plan: "free" | "pro" | "premium";
  createdAt: Timestamp;
}

// ─── Partido ───────────────────────────────────────────────────────────
export type MatchStatus = "uploaded" | "processing" | "analyzed" | "error";

export interface Match {
  id: string;
  userId: string;
  title: string;
  sport: "padel";
  videoUrl: string;
  status: MatchStatus;
  createdAt: Timestamp;
  playerNames?: string[];
  analysis?: MatchAnalysis;
}

// ─── Análisis de Partido de Pádel ──────────────────────────────────────

/** Resumen general del partido */
export interface MatchAnalysis {
  id: string;
  matchId: string;
  createdAt: Timestamp;

  // Resultado
  result: MatchResult;

  // Estadísticas por equipo
  teamStats: [TeamStats, TeamStats];

  // Estadísticas por jugador (4 jugadores)
  playerStats: PlayerStats[];

  // Distribución de tiros por zona de la cancha (global)
  shotHeatmap: ShotHeatmapPoint[];

  // Heatmap individual por jugador (4 jugadores)
  playerHeatmaps: PlayerHeatmap[];

  // Posesión por set
  possessionBySet: PossessionSet[];

  // Secuencia de puntos (para timeline)
  pointSequence: PointEvent[];

  // Clips generados automáticamente
  clips: Clip[];

  // Resumen narrativo corto generado por IA
  aiSummary: string;

  // Informe completo WPT-level generado por IA (Markdown)
  aiReport?: string;

  // Nombres de jugadores ingresados por el usuario
  playerNames?: string[];

  // Métricas clave
  keyMetrics: KeyMetric[];
}

export interface MatchResult {
  sets: [number, number][];
  winner: 1 | 2;
  duration: string; // ej: "1h 23min"
  totalPoints: number;
}

export interface TeamStats {
  teamNumber: 1 | 2;
  totalPoints: number;
  winners: number;
  unforcedErrors: number;
  forcedErrors: number;
  aces: number;
  doubleFaults: number;
  smashWinRate: number; // porcentaje 0-100
  volleyWinRate: number;
  returnWinRate: number;
  breakPointsWon: number;
  breakPointsTotal: number;
}

export interface PlayerStats {
  name: string;
  team: 1 | 2;
  position: "derecha" | "revés";
  winners: number;
  unforcedErrors: number;
  forcedErrors: number;
  smashSuccess: number;
  smashTotal: number;
  volleySuccess: number;
  volleyTotal: number;
  bandejaSuccess: number;
  bandejaTotal: number;
  viboraSuccess: number;
  viboraTotal: number;
  globoSuccess: number;
  globoTotal: number;
  dropShotSuccess: number;
  dropShotTotal: number;
  serveSpeed: number; // km/h promedio
  serveWinRate: number; // porcentaje
  returnWinRate: number;
}

export interface ShotHeatmapPoint {
  zone: string; // ej: "fondo_derecha", "red_centro", etc.
  x: number; // 0-100 posición relativa en cancha
  y: number; // 0-100
  count: number;
  type: "winner" | "error" | "rally";
}

/** Heatmap individual de un jugador */
export interface PlayerHeatmap {
  playerName: string;
  team: 1 | 2;
  position: "derecha" | "revés";
  points: ShotHeatmapPoint[];
}

export interface PossessionSet {
  setNumber: number;
  team1: number; // porcentaje 0-100
  team2: number;
}

export interface PointEvent {
  pointIndex: number;
  set: number;
  game: number;
  point: string; // "15-0", "30-15", etc.
  winner: 1 | 2;
  type: "ace" | "winner" | "unforced_error" | "forced_error" | "double_fault";
  shotType: string; // "smash", "volea", "bandeja", "vibora", "globo", "drop", "drive", "revés"
  player: string;
  duration: number; // segundos del punto
}

export interface Clip {
  id: string;
  title: string;
  startTime: number; // segundos
  endTime: number;
  type: "winner" | "error" | "key_point" | "amazing_point";
  thumbnailUrl?: string;
}

export interface KeyMetric {
  label: string;
  value: string;
  team1Value: number;
  team2Value: number;
  higherIsBetter: boolean;
}

// ─── Estadísticas del Dashboard ──────────────────────────────────────
export interface DashboardStats {
  totalMatches: number;
  analyzedMatches: number;
  processingMatches: number;
  winRate: number;
}

// ─── Formularios de Auth ───────────────────────────────────────────────
export interface LoginFormValues {
  email: string;
  password: string;
}

export interface RegisterFormValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}
