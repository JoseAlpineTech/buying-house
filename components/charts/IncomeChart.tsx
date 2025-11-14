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
} from "recharts";
import { CountryData } from "../../data/affordability";
import { currencies } from "../../data/currency";

interface IncomeChartProps {
  countryData: CountryData;
  countryCode: string;
}

const processChartData = (countryData: CountryData) => {
  if (!countryData?.realIncome) return [];
  return countryData.realIncome.map((d) => ({
    year: d.year,
    income: d.value,
  }));
};

const formatCurrency = (value: number, currencyCode: string) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode,
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(value);

export function IncomeChart({ countryData, countryCode }: IncomeChartProps) {
  const chartData = processChartData(countryData);
  const currency =
    currencies[countryCode as keyof typeof currencies] ?? currencies.USA;

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
              value="Year"
              offset={-20}
              position="insideBottom"
              fill="var(--color-text)"
            />
          </XAxis>
          <YAxis
            stroke="var(--color-text)"
            tickFormatter={(value) =>
              new Intl.NumberFormat("en-US", {
                notation: "compact",
                compactDisplay: "short",
              }).format(value as number)
            }
          >
            <Label
              value={`Real Income (${currency.code})`}
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
            formatter={(value: number) => formatCurrency(value, currency.code)}
          />
          <Legend verticalAlign="top" height={36} />
          <Line
            type="monotone"
            dataKey="income"
            name="Real Disposable Income (Equivalised)"
            stroke="var(--color-accent)"
            strokeWidth={3}
            dot={{ r: 3 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}