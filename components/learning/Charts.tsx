import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  ZAxis,
} from "recharts";
import type { DataPoint } from "@shared/schema";

interface LinearRegressionChartProps {
  data: DataPoint[];
  predictionLine?: DataPoint[];
  title?: string;
}

export function LinearRegressionChart({
  data,
  predictionLine,
  title,
}: LinearRegressionChartProps) {
  return (
    <div className="w-full h-full">
      {title && (
        <h3 className="text-sm font-medium text-center mb-2">{title}</h3>
      )}
      <ResponsiveContainer width="100%" height={300}>
        <ScatterChart
          margin={{
            top: 20,
            right: 20,
            bottom: 20,
            left: 20,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            type="number"
            dataKey="x"
            name="X"
            label={{ value: "X", position: "insideBottom", offset: -10 }}
          />
          <YAxis
            type="number"
            dataKey="y"
            name="Y"
            label={{ value: "Y", angle: -90, position: "insideLeft" }}
          />
          <ZAxis range={[60, 60]} />
          <Tooltip cursor={{ strokeDasharray: "3 3" }} />
          <Legend />
          <Scatter
            name="Data Points"
            data={data}
            fill="#8b5cf6"
            shape="circle"
          />
          {predictionLine && predictionLine.length > 0 && (
            <Scatter
              name="Regression Line"
              data={predictionLine}
              fill="none"
              line={{ stroke: "#ec4899", strokeWidth: 2 }}
              shape="circle"
            />
          )}
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}

interface CostChartProps {
  data: DataPoint[];
  title?: string;
}

export function CostChart({ data, title }: CostChartProps) {
  return (
    <div className="w-full h-full">
      {title && (
        <h3 className="text-sm font-medium text-center mb-2">{title}</h3>
      )}
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={data}
          margin={{
            top: 20,
            right: 20,
            bottom: 20,
            left: 20,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="x"
            label={{ value: "Iteration", position: "insideBottom", offset: -10 }}
          />
          <YAxis
            label={{ value: "Cost", angle: -90, position: "insideLeft" }}
          />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="y"
            stroke="#8b5cf6"
            name="Cost"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

interface ParameterChartProps {
  theta0Data: DataPoint[];
  theta1Data: DataPoint[];
  title?: string;
}

export function ParameterChart({
  theta0Data,
  theta1Data,
  title,
}: ParameterChartProps) {
  // Merge the data for dual line chart
  const mergedData = theta0Data.map((point, index) => ({
    iteration: point.x,
    theta0: point.y,
    theta1: theta1Data[index]?.y || 0,
  }));

  return (
    <div className="w-full h-full">
      {title && (
        <h3 className="text-sm font-medium text-center mb-2">{title}</h3>
      )}
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={mergedData}
          margin={{
            top: 20,
            right: 20,
            bottom: 20,
            left: 20,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="iteration"
            label={{ value: "Iteration", position: "insideBottom", offset: -10 }}
          />
          <YAxis
            label={{ value: "Parameter Value", angle: -90, position: "insideLeft" }}
          />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="theta0"
            stroke="#8b5cf6"
            name="θ₀ (Intercept)"
            strokeWidth={2}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="theta1"
            stroke="#ec4899"
            name="θ₁ (Slope)"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
