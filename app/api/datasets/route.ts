import { NextResponse } from "next/server";
import { datasets } from "@/lib/linearRegression";

export async function GET() {
  const datasetList = Object.keys(datasets).map((key) => ({
    name: key,
    data: datasets[key],
  }));
  
  return NextResponse.json(datasetList);
}
