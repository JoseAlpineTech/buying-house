"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Label,
  Legend,
} from "recharts";
import { TimeSeriesDataPoint } from "../../data/affordability";

interface IncomeMiniChartProps {
  data: readonly TimeSeriesDataPoint[];
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(value);

export function IncomeMiniChart({ data }: IncomeMiniChartProps) {
  return (
    <div className="mt-4 h-60">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={[...data]} // Create a mutable copy for recharts
          margin={{
            top: 25,
            right: 20,
            left: 50, // More space for currency labels
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
          <YAxis
            domain={["auto", "auto"]}
            stroke="var(--color-text)"
            tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
          >
            <Label
              value="Income"
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
            formatter={(value: number) => formatCurrency(value)}
          />

          <Legend
            verticalAlign="top"
            height={25}
            wrapperStyle={{ fontSize: "12px" }}
          />

          <Line
            type="monotone"
            dataKey="value"
            name="Real Net Disposable Income"
            stroke="#ffb703"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
