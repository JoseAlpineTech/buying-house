"use client";

import { useMemo } from "react";
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
import { CountryData, affordabilityData } from "../../data/affordability";
import { countryDisplayNames } from "../../data/countryDisplayNames";
import { getMetricsForYear } from "../../lib/insights";

interface AffordabilityTrendsChartProps {
  countryData: CountryData;
  countryCode: string;
  isComparing?: boolean;
}

interface ChartDataPoint {
  year: number;
  _comparisonCodes?: string[];
  [key: string]: number | string[] | undefined;
}

const COMPARE_COLORS = [
  "#ef4444", // Red
  "#f97316", // Orange
  "#8b5cf6", // Purple
  "#ec4899", // Pink
  "#3b82f6", // Blue
];

export function AffordabilityTrendsChart({
  countryData,
  countryCode,
  isComparing = false,
}: AffordabilityTrendsChartProps) {
  const t = useTranslations("Charts");

  const chartData = useMemo(() => {
    // 1. Get base data for selected country
    const years = countryData.realIncome.map((d) => d.year);
    const baseData = years
      .map((year) => {
        const metrics = getMetricsForYear(countryData, year, countryCode);
        if (!metrics) return null;
        return {
          year,
          [countryCode]: parseFloat(metrics.pti.toFixed(2)),
        };
      })
      .filter(Boolean) as ChartDataPoint[];

    if (!isComparing) return baseData;

    // 2. Identify comparison countries
    const allCodes = Object.keys(affordabilityData).filter(
      (c) => c !== countryCode,
    );
    const codeMetrics = allCodes
      .map((c) => {
        const cData = affordabilityData[c as keyof typeof affordabilityData];
        const lastYear = cData.realIncome.slice(-1)[0]?.year;
        if (!lastYear) return null;
        const m = getMetricsForYear(cData, lastYear, c);
        return m ? { code: c, val: m.pti } : null;
      })
      .filter(Boolean) as { code: string; val: number }[];

    codeMetrics.sort((a, b) => b.val - a.val);

    // Pick 5
    let selectedCodes: string[] = [];
    if (codeMetrics.length <= 5) {
      selectedCodes = codeMetrics.map((c) => c.code);
    } else {
      const top2 = codeMetrics.slice(0, 2);
      const bottom2 = codeMetrics.slice(-2);
      const median = codeMetrics[Math.floor(codeMetrics.length / 2)];
      selectedCodes = [...top2, median, ...bottom2].map((c) => c.code);
    }

    // 3. Merge data
    // Create a map of year -> object
    const dataMap = new Map<number, ChartDataPoint>();
    baseData.forEach((d) => dataMap.set(d.year, { ...d }));

    selectedCodes.forEach((code) => {
      const cData = affordabilityData[code as keyof typeof affordabilityData];
      cData.realIncome.forEach((d) => {
        const m = getMetricsForYear(cData, d.year, code);
        if (m) {
          const existing = dataMap.get(d.year) || { year: d.year };
          existing[code] = parseFloat(m.pti.toFixed(2));
          dataMap.set(d.year, existing);
        }
      });
    });

    return Array.from(dataMap.values())
      .sort((a, b) => a.year - b.year)
      .map((item) => ({ ...item, _comparisonCodes: selectedCodes }));
  }, [countryData, countryCode, isComparing]);

  const comparisonCodes =
    (chartData[0] as ChartDataPoint | undefined)?._comparisonCodes || [];

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
            dataKey={countryCode}
            name={
              countryDisplayNames[
                countryCode as keyof typeof countryDisplayNames
              ]
            }
            stroke="var(--color-accent)"
            strokeWidth={3}
            dot={{ r: 3 }}
          />
          {isComparing &&
            comparisonCodes.map((code: string, index: number) => (
              <Line
                key={code}
                type="monotone"
                dataKey={code}
                name={
                  countryDisplayNames[
                    code as keyof typeof countryDisplayNames
                  ] ?? code
                }
                stroke={COMPARE_COLORS[index % COMPARE_COLORS.length]}
                strokeWidth={2}
                dot={false}
                strokeOpacity={0.7}
              />
            ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}