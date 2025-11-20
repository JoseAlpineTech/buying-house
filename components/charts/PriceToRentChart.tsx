"use client";

import { useMemo } from "react";
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
} from "../../lib/recharts";
import { useTranslations } from "next-intl";
import { CountryData, affordabilityData } from "../../data/affordability";
import { countryDisplayNames } from "../../data/countryDisplayNames";

interface PriceToRentChartProps {
  countryData: CountryData;
  countryCode?: string;
  isComparing?: boolean;
}

interface ChartDataPoint {
  year: number;
  _comparisonCodes?: string[];
  [key: string]: number | string[] | undefined;
}

const COMPARE_COLORS = ["#ef4444", "#f97316", "#8b5cf6", "#ec4899", "#3b82f6"];

export function PriceToRentChart({
  countryData,
  countryCode = "",
  isComparing = false,
}: PriceToRentChartProps) {
  const t = useTranslations("Charts");

  const chartData = useMemo(() => {
    const processOne = (cData: CountryData) => {
      if (!cData.rentPriceIndex) return [];
      return cData.rentPriceIndex.map((d) => ({
        year: d.year,
        val: parseFloat(d.value.toFixed(2)),
      }));
    };

    // Base
    const base = processOne(countryData);
    // If countryCode is missing (shouldn't happen in new usage), use 'Main'
    const mainKey = countryCode || "Main";

    const dataMap = new Map<number, ChartDataPoint>();
    base.forEach((d) =>
      dataMap.set(d.year, { year: d.year, [mainKey]: d.val }),
    );

    if (!isComparing || !countryCode) return Array.from(dataMap.values());

    const allCodes = Object.keys(affordabilityData).filter(
      (c) => c !== countryCode,
    );
    const codeMetrics = allCodes
      .map((c) => {
        const cData = affordabilityData[c as keyof typeof affordabilityData];
        const series = processOne(cData);
        const lastVal = series[series.length - 1]?.val;
        return lastVal ? { code: c, val: lastVal } : null;
      })
      .filter(Boolean) as { code: string; val: number }[];

    codeMetrics.sort((a, b) => b.val - a.val);

    let selectedCodes: string[] = [];
    if (codeMetrics.length <= 5) {
      selectedCodes = codeMetrics.map((c) => c.code);
    } else {
      const top2 = codeMetrics.slice(0, 2);
      const bottom2 = codeMetrics.slice(-2);
      const median = codeMetrics[Math.floor(codeMetrics.length / 2)];
      selectedCodes = [...top2, median, ...bottom2].map((c) => c.code);
    }

    selectedCodes.forEach((code) => {
      const cData = affordabilityData[code as keyof typeof affordabilityData];
      processOne(cData).forEach((d) => {
        const existing = dataMap.get(d.year) || { year: d.year };
        existing[code] = d.val;
        dataMap.set(d.year, existing);
      });
    });

    return Array.from(dataMap.values())
      .sort((a, b) => a.year - b.year)
      .map((item) => ({ ...item, _comparisonCodes: selectedCodes }));
  }, [countryData, countryCode, isComparing]);

  const comparisonCodes =
    (chartData[0] as ChartDataPoint | undefined)?._comparisonCodes || [];
  const mainKey = countryCode || "Main";

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
            dataKey={mainKey}
            name={
              countryDisplayNames[
                mainKey as keyof typeof countryDisplayNames
              ] ?? t("PriceToRent.legend")
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
                  countryDisplayNames[code as keyof typeof countryDisplayNames]
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