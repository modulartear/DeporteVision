import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    success: true,
    timestamp: new Date().toISOString(),
    status: "✅ Sistema DeporteVision EN VIVO",
    message: "Análisis en tiempo real disponible",
    endpoints: {
      liveAnalysis: "/dashboard/live-analysis",
      analysis: "/api/analyze",
    },
  });
}
