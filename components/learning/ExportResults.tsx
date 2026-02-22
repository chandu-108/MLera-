import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { TrainingResult } from "@shared/schema";

interface ExportResultsProps {
  trainingResult: TrainingResult | null;
  learningRate: number;
  iterations: number;
  dataset: string;
}

export function ExportResults({ trainingResult, learningRate, iterations, dataset }: ExportResultsProps) {
  const exportToJSON = () => {
    if (!trainingResult) return;

    const exportData = {
      timestamp: new Date().toISOString(),
      configuration: {
        dataset,
        learningRate,
        iterations,
      },
      results: {
        finalTheta0: trainingResult.finalTheta0,
        finalTheta1: trainingResult.finalTheta1,
        finalCost: trainingResult.finalCost,
      },
      history: trainingResult.history,
      dataset: trainingResult.dataset,
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `linear-regression-${dataset}-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const exportToCSV = () => {
    if (!trainingResult) return;

    const headers = ["Iteration", "Theta0", "Theta1", "Cost"];
    const rows = trainingResult.history.map((state: any) => [
      state.iteration,
      state.theta0,
      state.theta1,
      state.cost,
    ]);

    const csv = [
      headers.join(","),
      ...rows.map((row: any) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `linear-regression-${dataset}-${Date.now()}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex gap-2 flex-wrap">
      <Button
        onClick={exportToJSON}
        variant="outline"
        size="sm"
        disabled={!trainingResult}
        className="gap-2"
      >
        <Download className="h-4 w-4" />
        Export JSON
      </Button>
      <Button
        onClick={exportToCSV}
        variant="outline"
        size="sm"
        disabled={!trainingResult}
        className="gap-2"
      >
        <Download className="h-4 w-4" />
        Export CSV
      </Button>
    </div>
  );
}
