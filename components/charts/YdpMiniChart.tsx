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
import { CountryData } from "../../data/affordability";
import { calcYDP } from "../../lib/metrics";

interface YdpMiniChartProps {
  countryData: CountryData;
  ltv: number;
  savingsRate: number;
}

const processYdpData = (
  countryData: CountryData,
  ltv: number,
  savingsRate: number,
) => {
  return countryData.income
    .map((incomePoint) => {
      const ptiPoint = countryData.pti.find((p) => p.year === incomePoint.year);
      if (!ptiPoint) return null;

      const housePrice = incomePoint.value * ptiPoint.value;
      const ydp = calcYDP(housePrice, ltv, incomePoint.value, savingsRate);

      return {
        year: incomePoint.year,
        ydp: parseFloat(ydp.toFixed(2)),
      };
    })
    .filter(Boolean) as { year: number; ydp: number }[];
};

export function YdpMiniChart({
  countryData,
  ltv,
  savingsRate,
}: YdpMiniChartProps) {
  const chartData = processYdpData(countryData, ltv, savingsRate);

  return (
    <div className="mt-6 h-60">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{ top: 25, right: 20, left: 10, bottom: 20 }}
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
          <YAxis domain={[0, "auto"]} stroke="var(--color-text)">
            <Label
              value="Years"
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
            formatter={(value: number) => `${value.toFixed(1)} years`}
          />
          <Legend
            verticalAlign="top"
            height={25}
            wrapperStyle={{ fontSize: "12px" }}
          />
          <Line
            type="monotone"
            dataKey="ydp"
            name="Years to Save"
            stroke="#ffb703"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}