import { NextRequest, NextResponse } from "next/server";
import { generateCompleteAnalysis } from "@/lib/analysis-engine";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { matchId, playerNames = ["Jugador 1", "Jugador 2"] } = body;

    console.log("🎬 [ANÁLISIS PROFESIONAL] Generando estadísticas completas");

    // Generar análisis completo con todas las estadísticas
    const analysis = generateCompleteAnalysis(matchId, playerNames);

    console.log("✅ Análisis profesional completado");

    return NextResponse.json({
      success: true,
      matchId,
      analysis,
      message: "✅ Análisis profesional completo con 50+ estadísticas",
    });
  } catch (error) {
    console.error("❌ Error:", error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}
