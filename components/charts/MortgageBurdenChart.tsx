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
  ReferenceLine,
  Label,
  Legend,
} from "../../lib/recharts";
import { useTranslations } from "next-intl";
import { CountryData, affordabilityData } from "../../data/affordability";
import { countryDisplayNames } from "../../data/countryDisplayNames";
import { calcMortgagePayment, calcMPS } from "../../lib/metrics";
import { getMetricsForYear } from "../../lib/insights";

interface MortgageBurdenChartProps {
  countryData: CountryData;
  countryCode: string;
  ltv: number;
  term: number;
  rate: number;
  isMini?: boolean;
  isComparing?: boolean;
}

const COMPARE_COLORS = ["#ef4444", "#f97316", "#8b5cf6", "#ec4899", "#3b82f6"];

export function MortgageBurdenChart({
  countryData,
  countryCode,
  ltv,
  term,
  rate,
  isMini = false,
  isComparing = false,
}: MortgageBurdenChartProps) {
  const t = useTranslations("Charts");

  const chartData = useMemo(() => {
    const processOne = (cData: CountryData, cCode: string) => {
      return cData.realIncome
        .map(({ year }) => {
          const metrics = getMetricsForYear(cData, year, cCode);
          if (!metrics) return null;
          // Use the same RATE for everyone to keep it comparable as "Mortgage Burden"
          // Note: Passing 'rate' from props which is the *latest* rate of the SELECTED country.
          // Ideally we should use each country's latest rate or a fixed rate?
          // The prop says "rate", usually implies the selected country's latest rate.
          // To be fair, we should probably use each country's own latest rate.
          const cRate = cData.mortgageRate.slice(-1)[0]?.value ?? rate;
          
          const payment = calcMortgagePayment(cRate, metrics.housePrice, ltv, term);
          const mps = calcMPS(metrics.income, payment);
          return { year, val: parseFloat(mps.toFixed(2)) };
        })
        .filter(Boolean) as { year: number; val: number }[];
    };

    // Base data
    const base = processOne(countryData, countryCode);
    const dataMap = new Map<number, any>();
    base.forEach((d) => dataMap.set(d.year, { year: d.year, [countryCode]: d.val }));

    if (!isComparing) return Array.from(dataMap.values());

    // Select comparison countries based on latest MPS
    const allCodes = Object.keys(affordabilityData).filter((c) => c !== countryCode);
    const codeMetrics = allCodes
      .map((c) => {
        const cData = affordabilityData[c as keyof typeof affordabilityData];
        const lastSeries = processOne(cData, c);
        const lastVal = lastSeries[lastSeries.length - 1]?.val;
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
      const series = processOne(cData, code);
      series.forEach((d) => {
        const existing = dataMap.get(d.year) || { year: d.year };
        existing[code] = d.val;
        dataMap.set(d.year, existing);
      });
    });

    return Array.from(dataMap.values())
      .sort((a, b) => a.year - b.year)
      .map(item => ({ ...item, _comparisonCodes: selectedCodes }));
  }, [countryData, countryCode, ltv, term, rate, isComparing]);

  const comparisonCodes = (chartData[0] as any)?._comparisonCodes || [];

  return (
    <div className={isMini ? "h-60" : "h-96"}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={
            isMini
              ? { top: 25, right: 10, left: 10, bottom: 20 }
              : { top: 10, right: 30, left: 20, bottom: 30 }
          }
        >
          {!isMini && (
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
          )}
          <XAxis dataKey="year" stroke="var(--color-text)">
            <Label
              value={t("year")}
              offset={isMini ? -15 : -20}
              position="insideBottom"
              fill="var(--color-text)"
              fontSize={isMini ? 12 : undefined}
            />
          </XAxis>
          <YAxis stroke="var(--color-text)" unit="%">
            <Label
              value={t("MortgageBurden.yAxisLabel")}
              angle={-90}
              position="insideLeft"
              fill="var(--color-text)"
              fontSize={isMini ? 12 : undefined}
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
            formatter={(v: number) => `${v.toFixed(1)}%`}
          />
          <Legend
            verticalAlign="top"
            height={isMini ? 25 : 36}
            wrapperStyle={isMini ? { fontSize: "12px" } : undefined}
          />
          {!isMini && (
            <ReferenceLine
              y={30}
              stroke="var(--color-accent)"
              strokeDasharray="4 4"
            >
              <Label
                value={t("MortgageBurden.thresholdLabel")}
                position="right"
                fill="var(--color-accent)"
                fontSize={12}
                dy={-10}
                dx={-90}
              />
            </ReferenceLine>
          )}
          <Line
            type="monotone"
            dataKey={countryCode}
            name={countryDisplayNames[countryCode as keyof typeof countryDisplayNames]}
            stroke="var(--color-accent)"
            strokeWidth={3}
            dot={!isMini}
          />
          {isComparing &&
            comparisonCodes.map((code: string, index: number) => (
              <Line
                key={code}
                type="monotone"
                dataKey={code}
                name={countryDisplayNames[code as keyof typeof countryDisplayNames]}
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