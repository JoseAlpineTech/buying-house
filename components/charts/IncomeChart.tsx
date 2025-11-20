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
} from "../../lib/recharts";
import { useTranslations } from "next-intl";
import { CountryData, affordabilityData } from "../../data/affordability";
import { currencies } from "../../data/currency";
import { countryDisplayNames } from "../../data/countryDisplayNames";

interface IncomeChartProps {
  countryData: CountryData;
  countryCode: string;
  isComparing?: boolean;
}

interface ChartDataPoint {
  year: number;
  _comparisonCodes?: string[];
  [key: string]: number | string[] | undefined;
}

const COMPARE_COLORS = ["#ef4444", "#f97316", "#8b5cf6", "#ec4899", "#3b82f6"];

const formatCurrency = (value: number, currencyCode: string) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode,
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(value);

const formatNormalized = (value: number) => value.toFixed(2);

export function IncomeChart({
  countryData,
  countryCode,
  isComparing = false,
}: IncomeChartProps) {
  const currency =
    currencies[countryCode as keyof typeof currencies] ?? currencies.USA;
  const t = useTranslations("Charts");

  const chartData = useMemo(() => {
    const processOne = (cData: CountryData) => {
      if (!cData.realIncome) return [];
      return cData.realIncome.map((d) => ({
        year: d.year,
        val: d.value,
      }));
    };

    const normalize = (data: { year: number; val: number }[]) => {
      if (data.length === 0) return [];
      const vals = data.map((d) => d.val);
      const min = Math.min(...vals);
      const max = Math.max(...vals);
      const range = max - min;

      // Avoid division by zero if flat line
      if (range === 0) return data.map((d) => ({ ...d, val: 0.5 }));

      return data.map((d) => ({
        ...d,
        val: (d.val - min) / range,
      }));
    };

    let base = processOne(countryData);
    if (isComparing) {
      base = normalize(base);
    }

    const dataMap = new Map<number, ChartDataPoint>();
    base.forEach((d) =>
      dataMap.set(d.year, { year: d.year, [countryCode]: d.val }),
    );

    if (!isComparing) return Array.from(dataMap.values());

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
      let series = processOne(cData);

      // Normalize each comparison series individually so shapes can be compared
      // irrespective of currency magnitude.
      if (isComparing) {
        series = normalize(series);
      }

      series.forEach((d) => {
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
          <YAxis
            stroke="var(--color-text)"
            tickFormatter={(value) =>
              isComparing
                ? value.toFixed(1)
                : new Intl.NumberFormat("en-US", {
                    notation: "compact",
                    compactDisplay: "short",
                  }).format(value as number)
            }
          >
            <Label
              value={
                isComparing
                  ? "Normalized Growth (0-1)"
                  : t("Income.yAxisLabel", { currencyCode: currency.code })
              }
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
            formatter={(value: number) => {
              if (isComparing) {
                return formatNormalized(value);
              }
              return formatCurrency(value, currency.code);
            }}
          />
          <Legend verticalAlign="top" height={36} />
          <Line
            type="monotone"
            dataKey={countryCode}
            name={
              countryDisplayNames[
                countryCode as keyof typeof countryDisplayNames
              ] ?? t("Income.legend")
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