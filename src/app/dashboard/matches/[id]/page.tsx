"use client";

import { useState } from "react";
import { ArrowLeft, Loader2, Play } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function MatchPage() {
  const [analysis, setAnalysis] = useState<any>(null);
  const [analyzing, setAnalyzing] = useState(false);

  const handleAnalyze = async () => {
    try {
      setAnalyzing(true);

      const response = await fetch("/api/analyze", {
        method: "POST",
        body: JSON.stringify({
          matchId: "test",
          videoUrl: "https://www.youtube.com/watch?v=test",
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

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Atrás
          </Button>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {/* Video */}
          <div className="bg-slate-900 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Video del Partido</h2>
            <div className="aspect-video bg-slate-800 rounded flex items-center justify-center">
              <span className="text-gray-400">Video</span>
            </div>
          </div>

          {/* Analysis */}
          <div className="bg-slate-900 rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Análisis</h2>
              <Button
                onClick={handleAnalyze}
                disabled={analyzing}
                className="bg-green-600"
              >
                {analyzing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Analizando...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Analizar
                  </>
                )}
              </Button>
            </div>

            {analysis && (
              <div className="space-y-4">
                <div className="bg-green-500/10 p-4 rounded text-green-400">
                  ✅ Análisis completado
                </div>
                <p className="text-gray-300">
                  Jugadores analizados: {analysis?.playersAnalyzed}
                </p>
              </div>
            )}

            {!analysis && !analyzing && (
              <p className="text-gray-400">Haz clic en Analizar para comenzar</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
