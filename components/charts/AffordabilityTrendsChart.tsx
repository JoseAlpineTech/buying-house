"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceArea,
} from "recharts";
import { TimeSeriesDataPoint } from "../../data/affordability";

interface AffordabilityTrendsChartProps {
  ptiData: readonly TimeSeriesDataPoint[];
  ptrData: readonly TimeSeriesDataPoint[];
}

// Combine data for charting
const processChartData = (
  pti: readonly TimeSeriesDataPoint[],
  ptr: readonly TimeSeriesDataPoint[],
) => {
  const dataMap = new Map<
    number,
    { year: number; pti?: number; ptr?: number }
  >();

  pti.forEach(({ year, value }) => {
    if (!dataMap.has(year)) dataMap.set(year, { year });
    dataMap.get(year)!.pti = value;
  });

  ptr.forEach(({ year, value }) => {
    if (!dataMap.has(year)) dataMap.set(year, { year });
    dataMap.get(year)!.ptr = value;
  });

  return Array.from(dataMap.values()).sort((a, b) => a.year - b.year);
};

export function AffordabilityTrendsChart({
  ptiData,
  ptrData,
}: AffordabilityTrendsChartProps) {
  const chartData = processChartData(ptiData, ptrData);

  return (
    <div className="h-96">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(128, 128, 128, 0.3)"
          />
          <XAxis dataKey="year" />
          <YAxis />
          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(30, 30, 30, 0.8)",
              borderColor: "rgba(128, 128, 128, 0.5)",
            }}
          />
          <Legend />
          <ReferenceArea
            x1={2020}
            x2={2025}
            stroke="none"
            fill="rgba(255, 165, 0, 0.1)"
            label={{
              value: "Recent",
              position: "insideTop",
              fill: "rgba(255, 255, 255, 0.5)",
            }}
          />
          <Line
            type="monotone"
            dataKey="pti"
            name="Price-to-Income"
            stroke="#8884d8"
            strokeWidth={2}
            activeDot={{ r: 8 }}
          />
          <Line
            type="monotone"
            dataKey="ptr"
            name="Price-to-Rent"
            stroke="#82ca9d"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}