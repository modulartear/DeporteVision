"use client";

import { useState, useRef, useEffect } from "react";
import { Play, Square, Upload, Loader2, Radio, Download, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function LiveAnalysisPage() {
  const [videoSource, setVideoSource] = useState<"youtube" | "webcam" | "upload" | "">("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [liveData, setLiveData] = useState<any>(null);
  const [frameCount, setFrameCount] = useState(0);
  const [capturedFrames, setCapturedFrames] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<any>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startWebcamAnalysis = async () => {
    setIsAnalyzing(true);
    setCapturedFrames([]);
    setFrameCount(0);
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      let frame = 0;
      intervalRef.current = setInterval(async () => {
        if (!canvasRef.current || !videoRef.current) return;

        const ctx = canvasRef.current.getContext("2d");
        if (ctx && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
          canvasRef.current.width = videoRef.current.videoWidth;
          canvasRef.current.height = videoRef.current.videoHeight;
          ctx.drawImage(videoRef.current, 0, 0);

          const frameData = canvasRef.current.toDataURL("image/jpeg").split(",")[1];
          setCapturedFrames((prev) => [...prev, frameData]);

          try {
            const response = await fetch("/api/analyze-frame", {
              method: "POST",
              body: JSON.stringify({
                frameBase64: frameData,
                frameNumber: frame,
                timestamp: Date.now(),
              }),
              headers: { "Content-Type": "application/json" },
            });

            const analysis = await response.json();
            setLiveData(analysis);
            setFrameCount(frame);
          } catch (error) {
            console.error("Error analyzing frame:", error);
          }
        }

        frame++;
      }, 500);
    } catch (error) {
      console.error("Error:", error);
      setIsAnalyzing(false);
    }
  };

  const stopAnalysis = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
    }
    setIsAnalyzing(false);
  };

  const processMatch = async () => {
    if (capturedFrames.length === 0) {
      alert("Captura algunos frames primero");
      return;
    }

    setIsProcessing(true);
    try {
      const response = await fetch("/api/process-match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          frames: capturedFrames.slice(0, 10), // Primeros 10 frames
          matchId: `match_${Date.now()}`,
          playerNames: ["Jugador 1", "Jugador 2"],
        }),
      });

      const data = await response.json();
      setResults(data);
      console.log("✅ Resultados:", data);
    } catch (error) {
      console.error("Error:", error);
      alert("Error procesando match");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">🔴 Análisis en VIVO</h1>

        {!videoSource && (
          <div className="grid grid-cols-3 gap-4 mb-8">
            <Button onClick={() => setVideoSource("youtube")} className="h-32 text-lg">
              📹 YouTube
            </Button>
            <Button
              onClick={() => setVideoSource("webcam")}
              className="h-32 text-lg bg-red-600"
            >
              <Radio className="w-6 h-6 mr-2 animate-pulse" />
              Webcam EN VIVO
            </Button>
            <Button onClick={() => setVideoSource("upload")} className="h-32 text-lg">
              📁 Subir Video
            </Button>
          </div>
        )}

        {videoSource === "webcam" && (
          <div className="space-y-6">
            <Card className="bg-slate-900 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Radio className="w-5 h-5 text-red-600 animate-pulse" />
                  Análisis EN VIVO
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <video ref={videoRef} className="w-full rounded-lg mb-4" autoPlay playsInline />
                <canvas ref={canvasRef} style={{ display: "none" }} />

                {!isAnalyzing ? (
                  <Button
                    onClick={startWebcamAnalysis}
                    className="w-full bg-red-600 text-lg h-12"
                  >
                    <Play className="w-5 h-5 mr-2" />
                    Iniciar Análisis EN VIVO
                  </Button>
                ) : (
                  <div className="space-y-4">
                    <Button
                      onClick={stopAnalysis}
                      className="w-full bg-yellow-600 text-lg h-12"
                    >
                      <Square className="w-5 h-5 mr-2" />
                      Detener ({frameCount} frames capturados)
                    </Button>

                    {liveData && (
                      <div className="grid grid-cols-2 gap-4">
                        <Card className="bg-slate-800">
                          <CardContent className="pt-6">
                            <p className="text-gray-400 text-sm">Frames Capturados</p>
                            <p className="text-2xl font-bold text-primary">{frameCount}</p>
                          </CardContent>
                        </Card>
                        <Card className="bg-slate-800">
                          <CardContent className="pt-6">
                            <p className="text-gray-400 text-sm">Jugadores</p>
                            <p className="text-2xl font-bold text-green-400">
                              {liveData.playerPositions?.length || 2}
                            </p>
                          </CardContent>
                        </Card>
                      </div>
                    )}
                  </div>
                )}

                {capturedFrames.length > 0 && !isAnalyzing && (
                  <Button
                    onClick={processMatch}
                    disabled={isProcessing}
                    className="w-full bg-blue-600 text-lg h-12"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Procesando {capturedFrames.length} frames...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5 mr-2" />
                        Procesar Match ({capturedFrames.length} frames)
                      </>
                    )}
                  </Button>
                )}

                {results && (
                  <Card className="bg-green-900/20 border-green-700">
                    <CardHeader>
                      <CardTitle className="text-green-400">✅ ANÁLISIS COMPLETADO</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm">
                        {results.message}
                      </p>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <p className="text-gray-400">Frames analizados</p>
                          <p className="font-bold">{results.framesAnalyzed}/{results.framesTotal}</p>
                        </div>
                        <div>
                          <p className="text-gray-400">Calidad</p>
                          <p className="font-bold">{results.stats?.analysisMetrics?.analysisQuality}</p>
                        </div>
                      </div>
                      <Button
                        onClick={() => {
                          window.location.href = "/dashboard/analysis-advanced";
                        }}
                        className="w-full mt-4 bg-green-600"
                      >
                        <Download className="w-5 h-5 mr-2" />
                        Ver Análisis Detallado
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
