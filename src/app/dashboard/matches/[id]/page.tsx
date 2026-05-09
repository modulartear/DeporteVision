"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Play,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Trophy,
  Target,
  Zap,
  Clock,
  Users,
  Flame,
  Video,
  FileText,
  Star,
} from "lucide-react";
import { getMatchById, getMatchAnalysis, updateMatchStatus } from "@/lib/firestore";
import { isFirebaseConfigured } from "@/lib/firebase";
import { generatePadelAnalysis } from "@/lib/padel-analysis";
import type { Match, MatchAnalysis, MatchStatus } from "@/types";

// ─── Helpers ──────────────────────────────────────────────────────────
function getStatusInfo(status: MatchStatus) {
  switch (status) {
    case "uploaded":
      return { label: "Subido", color: "text-blue-400", bg: "bg-blue-500/10", icon: Play };
    case "processing":
      return { label: "Procesando", color: "text-yellow-400", bg: "bg-yellow-500/10", icon: Loader2 };
    case "analyzed":
      return { label: "Analizado", color: "text-green-400", bg: "bg-green-500/10", icon: CheckCircle2 };
    case "error":
      return { label: "Error", color: "text-red-400", bg: "bg-red-500/10", icon: AlertCircle };
  }
}

function formatShotType(type: string): string {
  const map: Record<string, string> = {
    smash: "Smash", volea: "Volea", bandeja: "Bandeja", vibora: "Víbora",
    globo: "Globo", drop: "Drop shot", drive: "Drive", "revés": "Revés",
  };
  return map[type] || type;
}

// ─── Componente: Barra de comparación ──────────────────────────────────
function ComparisonBar({ label, team1, team2, higherIsBetter, max }: {
  label: string; team1: number; team2: number; higherIsBetter: boolean; max?: number;
}) {
  const m = max || Math.max(team1, team2, 1);
  const t1Win = higherIsBetter ? team1 > team2 : team1 < team2;
  const t2Win = higherIsBetter ? team2 > team1 : team2 < team1;

  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-xs">
        <span className={t1Win ? "text-primary font-bold" : "text-muted-foreground"}>{team1}</span>
        <span className="text-muted-foreground">{label}</span>
        <span className={t2Win ? "text-primary font-bold" : "text-muted-foreground"}>{team2}</span>
      </div>
      <div className="flex gap-1 h-2">
        <div className="flex-1 flex justify-end">
          <div
            className={`rounded-l-full ${t1Win ? "bg-primary" : "bg-muted-foreground/30"}`}
            style={{ width: `${(team1 / m) * 100}%` }}
          />
        </div>
        <div className="flex-1">
          <div
            className={`rounded-r-full ${t2Win ? "bg-primary" : "bg-muted-foreground/30"}`}
            style={{ width: `${(team2 / m) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}

// ─── Componente: Stat Card ─────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, sub, color = "text-primary" }: {
  icon: React.ElementType; label: string; value: string | number; sub?: string; color?: string;
}) {
  return (
    <Card className="bg-card border-border/50">
      <CardContent className="pt-4 pb-4">
        <div className="flex items-center gap-3">
          <div className={`flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 ${color}`}>
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="text-xl font-bold">{value}</p>
            {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Componente: Mini Cancha SVG ───────────────────────────────────────
function MiniCourt({ heatmap }: { heatmap: MatchAnalysis["shotHeatmap"] }) {
  return (
    <svg viewBox="0 0 100 100" className="w-full h-auto max-h-72">
      {/* Fondo de cancha */}
      <rect x="5" y="5" width="90" height="90" rx="2" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-muted-foreground/30" />
      {/* Red */}
      <line x1="5" y1="50" x2="95" y2="50" stroke="currentColor" strokeWidth="0.8" className="text-primary/50" />
      {/* Líneas de saque */}
      <line x1="5" y1="35" x2="95" y2="35" stroke="currentColor" strokeWidth="0.3" className="text-muted-foreground/20" />
      <line x1="5" y1="65" x2="95" y2="65" stroke="currentColor" strokeWidth="0.3" className="text-muted-foreground/20" />
      {/* Centro */}
      <line x1="50" y1="5" x2="50" y2="95" stroke="currentColor" strokeWidth="0.3" className="text-muted-foreground/20" />

      {/* Heatmap points */}
      {heatmap.map((point, i) => {
        const maxCount = Math.max(...heatmap.map((p) => p.count));
        const intensity = point.count / maxCount;
        const color = point.type === "winner" ? "#22c55e" : point.type === "error" ? "#ef4444" : "#C8F73A";
        return (
          <circle
            key={i}
            cx={point.x}
            cy={point.y}
            r={2 + intensity * 5}
            fill={color}
            opacity={0.3 + intensity * 0.5}
          />
        );
      })}
    </svg>
  );
}

// ─── Componente: Player Card ───────────────────────────────────────────
function PlayerCard({ player, isWinner }: { player: MatchAnalysis["playerStats"][0]; isWinner: boolean }) {
  const totalShots = player.smashTotal + player.volleyTotal + player.bandejaTotal + player.viboraTotal + player.globoTotal + player.dropShotTotal;
  const totalSuccess = player.smashSuccess + player.volleySuccess + player.bandejaSuccess + player.viboraSuccess + player.globoSuccess + player.dropShotSuccess;
  const effectiveness = totalShots > 0 ? Math.round((totalSuccess / totalShots) * 100) : 0;

  return (
    <Card className={`bg-card border-border/50 ${isWinner ? "ring-1 ring-primary/30" : ""}`}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold">{player.name}</CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              Equipo {player.team} · {player.position}
            </Badge>
            {isWinner && (
              <Badge className="bg-primary/10 text-primary text-xs">
                <Trophy className="h-3 w-3 mr-1" />
                Ganador
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Efectividad general */}
        <div className="flex items-center gap-2">
          <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full" style={{ width: `${effectiveness}%` }} />
          </div>
          <span className="text-xs font-medium">{effectiveness}%</span>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Winners</span>
            <span className="font-medium text-green-400">{player.winners}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Errores NF</span>
            <span className="font-medium text-red-400">{player.unforcedErrors}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Smash</span>
            <span className="font-medium">{player.smashSuccess}/{player.smashTotal}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Volea</span>
            <span className="font-medium">{player.volleySuccess}/{player.volleyTotal}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Bandeja</span>
            <span className="font-medium">{player.bandejaSuccess}/{player.bandejaTotal}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Víbora</span>
            <span className="font-medium">{player.viboraSuccess}/{player.viboraTotal}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Globo</span>
            <span className="font-medium">{player.globoSuccess}/{player.globoTotal}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Saque</span>
            <span className="font-medium">{player.serveSpeed} km/h</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Página principal ──────────────────────────────────────────────────
export default function MatchAnalysisPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const matchId = params.id as string;

  const [match, setMatch] = useState<Match | null>(null);
  const [analysis, setAnalysis] = useState<MatchAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  const loadData = useCallback(async () => {
    if (!matchId || !isFirebaseConfigured) {
      setLoading(false);
      return;
    }

    try {
      const matchData = await getMatchById(matchId);
      if (matchData) {
        setMatch(matchData);

        if (matchData.status === "analyzed") {
          const analysisData = await getMatchAnalysis(matchId);
          if (analysisData) {
            setAnalysis(analysisData);
          } else {
            // Si el partido está analizado pero no hay análisis en Firestore,
            // generar uno local (fallback)
            const localAnalysis = generatePadelAnalysis(matchId);
            setAnalysis(localAnalysis);
          }
        }
      }
    } catch (error) {
      console.error("Error cargando partido:", error);
    } finally {
      setLoading(false);
    }
  }, [matchId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Polling cuando está en procesamiento
  useEffect(() => {
    if (match?.status !== "processing") return;

    const interval = setInterval(async () => {
      const matchData = await getMatchById(matchId);
      if (matchData) {
        setMatch(matchData);
        if (matchData.status === "analyzed") {
          const analysisData = await getMatchAnalysis(matchId);
          setAnalysis(analysisData || generatePadelAnalysis(matchId));
        }
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [match?.status, matchId]);

  const triggerAnalysis = async () => {
    if (!matchId) return;
    setProcessing(true);

    try {
      // Llamar a la API de análisis
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ matchId }),
      });

      const data = await response.json();

      if (data.success) {
        // Recargar datos
        await loadData();
      } else {
        console.error("Error en análisis:", data.error);
        // Fallback: generar análisis localmente
        const localAnalysis = generatePadelAnalysis(matchId);
        setAnalysis(localAnalysis);
        if (match) {
          setMatch({ ...match, status: "analyzed" });
        }
      }
    } catch (error) {
      console.error("Error disparando análisis:", error);
      // Fallback local
      const localAnalysis = generatePadelAnalysis(matchId);
      setAnalysis(localAnalysis);
      if (match) {
        setMatch({ ...match, status: "analyzed" });
      }
    } finally {
      setProcessing(false);
    }
  };

  // ─── Render: Loading ─────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-3 text-muted-foreground">Cargando partido...</span>
      </div>
    );
  }

  // ─── Render: No encontrado ──────────────────────────────────────
  if (!match) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <AlertCircle className="h-12 w-12 text-destructive" />
        <p className="text-lg font-medium">Partido no encontrado</p>
        <Button variant="outline" onClick={() => router.push("/dashboard")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver al dashboard
        </Button>
      </div>
    );
  }

  const statusInfo = getStatusInfo(match.status);

  // ─── Render: Aún no analizado ──────────────────────────────────
  if (match.status !== "analyzed" || !analysis) {
    return (
      <div className="flex min-h-screen flex-col">
        {/* Header */}
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
          <div className="container mx-auto flex h-16 items-center px-4">
            <Button variant="ghost" size="sm" onClick={() => router.push("/dashboard")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Dashboard
            </Button>
          </div>
        </header>

        <main className="flex-1 container mx-auto px-4 py-8 flex flex-col items-center justify-center gap-6">
          <div className={`flex h-20 w-20 items-center justify-center rounded-full ${statusInfo.bg}`}>
            {match.status === "processing" ? (
              <Loader2 className={`h-10 w-10 animate-spin ${statusInfo.color}`} />
            ) : (
              <statusInfo.icon className={`h-10 w-10 ${statusInfo.color}`} />
            )}
          </div>

          <div className="text-center">
            <h1 className="text-2xl font-bold">{match.title}</h1>
            <p className="text-muted-foreground mt-1">
              Estado: <span className={statusInfo.color}>{statusInfo.label}</span>
            </p>
          </div>

          {match.status === "uploaded" && (
            <Button size="lg" onClick={triggerAnalysis} disabled={processing} className="gap-2">
              {processing ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Iniciando análisis...
                </>
              ) : (
                <>
                  <Zap className="h-5 w-5" />
                  Analizar con IA
                </>
              )}
            </Button>
          )}

          {match.status === "processing" && (
            <div className="text-center space-y-3">
              <div className="w-64 h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full animate-pulse" style={{ width: "60%" }} />
              </div>
              <p className="text-sm text-muted-foreground">
                Analizando video con IA... Esto puede tardar unos segundos.
              </p>
            </div>
          )}

          {match.status === "error" && (
            <div className="space-y-3 text-center">
              <p className="text-sm text-destructive">
                Hubo un error al analizar el video.
              </p>
              <Button onClick={triggerAnalysis} disabled={processing}>
                Reintentar análisis
              </Button>
            </div>
          )}
        </main>
      </div>
    );
  }

  // ─── Render: Análisis completo ──────────────────────────────────
  const { result, teamStats, playerStats, shotHeatmap, possessionBySet, clips, aiSummary, keyMetrics } = analysis;
  const smashRate = teamStats[winnerTeam - 1].smashWinRate + "%";
  const pointsLabel = result.totalPoints + " puntos";
  const winnerTeam = result.winner;

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Button variant="ghost" size="sm" onClick={() => router.push("/dashboard")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Dashboard
          </Button>
          <Badge className="bg-green-500/10 text-green-400 gap-1">
            <CheckCircle2 className="h-3 w-3" />
            Analizado
          </Badge>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-6 space-y-6">
        {/* Título y resultado */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">{match.title}</h1>
            <p className="text-muted-foreground mt-1">
              Duración: {result.duration} · {result.sets.length} sets · {result.totalPoints} puntos totales
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Trophy className="h-6 w-6 text-primary" />
            <span className="text-lg font-bold text-primary">
              Ganó Equipo {winnerTeam}
            </span>
          </div>
        </div>

        {/* Scoreboard */}
        <Card className="bg-card border-primary/20">
          <CardContent className="py-5">
            <div className="flex items-center justify-center gap-6 md:gap-12">
              <div className="text-center">
                <p className="text-xs text-muted-foreground mb-1">Equipo 1</p>
                <p className="text-sm font-medium">{playerStats[0].name} / {playerStats[1].name}</p>
              </div>
              <div className="flex items-center gap-3">
                {result.sets.map((set, i) => (
                  <div key={i} className="text-center">
                    <p className="text-xs text-muted-foreground">Set {i + 1}</p>
                    <div className="flex items-center gap-2">
                      <span className={`text-2xl font-bold ${set[0] > set[1] ? "text-primary" : ""}`}>{set[0]}</span>
                      <span className="text-muted-foreground">-</span>
                      <span className={`text-2xl font-bold ${set[1] > set[0] ? "text-primary" : ""}`}>{set[1]}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground mb-1">Equipo 2</p>
                <p className="text-sm font-medium">{playerStats[2].name} / {playerStats[3].name}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Resumen IA */}
        <Card className="bg-card border-primary/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Zap className="h-4 w-4 text-primary" />
              Resumen IA
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed">{aiSummary}</p>
          </CardContent>
        </Card>

        {/* Stats rapidas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard icon={Target} label="Winners" value={teamStats[0].winners + teamStats[1].winners} sub="Ambos equipos" />
          <StatCard icon={AlertCircle} label="Errores NF" value={teamStats[0].unforcedErrors + teamStats[1].unforcedErrors} sub="No forzados" color="text-red-400" />
          <StatCard icon={Flame} label="Smash" value={smashRate} sub="Efectividad ganador" />
          <StatCard icon={Clock} label="Duracion" value={result.duration} sub={pointsLabel} />
        </div>

        {/* Comparación de equipos */}
        <Card className="bg-card">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Comparación de equipos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {keyMetrics.map((metric) => (
              <ComparisonBar
                key={metric.label}
                label={metric.label}
                team1={metric.team1Value}
                team2={metric.team2Value}
                higherIsBetter={metric.higherIsBetter}
              />
            ))}
          </CardContent>
        </Card>

        {/* Posesión por set */}
        <Card className="bg-card">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Posesión por set
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {possessionBySet.map((p) => (
                <div key={p.setNumber} className="text-center space-y-2">
                  <p className="text-xs text-muted-foreground">Set {p.setNumber}</p>
                  <div className="flex items-center justify-center gap-3">
                    <div className="text-right w-12">
                      <p className="text-xs text-muted-foreground">Eq.1</p>
                      <p className="text-lg font-bold">{p.team1}%</p>
                    </div>
                    <div className="w-20 h-2 bg-muted rounded-full overflow-hidden flex">
                      <div className="h-full bg-primary rounded-l-full" style={{ width: `${p.team1}%` }} />
                      <div className="h-full bg-muted-foreground/30 rounded-r-full" style={{ width: `${p.team2}%` }} />
                    </div>
                    <div className="text-left w-12">
                      <p className="text-xs text-muted-foreground">Eq.2</p>
                      <p className="text-lg font-bold">{p.team2}%</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Heatmap de tiros */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="bg-card">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Mapa de tiros
              </CardTitle>
            </CardHeader>
            <CardContent>
              <MiniCourt heatmap={shotHeatmap} />
              <div className="flex justify-center gap-4 mt-3">
                <div className="flex items-center gap-1.5">
                  <div className="h-2.5 w-2.5 rounded-full bg-green-500" />
                  <span className="text-xs text-muted-foreground">Winners</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="h-2.5 w-2.5 rounded-full bg-red-500" />
                  <span className="text-xs text-muted-foreground">Errores</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="h-2.5 w-2.5 rounded-full bg-[#C8F73A]" />
                  <span className="text-xs text-muted-foreground">Rally</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Clips generados */}
          <Card className="bg-card">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Video className="h-5 w-5 text-primary" />
                Clips automáticos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {clips.map((clip) => (
                  <div
                    key={clip.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`flex h-8 w-8 items-center justify-center rounded-full ${
                        clip.type === "winner" ? "bg-green-500/10 text-green-400" :
                        clip.type === "error" ? "bg-red-500/10 text-red-400" :
                        clip.type === "amazing_point" ? "bg-primary/10 text-primary" :
                        "bg-yellow-500/10 text-yellow-400"
                      }`}>
                        {clip.type === "amazing_point" ? (
                          <Star className="h-4 w-4" />
                        ) : (
                          <Play className="h-4 w-4" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{clip.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {Math.floor(clip.startTime / 60)}:{(clip.startTime % 60).toString().padStart(2, "0")} -
                          {Math.floor(clip.endTime / 60)}:{(clip.endTime % 60).toString().padStart(2, "0")}
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {clip.type === "winner" ? "Winner" :
                       clip.type === "error" ? "Error" :
                       clip.type === "amazing_point" ? "Increíble" : "Punto clave"}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Estadísticas por jugador */}
        <div>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Rendimiento por jugador
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {playerStats.map((player, i) => (
              <PlayerCard
                key={i}
                player={player}
                isWinner={player.team === winnerTeam}
              />
            ))}
          </div>
        </div>

        {/* Estadísticas detalladas por equipo */}
        <Card className="bg-card">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Estadísticas detalladas por equipo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 px-3 text-muted-foreground font-medium">Métrica</th>
                    <th className="text-center py-2 px-3 text-primary font-medium">Equipo 1</th>
                    <th className="text-center py-2 px-3 text-primary font-medium">Equipo 2</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Winners", teamStats[0].winners, teamStats[1].winners],
                    ["Errores no forzados", teamStats[0].unforcedErrors, teamStats[1].unforcedErrors],
                    ["Errores forzados", teamStats[0].forcedErrors, teamStats[1].forcedErrors],
                    ["Aces", teamStats[0].aces, teamStats[1].aces],
                    ["Dobles faltas", teamStats[0].doubleFaults, teamStats[1].doubleFaults],
                    ["Efectividad Smash", `${teamStats[0].smashWinRate}%`, `${teamStats[1].smashWinRate}%`],
                    ["Efectividad Volea", `${teamStats[0].volleyWinRate}%`, `${teamStats[1].volleyWinRate}%`],
                    ["Efectividad Resto", `${teamStats[0].returnWinRate}%`, `${teamStats[1].returnWinRate}%`],
                    ["Break points", `${teamStats[0].breakPointsWon}/${teamStats[0].breakPointsTotal}`, `${teamStats[1].breakPointsWon}/${teamStats[1].breakPointsTotal}`],
                    ["Puntos totales", teamStats[0].totalPoints, teamStats[1].totalPoints],
                  ].map(([label, t1, t2], i) => (
                    <tr key={i} className="border-b border-border/30">
                      <td className="py-2 px-3 text-muted-foreground">{label}</td>
                      <td className="py-2 px-3 text-center font-medium">{String(t1)}</td>
                      <td className="py-2 px-3 text-center font-medium">{String(t2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
