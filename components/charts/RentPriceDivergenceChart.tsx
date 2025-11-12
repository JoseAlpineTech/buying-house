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
interface RentPriceDivergenceChartProps {
  countryData: CountryData;
}
const createIndexedData = (c: CountryData) => {
  const basePti = c.pti[0]?.value;
  const baseRent = c.rent[0]?.value;
  if (!basePti || !baseRent) return [];
  return c.pti
    .map((p) => {
      const rent = c.rent.find((r) => r.year === p.year);
      if (!rent) return null;
      const priceIndex = (p.value / basePti) * 100;
      const rentIndex = (rent.value / baseRent) * 100;
      return {
        year: p.year,
        priceIndex: parseFloat(priceIndex.toFixed(2)),
        rentIndex: parseFloat(rentIndex.toFixed(2)),
      };
    })
    .filter(Boolean) as { year: number; priceIndex: number; rentIndex: number }[];
};
export function RentPriceDivergenceChart({ countryData }: RentPriceDivergenceChartProps) {
  const data = createIndexedData(countryData);
  return (
    <div className="h-96">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 10, right: 30, left: 20, bottom: 30 }}
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
          <YAxis stroke="var(--color-text)">
            <Label
              value="Index (1985=100)"
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
            yAxisId={0}
            type="monotone"
            dataKey="priceIndex"
            stroke="#2563eb"
            strokeWidth={3}
            dot={false}
            name="Price Index"
          />
          <Line
            yAxisId={0}
            type="monotone"
            dataKey="rentIndex"
            stroke="#10b981"
            strokeWidth={3}
            dot={false}
            name="Rent Index"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}