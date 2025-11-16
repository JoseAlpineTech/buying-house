"use client";

import { useTranslations } from "next-intl";
import {
  CartesianGrid,
  Label,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "../../lib/recharts";
import { CountryData } from "../../data/affordability";
import { getMetricsForYear } from "../../lib/insights";

interface AffordabilityTrendsChartProps {
  countryData: CountryData;
  countryCode: string;
}

const processChartData = (countryData: CountryData, countryCode: string) => {
  if (!countryData?.realIncome) return [];

  return countryData.realIncome
    .map(({ year }) => {
      const metrics = getMetricsForYear(countryData, year, countryCode);
      if (!metrics) return null;
      return {
        year: metrics.year,
        pti: parseFloat(metrics.pti.toFixed(2)),
      };
    })
    .filter(Boolean) as { year: number; pti: number }[];
};

export function AffordabilityTrendsChart({
  countryData,
  countryCode,
}: AffordabilityTrendsChartProps) {
  const chartData = processChartData(countryData, countryCode);
  const t = useTranslations("Charts");

  return (
    <div className="h-96">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{ top: 10, right: 30, left: 20, bottom: 30 }}
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
          <YAxis stroke="var(--color-text)">
            <Label
              value={t("AffordabilityTrends.yAxisLabel")}
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
          />
          <Legend verticalAlign="top" height={36} />
          <Line
            type="monotone"
            dataKey="pti"
            name={t("AffordabilityTrends.legend")}
            stroke="var(--color-accent)"
            strokeWidth={3}
            dot={{ r: 3 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}