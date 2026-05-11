"use client";

import { useState } from "react";
import { ArrowLeft, Loader2, Play, BarChart3, Zap, Users, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function MatchPage() {
  const [analysis, setAnalysis] = useState<any>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState("movimiento");

  const handleAnalyze = async () => {
    try {
      setAnalyzing(true);

      const response = await fetch("/api/analyze", {
        method: "POST",
        body: JSON.stringify({
          matchId: "test",
          playerNames: ["Jugador 1", "Jugador 2", "Jugador 3", "Jugador 4"],
        }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();
      setAnalysis(data.analysis);
    } catch (err) {
      console.error(err);
    } finally {
      setAnalyzing(false);
    }
  };

  if (!analysis) {
    return (
      <div className="min-h-screen bg-black text-white p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Button variant="ghost">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Atrás
            </Button>
          </div>

          <div className="bg-slate-900 rounded-lg p-8 text-center">
            <h1 className="text-3xl font-bold mb-4">Análisis de Partido</h1>
            <Button
              onClick={handleAnalyze}
              disabled={analyzing}
              className="bg-green-600 text-lg px-8 py-6"
            >
              {analyzing ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Analizando...
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 mr-2" />
                  Iniciar Análisis Profesional
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Atrás
          </Button>
          <h1 className="text-3xl font-bold mt-4">Análisis Profesional del Partido</h1>
          <p className="text-gray-400 mt-2">
            {new Date(analysis.matchDate).toLocaleDateString()} • {analysis.duration} minutos
          </p>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="grid w-full grid-cols-4 bg-slate-900">
            <TabsTrigger value="movimiento" className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Movimiento
            </TabsTrigger>
            <TabsTrigger value="posicionamiento" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Posicionamiento
            </TabsTrigger>
            <TabsTrigger value="eventos" className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              Eventos
            </TabsTrigger>
            <TabsTrigger value="coach" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Coach IA
            </TabsTrigger>
          </TabsList>

          {/* MOVIMIENTO */}
          <TabsContent value="movimiento" className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              {analysis.players.map((player: any) => (
                <Card key={player.name} className="bg-slate-900 border-slate-700">
                  <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                      <span>{player.name}</span>
                      <span className="text-primary text-2xl">{player.level.toFixed(1)}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="bg-slate-800 p-4 rounded">
                        <p className="text-sm text-gray-400">Distancia</p>
                        <p className="text-2xl font-bold text-primary">
                          {player.movement.totalDistance / 1000} km
                        </p>
                      </div>
                      <div className="bg-slate-800 p-4 rounded">
                        <p className="text-sm text-gray-400">Velocidad Promedio</p>
                        <p className="text-2xl font-bold text-blue-400">
                          {player.movement.averageSpeed.toFixed(1)} km/h
                        </p>
                      </div>
                      <div className="bg-slate-800 p-4 rounded">
                        <p className="text-sm text-gray-400">Velocidad Máxima</p>
                        <p className="text-2xl font-bold text-yellow-400">
                          {player.movement.maxSpeed.toFixed(1)} km/h
                        </p>
                      </div>
                      <div className="bg-slate-800 p-4 rounded">
                        <p className="text-sm text-gray-400">Tiempo Defensa</p>
                        <p className="text-2xl font-bold">
                          {Math.floor(player.movement.defenseTime / 60)}:{String(player.movement.defenseTime % 60).padStart(2, '0')}
                        </p>
                      </div>
                      <div className="bg-slate-800 p-4 rounded">
                        <p className="text-sm text-gray-400">Tiempo Ataque</p>
                        <p className="text-2xl font-bold">
                          {Math.floor(player.movement.attackTime / 60)}:{String(player.movement.attackTime % 60).padStart(2, '0')}
                        </p>
                      </div>
                      <div className="bg-slate-800 p-4 rounded">
                        <p className="text-sm text-gray-400">Movimiento Lateral</p>
                        <p className="text-2xl font-bold text-green-400">
                          {player.positioning.lateralMovement}m
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* POSICIONAMIENTO */}
          <TabsContent value="posicionamiento" className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              {analysis.players.map((player: any) => (
                <Card key={player.name} className="bg-slate-900 border-slate-700">
                  <CardHeader>
                    <CardTitle>{player.name} - Posicionamiento</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-slate-800 p-4 rounded">
                        <p className="text-sm text-gray-400">Zona Red</p>
                        <p className="text-2xl font-bold text-red-400">
                          {player.positioning.netZonePercentage.toFixed(1)}%
                        </p>
                      </div>
                      <div className="bg-slate-800 p-4 rounded">
                        <p className="text-sm text-gray-400">Zona Baseline</p>
                        <p className="text-2xl font-bold text-blue-400">
                          {player.positioning.baselinePercentage.toFixed(1)}%
                        </p>
                      </div>
                    </div>
                    <div className="bg-slate-800 p-4 rounded">
                      <p className="text-sm text-gray-400 mb-2">Heatmap</p>
                      <img src={player.positioning.heatmapUrl} alt="Heatmap" className="w-full rounded" />
                    </div>
                    <div className="text-sm">
                      <p className="text-gray-400 mb-2">Zonas Visitadas:</p>
                      <div className="flex flex-wrap gap-2">
                        {player.positioning.zonesVisited.map((zone: string) => (
                          <span key={zone} className="bg-green-500/20 text-green-400 px-3 py-1 rounded">
                            {zone}
                          </span>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* EVENTOS */}
          <TabsContent value="eventos" className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              {analysis.players.map((player: any) => (
                <Card key={player.name} className="bg-slate-900 border-slate-700">
                  <CardHeader>
                    <CardTitle>{player.name} - Eventos</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-4 gap-3 text-sm">
                      <div className="bg-slate-800 p-3 rounded">
                        <p className="text-gray-400">Winners</p>
                        <p className="text-xl font-bold text-green-400">{player.events.winners}</p>
                      </div>
                      <div className="bg-slate-800 p-3 rounded">
                        <p className="text-gray-400">Errores</p>
                        <p className="text-xl font-bold text-red-400">{player.events.unforcedErrors}</p>
                      </div>
                      <div className="bg-slate-800 p-3 rounded">
                        <p className="text-gray-400">Smashes</p>
                        <p className="text-xl font-bold text-yellow-400">
                          {player.events.smashSuccess}/{player.events.smashes}
                        </p>
                      </div>
                      <div className="bg-slate-800 p-3 rounded">
                        <p className="text-gray-400">Voleas</p>
                        <p className="text-xl font-bold text-blue-400">
                          {player.events.voleaSuccess}/{player.events.voleas}
                        </p>
                      </div>
                      <div className="bg-slate-800 p-3 rounded">
                        <p className="text-gray-400">Globos</p>
                        <p className="text-xl font-bold">{player.events.globoSuccess}/{player.events.globos}</p>
                      </div>
                      <div className="bg-slate-800 p-3 rounded">
                        <p className="text-gray-400">Servicios</p>
                        <p className="text-xl font-bold">
                          {player.events.serveSuccess}/{player.events.serves}
                        </p>
                      </div>
                      <div className="bg-slate-800 p-3 rounded">
                        <p className="text-gray-400">Retornos</p>
                        <p className="text-xl font-bold">
                          {player.events.returnSuccess}/{player.events.returns}
                        </p>
                      </div>
                      <div className="bg-slate-800 p-3 rounded">
                        <p className="text-gray-400">Bandeja</p>
                        <p className="text-xl font-bold">
                          {player.events.bandejaSuccess}/{player.events.bandeja}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* COACH IA */}
          <TabsContent value="coach" className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              {analysis.coachRecommendations.map((coach: any) => (
                <Card key={coach.playerName} className="bg-slate-900 border-slate-700">
                  <CardHeader>
                    <CardTitle>{coach.playerName} - Análisis del Coach IA</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {coach.strengths.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-green-400 mb-2">💪 Fortalezas</h4>
                        <ul className="space-y-1">
                          {coach.strengths.map((s: string, i: number) => (
                            <li key={i} className="text-sm text-gray-300">• {s}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {coach.weaknesses.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-red-400 mb-2">⚠️ Debilidades</h4>
                        <ul className="space-y-1">
                          {coach.weaknesses.map((w: string, i: number) => (
                            <li key={i} className="text-sm text-gray-300">• {w}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {coach.improvementAreas.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-yellow-400 mb-2">📈 Áreas de Mejora</h4>
                        <ul className="space-y-1">
                          {coach.improvementAreas.map((a: string, i: number) => (
                            <li key={i} className="text-sm text-gray-300">• {a}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {coach.trainingFocus.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-blue-400 mb-2">🎯 Enfoque de Entrenamiento</h4>
                        <ul className="space-y-1">
                          {coach.trainingFocus.map((t: string, i: number) => (
                            <li key={i} className="text-sm text-gray-300">• {t}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {coach.tacticalAdvice.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-purple-400 mb-2">♟️ Consejo Táctico</h4>
                        <ul className="space-y-1">
                          {coach.tacticalAdvice.map((t: string, i: number) => (
                            <li key={i} className="text-sm text-gray-300">• {t}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Estadísticas del Partido */}
        <Card className="bg-slate-900 border-slate-700">
          <CardHeader>
            <CardTitle>Estadísticas Generales del Partido</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-slate-800 p-4 rounded">
                <p className="text-sm text-gray-400">Winners Totales</p>
                <p className="text-2xl font-bold text-green-400">{analysis.matchStats.totalWinners}</p>
              </div>
              <div className="bg-slate-800 p-4 rounded">
                <p className="text-sm text-gray-400">Errores Totales</p>
                <p className="text-2xl font-bold text-red-400">{analysis.matchStats.totalErrors}</p>
              </div>
              <div className="bg-slate-800 p-4 rounded">
                <p className="text-sm text-gray-400">Rally Más Largo</p>
                <p className="text-2xl font-bold text-yellow-400">{analysis.matchStats.longestRally}</p>
              </div>
              <div className="bg-slate-800 p-4 rounded">
                <p className="text-sm text-gray-400">Ritmo de Juego</p>
                <p className="text-2xl font-bold text-blue-400">{analysis.matchStats.paceOfPlay}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
