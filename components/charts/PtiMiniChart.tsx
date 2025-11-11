"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceArea,
  Label,
} from "recharts";
import { TimeSeriesDataPoint } from "../../data/affordability";

interface PtiMiniChartProps {
  data: readonly TimeSeriesDataPoint[];
}

export function PtiMiniChart({ data }: PtiMiniChartProps) {
  return (
    <div className="mt-6 h-60">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={[...data]} // Create a mutable copy for recharts
          margin={{
            top: 5,
            right: 20,
            left: -10,
            bottom: 5,
          }}
        >
          <XAxis dataKey="year" />
          <YAxis domain={["auto", "auto"]} />
          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(30, 30, 30, 0.8)",
              borderColor: "rgba(128, 128, 128, 0.5)",
            }}
          />

          {/* Healthy Range Indicator */}
          <ReferenceArea
            y1={3}
            y2={5}
            ifOverflow="visible" // Ensures the area is drawn even if data is outside this range
            stroke="none"
            fill="rgba(75, 181, 67, 0.15)" // Subtle green fill
          >
            <Label
              value="Healthy Range (3-5)"
              position="insideTopLeft"
              fill="rgba(75, 181, 67, 0.8)"
              fontSize={12}
              offset={10}
            />
          </ReferenceArea>

          <Line
            type="monotone"
            dataKey="value"
            name="Price-to-Income Ratio"
            stroke="#8884d8"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}