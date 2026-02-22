"use client";

import { useState } from "react";
import GraphContainer from "./GraphContainer";
import SliderControl from "../shared/SliderControl";
import { LinearRegressionChart } from "./Charts";

const sampleData = [
  { x: 1, y: 2.5 },
  { x: 2, y: 3.7 },
  { x: 3, y: 4.2 },
  { x: 4, y: 5.8 },
  { x: 5, y: 6.1 },
  { x: 6, y: 7.3 },
  { x: 7, y: 8.0 },
  { x: 8, y: 9.2 },
];

export default function InteractiveVisualization() {
  const [intercept, setIntercept] = useState(1.5);
  const [slope, setSlope] = useState(0.9);

  const predictionLine = Array.from({ length: 100 }, (_, i) => {
    const x = 1 + (i * 7) / 99;
    return { x, y: intercept + slope * x };
  });

  // Calculate mean squared error for feedback
  const calculateMSE = () => {
    const errors = sampleData.map((point) => {
      const predicted = intercept + slope * point.x;
      return Math.pow(predicted - point.y, 2);
    });
    return (errors.reduce((a, b) => a + b, 0) / sampleData.length).toFixed(4);
  };

  const mse = calculateMSE();

  return (
    <div className="space-y-6">
      <GraphContainer title="Adjust the Intercept and Slope to Fit the Data">
        <LinearRegressionChart
          data={sampleData}
          predictionLine={predictionLine}
        />
      </GraphContainer>

      <div className="grid gap-6 md:grid-cols-2">
        <SliderControl
          label={`Intercept (θ₀): ${intercept.toFixed(2)}`}
          value={intercept}
          min={-5}
          max={10}
          step={0.1}
          onChange={setIntercept}
          displayValue={intercept.toFixed(2)}
        />
        <SliderControl
          label={`Slope (θ₁): ${slope.toFixed(2)}`}
          value={slope}
          min={-2}
          max={3}
          step={0.1}
          onChange={setSlope}
          displayValue={slope.toFixed(2)}
        />
      </div>

      <div className="rounded-lg bg-muted/30 p-4">
        <p className="text-sm text-center">
          <span className="font-semibold text-foreground">Mean Squared Error: </span>
          <span className="text-primary font-mono text-lg">{mse}</span>
        </p>
        <p className="text-xs text-center text-muted-foreground mt-2">
          Try adjusting the parameters to minimize the error!
        </p>
      </div>
    </div>
  );
}
