import { NextResponse } from "next/server";
import { getPredictionLine } from "@/lib/linearRegression";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { theta0, theta1, xMin, xMax, points } = body;

    if (
      typeof theta0 !== "number" ||
      typeof theta1 !== "number" ||
      typeof xMin !== "number" ||
      typeof xMax !== "number"
    ) {
      return NextResponse.json(
        { message: "Invalid parameters" },
        { status: 400 }
      );
    }

    const predictionLine = getPredictionLine(
      theta0,
      theta1,
      xMin,
      xMax,
      points || 100
    );
    
    return NextResponse.json({ predictionLine });
  } catch (error) {
    console.error("Prediction error:", error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Prediction failed" },
      { status: 500 }
    );
  }
}
