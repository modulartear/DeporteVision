"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface HeatmapPoint {
  x: number;
  y: number;
  count: number;
  type: "winner" | "error" | "rally";
}

interface HeatmapViewerProps {
  points: HeatmapPoint[];
  playerName: string;
}

export function HeatmapViewer({ points, playerName }: HeatmapViewerProps) {
  if (!points || points.length === 0) {
    return <div className="text-muted-foreground">Sin datos de heatmap</div>;
  }

  const maxCount = Math.max(...points.map((p) => p.count));

  return (
    <Card className="bg-card">
      <CardHeader>
        <CardTitle className="text-sm">{playerName} - Mapa de calor</CardTitle>
      </CardHeader>
      <CardContent>
        <svg viewBox="0 0 100 100" className="w-full h-auto border border-border rounded">
          <rect x="5" y="5" width="90" height="90" fill="none" stroke="currentColor" strokeWidth="0.5" />
          <line x1="5" y1="50" x2="95" y2="50" stroke="currentColor" strokeWidth="0.8" />
          
          {points.map((point, i) => {
            const intensity = point.count / maxCount;
            const color = point.type === "winner" ? "#22c55e" : point.type === "error" ? "#ef4444" : "#C8F73A";
            const radius = 2 + intensity * 3;
            return <circle key={i} cx={point.x} cy={point.y} r={radius} fill={color} opacity={0.3 + intensity * 0.5} />;
          })}
        </svg>

        <div className="flex gap-4 mt-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span>Winners</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <span>Errores</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-yellow-400" />
            <span>Rally</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
