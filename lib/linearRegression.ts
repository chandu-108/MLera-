import type { DataPoint, ModelState, TrainingResult } from "@shared/schema";

// Predefined datasets
export const datasets: Record<string, DataPoint[]> = {
  "sales-revenue": [
    { x: 1, y: 2.5 },
    { x: 2, y: 3.7 },
    { x: 3, y: 4.2 },
    { x: 4, y: 5.8 },
    { x: 5, y: 6.1 },
    { x: 6, y: 7.3 },
    { x: 7, y: 8.0 },
    { x: 8, y: 9.2 },
    { x: 9, y: 10.1 },
    { x: 10, y: 11.5 },
  ],
  "salary-experience": [
    { x: 1, y: 40 },
    { x: 2, y: 45 },
    { x: 3, y: 52 },
    { x: 4, y: 58 },
    { x: 5, y: 65 },
    { x: 6, y: 72 },
    { x: 7, y: 80 },
    { x: 8, y: 88 },
    { x: 9, y: 95 },
    { x: 10, y: 105 },
  ],
  "house-prices": [
    { x: 500, y: 150 },
    { x: 750, y: 200 },
    { x: 1000, y: 250 },
    { x: 1250, y: 300 },
    { x: 1500, y: 350 },
    { x: 1750, y: 400 },
    { x: 2000, y: 450 },
    { x: 2250, y: 500 },
    { x: 2500, y: 550 },
    { x: 2750, y: 600 },
  ],
};

// Hypothesis function: h(x) = theta0 + theta1 * x
function hypothesis(x: number, theta0: number, theta1: number): number {
  return theta0 + theta1 * x;
}

// Cost function: J(theta) = (1/2m) * sum((h(x) - y)^2)
function computeCost(
  data: DataPoint[],
  theta0: number,
  theta1: number
): number {
  const m = data.length;
  let sum = 0;

  for (const point of data) {
    const prediction = hypothesis(point.x, theta0, theta1);
    const error = prediction - point.y;
    sum += error * error;
  }

  return sum / (2 * m);
}

// Gradient Descent
export function trainLinearRegression(
  datasetName: string,
  learningRate: number,
  iterations: number
): TrainingResult {
  const data = datasets[datasetName];
  if (!data) {
    throw new Error(`Dataset ${datasetName} not found`);
  }

  const m = data.length;
  let theta0 = 0;
  let theta1 = 0;
  const history: ModelState[] = [];

  // Record initial state
  history.push({
    theta0,
    theta1,
    cost: computeCost(data, theta0, theta1),
    iteration: 0,
  });

  // Gradient descent
  for (let iter = 1; iter <= iterations; iter++) {
    let sum0 = 0;
    let sum1 = 0;

    // Calculate gradients
    for (const point of data) {
      const prediction = hypothesis(point.x, theta0, theta1);
      const error = prediction - point.y;
      sum0 += error;
      sum1 += error * point.x;
    }

    // Update parameters simultaneously
    const newTheta0 = theta0 - (learningRate * sum0) / m;
    const newTheta1 = theta1 - (learningRate * sum1) / m;

    theta0 = newTheta0;
    theta1 = newTheta1;

    // Record state at this iteration
    const cost = computeCost(data, theta0, theta1);
    history.push({
      theta0,
      theta1,
      cost,
      iteration: iter,
    });
  }

  return {
    history,
    finalTheta0: theta0,
    finalTheta1: theta1,
    finalCost: computeCost(data, theta0, theta1),
    dataset: data,
  };
}

// Get prediction line points for visualization
export function getPredictionLine(
  theta0: number,
  theta1: number,
  xMin: number,
  xMax: number,
  points: number = 100
): DataPoint[] {
  const result: DataPoint[] = [];
  const step = (xMax - xMin) / (points - 1);

  for (let i = 0; i < points; i++) {
    const x = xMin + i * step;
    const y = hypothesis(x, theta0, theta1);
    result.push({ x, y });
  }

  return result;
}

// Get cost vs iteration data
export function getCostHistory(history: ModelState[]): DataPoint[] {
  return history.map((state) => ({
    x: state.iteration,
    y: state.cost,
  }));
}

// Get parameter evolution data
export function getParameterHistory(
  history: ModelState[],
  parameter: "theta0" | "theta1"
): DataPoint[] {
  return history.map((state) => ({
    x: state.iteration,
    y: state[parameter],
  }));
}
