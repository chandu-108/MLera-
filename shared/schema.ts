// Linear Regression Types
export interface DataPoint {
  x: number;
  y: number;
}

export interface Dataset {
  name: string;
  data: DataPoint[];
  description: string;
}

export interface TrainingParams {
  learningRate: number;
  iterations: number;
  datasetName: string;
}

export interface ModelState {
  theta0: number;
  theta1: number;
  cost: number;
  iteration: number;
}

export interface TrainingResult {
  history: ModelState[];
  finalTheta0: number;
  finalTheta1: number;
  finalCost: number;
  dataset: DataPoint[];
}
