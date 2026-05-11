"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, TrendingUp, Zap, Target } from "lucide-react";
import { HeatmapViewer } from "@/components/analysis/HeatmapViewer";

// Mock data para demostración
const mockAnalysis = {
  playerStats: [
    {
      name: "Juan",
      team: 1,
      position: "derecha",
      winners: 18,
      unforcedErrors: 8,
      smashSuccess: 12,
      volleySuccess: 24,
      bandejaSuccess: 15,
      globoSuccess: 8,
      serveSpeed: 118,
      effectiveness: 78.5,
      playerLevel: 5.2,
      confidence: 0.92,
    },
    {
      name: "María",
      team: 1,
      position: "revés",
      winners: 22,
      unforcedErrors: 6,
      smashSuccess: 15,
      volleySuccess: 28,
      bandejaSuccess: 18,
      globoSuccess: 10,
      serveSpeed: 115,
      effectiveness: 82.3,
      playerLevel: 5.8,
      confidence: 0.95,
    },
  ],
  heatmaps: [
    {
      playerName: "Juan",
      points: [
        { x: 30, y: 25, count: 5, type: "winner" as const },
        { x: 50, y: 40, count: 3, type: "error" as const },
        { x: 70, y: 60, count: 7, type: "rally" as const },
      ],
    },
    {
      playerName: "María",
      points: [
        { x: 40, y: 30, count: 6, type: "winner" as const },
        { x: 60, y: 50, count: 4, type: "error" as const },
        { x: 75, y: 70, count: 8, type: "rally" as const },
      ],
    },
  ],
};

function getPlayerLevel(level: number): { text: string; color: string } {
  if (level < 2) return { text: "🔴 Principiante", color: "bg-red-500/10 text-red-400" };
  if (level < 3) return { text: "🟠 Intermedio", color: "bg-orange-500/10 text-orange-400" };
  if (level < 4) return { text: "🟡 Int. Avanzado", color: "bg-yellow-500/10 text-yellow-400" };
  if (level < 5) return { text: "🟢 Avanzado", color: "bg-green-500/10 text-green-400" };
  if (level < 6) return { text: "💚 Avanzado Élite", color: "bg-emerald-500/10 text-emerald-400" };
  return { text: "👑 Profesional", color: "bg-purple-500/10 text-purple-400" };
}

export default function AdvancedAnalysisPage() {
  const [selectedPlayer, setSelectedPlayer] = useState(0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-black text-white p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold mb-2">📊 Análisis Avanzado</h1>
          <p className="text-gray-400">50+ estadísticas profesionales por jugador</p>
        </div>

        {/* Selector de jugadores */}
        <div className="flex gap-4 flex-wrap">
          {mockAnalysis.playerStats.map((player, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedPlayer(idx)}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                selectedPlayer === idx
                  ? "bg-primary text-white"
                  : "bg-slate-800 text-gray-300 hover:bg-slate-700"
              }`}
            >
              {player.name} (Equipo {player.team})
            </button>
          ))}
        </div>

        {/* Stats del jugador seleccionado */}
        {mockAnalysis.playerStats.map((player, idx) => {
          if (idx !== selectedPlayer) return null;

          const levelInfo = getPlayerLevel(player.playerLevel);

          return (
            <div key={idx} className="space-y-6">
              {/* Resumen rápido */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                      <Trophy className="w-5 h-5 text-yellow-400" />
                      <div>
                        <p className="text-xs text-gray-400">Nivel</p>
                        <p className="text-2xl font-bold">{player.playerLevel}</p>
                      </div>
                    </div>
                    <Badge className={`mt-3 ${levelInfo.color}`}>{levelInfo.text}</Badge>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800/50 border-slate-700">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                      <Zap className="w-5 h-5 text-green-400" />
                      <div>
                        <p className="text-xs text-gray-400">Winners</p>
                        <p className="text-2xl font-bold text-green-400">{player.winners}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800/50 border-slate-700">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                      <TrendingUp className="w-5 h-5 text-blue-400" />
                      <div>
                        <p className="text-xs text-gray-400">Efectividad</p>
                        <p className="text-2xl font-bold text-blue-400">{player.effectiveness}%</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800/50 border-slate-700">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                      <Target className="w-5 h-5 text-purple-400" />
                      <div>
                        <p className="text-xs text-gray-400">Confianza</p>
                        <p className="text-2xl font-bold text-purple-400">{(player.confidence * 100).toFixed(0)}%</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Detalles de golpes */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-lg">Estadísticas de Golpes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-slate-900/50 p-4 rounded">
                      <p className="text-xs text-gray-400 mb-1">Smash</p>
                      <p className="text-xl font-bold">{player.smashSuccess} éxitos</p>
                    </div>
                    <div className="bg-slate-900/50 p-4 rounded">
                      <p className="text-xs text-gray-400 mb-1">Volea</p>
                      <p className="text-xl font-bold">{player.volleySuccess} éxitos</p>
                    </div>
                    <div className="bg-slate-900/50 p-4 rounded">
                      <p className="text-xs text-gray-400 mb-1">Bandeja</p>
                      <p className="text-xl font-bold">{player.bandejaSuccess} éxitos</p>
                    </div>
                    <div className="bg-slate-900/50 p-4 rounded">
                      <p className="text-xs text-gray-400 mb-1">Globo</p>
                      <p className="text-xl font-bold">{player.globoSuccess} éxitos</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Velocidades */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-lg">Velocidades Promedio</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm">Saque</span>
                        <span className="font-bold">{player.serveSpeed} km/h</span>
                      </div>
                      <div className="w-full bg-slate-900 rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full" style={{ width: `${(player.serveSpeed / 160) * 100}%` }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm">Smash</span>
                        <span className="font-bold">{(player.serveSpeed + 30).toFixed(0)} km/h</span>
                      </div>
                      <div className="w-full bg-slate-900 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: `${((player.serveSpeed + 30) / 170) * 100}%` }} />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Heatmap */}
              <div>
                <HeatmapViewer points={mockAnalysis.heatmaps[idx].points} playerName={player.name} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
