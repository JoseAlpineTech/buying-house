"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
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
          margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
        >
          <XAxis dataKey="year" />
          <YAxis
            domain={[0, "auto"]}
            label={{ value: "Years", angle: -90, position: "insideLeft" }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(30, 30, 30, 0.8)",
              borderColor: "rgba(128, 128, 128, 0.5)",
            }}
            formatter={(value: number) => `${value.toFixed(1)} years`}
          />
          <Line
            type="monotone"
            dataKey="ydp"
            name="Years to Save"
            stroke="#413ea0"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}