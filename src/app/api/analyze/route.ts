import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { matchId } = body;

    return NextResponse.json({
      success: true,
      matchId,
      analysis: {
        playersAnalyzed: 2,
        playerLevels: [
          {
            playerName: "Jugador 1",
            playerLevel: 4.8,
            confidence: 0.92,
          },
          {
            playerName: "Jugador 2",
            playerLevel: 4.2,
            confidence: 0.87,
          },
        ],
        highlightsDuration: "4-5 min",
        analysisCompletedAt: new Date().toISOString(),
        metrics: {
          winners: 45,
          unforcedErrors: 12,
          volleySuccess: 78,
          serveSpeed: 115,
        },
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}
