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
  ReferenceLine,
} from "recharts";
import { useTranslations } from "next-intl";
import { CountryData } from "../../data/affordability";

interface PriceToRentChartProps {
  countryData: CountryData;
}

const processChartData = (countryData: CountryData) => {
  if (!countryData?.rentPriceIndex) return [];

  return countryData.rentPriceIndex
    .map((d) => ({
      year: d.year,
      ptr: parseFloat(d.value.toFixed(2)),
    }))
    .filter(Boolean) as { year: number; ptr: number }[];
};

export function PriceToRentChart({ countryData }: PriceToRentChartProps) {
  const chartData = processChartData(countryData);
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
              value={t("PriceToRent.yAxisLabel")}
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
          <ReferenceLine
            y={100}
            stroke="var(--color-accent)"
            strokeDasharray="4 4"
          >
            <Label
              value="100"
              position="right"
              fill="var(--color-accent)"
              fontSize={8}
              dx={10}
            />
          </ReferenceLine>
          <Line
            type="monotone"
            dataKey="ptr"
            name={t("PriceToRent.legend")}
            stroke="#16a34a"
            strokeWidth={3}
            dot={{ r: 3 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}