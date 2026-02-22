import { NextResponse } from "next/server";
import { datasets } from "@/lib/linearRegression";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ name: string }> }
) {
  const { name } = await params;
  const data = datasets[name];
  
  if (!data) {
    return NextResponse.json(
      { message: "Dataset not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({ name, data });
}
