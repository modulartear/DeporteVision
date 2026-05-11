"use client";

import { useState, useRef, useEffect } from "react";
import { Play, Square, Upload, Loader2, Radio } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function LiveAnalysisPage() {
  const [videoSource, setVideoSource] = useState<"youtube" | "webcam" | "upload" | "">("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [liveData, setLiveData] = useState<any>(null);
  const [frameCount, setFrameCount] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const startWebcamAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      let frame = 0;
      const interval = setInterval(async () => {
        if (!canvasRef.current || !videoRef.current) return;

        const ctx = canvasRef.current.getContext("2d");
        if (ctx && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
          canvasRef.current.width = videoRef.current.videoWidth;
          canvasRef.current.height = videoRef.current.videoHeight;
          ctx.drawImage(videoRef.current, 0, 0);

          const frameData = canvasRef.current.toDataURL("image/jpeg").split(",")[1];

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
        }

        frame++;
      }, 500);

      return () => {
        clearInterval(interval);
        stream.getTracks().forEach((t) => t.stop());
      };
    } catch (error) {
      console.error("Error:", error);
      setIsAnalyzing(false);
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
                    <Button disabled className="w-full bg-red-600 text-lg h-12">
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Analizando EN VIVO...
                    </Button>

                    {liveData && (
                      <div className="grid grid-cols-2 gap-4">
                        <Card className="bg-slate-800">
                          <CardContent className="pt-6">
                            <p className="text-gray-400 text-sm">Frames</p>
                            <p className="text-2xl font-bold text-primary">{frameCount}</p>
                          </CardContent>
                        </Card>
                        <Card className="bg-slate-800">
                          <CardContent className="pt-6">
                            <p className="text-gray-400 text-sm">Jugadores</p>
                            <p className="text-2xl font-bold text-green-400">
                              {liveData.playerPositions?.length || 0}
                            </p>
                          </CardContent>
                        </Card>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
