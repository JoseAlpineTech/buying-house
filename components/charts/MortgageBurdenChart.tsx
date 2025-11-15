"use client";

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
} from "recharts";
import { useTranslations } from "next-intl";
import { CountryData } from "../../data/affordability";
import { calcMortgagePayment, calcMPS } from "../../lib/metrics";
import { getMetricsForYear } from "../../lib/insights";

interface MortgageBurdenChartProps {
  countryData: CountryData;
  countryCode: string;
  ltv: number;
  term: number;
  rate: number;
  isMini?: boolean;
}

const processBurdenData = (
  countryData: CountryData,
  countryCode: string,
  ltv: number,
  term: number,
  rate: number, // Use a single rate for all calculations
) => {
  if (!countryData?.realIncome) return [];

  return countryData.realIncome
    .map(({ year }) => {
      const metrics = getMetricsForYear(countryData, year, countryCode);
      if (!metrics) return null;

      const payment = calcMortgagePayment(
        rate, // Use the provided latest rate
        metrics.housePrice,
        ltv,
        term,
      );
      const mps = calcMPS(metrics.income, payment);

      return { year: metrics.year, mps: parseFloat(mps.toFixed(2)) };
    })
    .filter(Boolean) as { year: number; mps: number }[];
};

export function MortgageBurdenChart({
  countryData,
  countryCode,
  ltv,
  term,
  rate,
  isMini = false,
}: MortgageBurdenChartProps) {
  const data = processBurdenData(countryData, countryCode, ltv, term, rate);
  const t = useTranslations("Charts");

  return (
    <div className={isMini ? "h-60" : "h-96"}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
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
            dataKey="mps"
            name={t("MortgageBurden.legend")}
            stroke="var(--color-accent)"
            strokeWidth={3}
            dot={!isMini}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}