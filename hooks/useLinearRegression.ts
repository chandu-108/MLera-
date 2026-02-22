import { useMutation, useQuery } from "@tanstack/react-query";
import type { DataPoint, TrainingParams, TrainingResult } from "@shared/schema";

interface Dataset {
  name: string;
  data: DataPoint[];
}

// Fetch available datasets
export function useDatasets() {
  return useQuery<Dataset[]>({
    queryKey: ["datasets"],
    queryFn: async () => {
      const response = await fetch("/api/datasets");
      if (!response.ok) {
        throw new Error("Failed to fetch datasets");
      }
      return response.json();
    },
  });
}

// Fetch specific dataset
export function useDataset(name: string) {
  return useQuery<Dataset>({
    queryKey: ["dataset", name],
    queryFn: async () => {
      const response = await fetch(`/api/datasets/${name}`);
      if (!response.ok) {
        throw new Error("Failed to fetch dataset");
      }
      return response.json();
    },
    enabled: !!name,
  });
}

// Train model
export function useTrainModel() {
  return useMutation<TrainingResult, Error, TrainingParams>({
    mutationFn: async (params: TrainingParams) => {
      const response = await fetch("/api/train", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to train model");
      }

      return response.json();
    },
  });
}

// Get prediction line
export function usePredictionLine() {
  return useMutation<
    { predictionLine: DataPoint[] },
    Error,
    { theta0: number; theta1: number; xMin: number; xMax: number; points?: number }
  >({
    mutationFn: async (params: { theta0: number; theta1: number; xMin: number; xMax: number; points?: number }) => {
      const response = await fetch("/api/prediction-line", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to get prediction line");
      }

      return response.json();
    },
  });
}
