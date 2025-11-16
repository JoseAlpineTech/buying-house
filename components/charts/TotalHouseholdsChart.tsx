"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Label,
  Legend,
} from "../../lib/recharts";
import { useTranslations } from "next-intl";
import { CountryData } from "../../data/affordability";

interface TotalHouseholdsChartProps {
  countryData: CountryData;
}

const formatNumber = (value: number) => {
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(2)}M`;
  }
  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(1)}K`;
  }
  return value.toString();
};

const processChartData = (countryData: CountryData) => {
  if (!countryData?.numberOfHouseholds) return [];

  return countryData.numberOfHouseholds
    .map((d) => ({
      year: d.year,
      households: Math.round(d.value),
    }))
    .filter(Boolean) as { year: number; households: number }[];
};

export function TotalHouseholdsChart({
  countryData,
}: TotalHouseholdsChartProps) {
  const chartData = processChartData(countryData);
  const t = useTranslations("Charts");

  return (
    <div className="h-96">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{ top: 10, right: 30, left: 30, bottom: 30 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
          <XAxis dataKey="year" stroke="var(--color-text)">
            <Label
              value={t("year")}
              offset={-20}
              position="insideBottom"
              fill="var(--color-text)"
            />
          </XAxis>
          <YAxis stroke="var(--color-text)" tickFormatter={formatNumber}>
            <Label
              value={t("TotalHouseholds.yAxisLabel")}
              offset={-20}
              angle={-90}
              position="insideLeft"
              fill="var(--color-text)"
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
            formatter={(value: number) => new Intl.NumberFormat().format(value)}
          />
          <Legend verticalAlign="top" height={36} />
          <Line
            type="monotone"
            dataKey="households"
            name={t("TotalHouseholds.legend")}
            stroke="var(--color-accent)"
            strokeWidth={3}
            dot={{ r: 3 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}