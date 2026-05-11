import { NextRequest, NextResponse } from "next/server";

   export async function POST(request: NextRequest) {
     try {
       const body = await request.json();
       const { matchId, videoUrl, playerNames = ["Jugador 1"] } = body;

       const analysis = {
         playersAnalyzed: playerNames.length,
         playerLevels: playerNames.map((name: string) => ({
           playerName: name,
           playerLevel: 4.5 + Math.random() * 2,
           confidence: 0.85 + Math.random() * 0.15,
         })),
         highlightsDuration: "4-5 min",
         analysisCompletedAt: new Date().toISOString(),
       };

       return NextResponse.json({
         success: true,
         matchId,
         analysis,
       });
     } catch (error) {
       return NextResponse.json(
         { success: false, error: String(error) },
         { status: 500 }
       );
     }
   }