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
  Legend,
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
            top: 25,
            right: 20,
            left: 10,
            bottom: 20,
          }}
        >
          <XAxis dataKey="year" stroke="var(--color-text)">
            <Label
              value="Year"
              offset={-15}
              position="insideBottom"
              fill="var(--color-text)"
              fontSize={12}
            />
          </XAxis>
          <YAxis domain={["auto", "auto"]} stroke="var(--color-text)">
            <Label
              value="Ratio"
              angle={-90}
              position="insideLeft"
              fill="var(--color-text)"
              fontSize={12}
              style={{ textAnchor: "middle" }}
            />
          </YAxis>
          <Tooltip
            contentStyle={{
              backgroundColor: "var(--color-card)",
              border: "1px solid var(--color-border)",
              borderRadius: "0.5rem",
            }}
            labelStyle={{ color: "var(--color-title)", fontWeight: "bold" }}
            itemStyle={{ color: "var(--color-text)" }}
          />

          <Legend
            verticalAlign="top"
            height={25}
            wrapperStyle={{ fontSize: "12px" }}
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
            stroke="#ffb703"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}