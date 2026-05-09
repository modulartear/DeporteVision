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
}

// ─── Estadísticas del Dashboard (placeholder) ──────────────────────────
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
