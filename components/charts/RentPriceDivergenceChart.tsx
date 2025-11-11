"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { CountryData } from "../../data/affordability";

interface RentPriceDivergenceChartProps {
  countryData: CountryData;
}

const createIndexedData = (countryData: CountryData) => {
  const basePti = countryData.pti[0]?.value;
  const baseRent = countryData.rent[0]?.value;

  if (!basePti || !baseRent) return [];

  const indexedData = countryData.pti
    .map((ptiPoint) => {
      const year = ptiPoint.year;
      const rentPoint = countryData.rent.find((r) => r.year === year);
      if (!rentPoint) return null;

      const ptiValue = ptiPoint.value;
      const rentValue = rentPoint.value;

      // Assuming income growth is baked into PTI, we can use PTI as a proxy for price index
      const priceIndex = (ptiValue / basePti) * 100;
      const rentIndex = (rentValue / baseRent) * 100;

      return {
        year,
        priceIndex: parseFloat(priceIndex.toFixed(2)),
        rentIndex: parseFloat(rentIndex.toFixed(2)),
      };
    })
    .filter(Boolean);

  return indexedData as { year: number; priceIndex: number; rentIndex: number }[];
};

export function RentPriceDivergenceChart({
  countryData,
}: RentPriceDivergenceChartProps) {
  const chartData = createIndexedData(countryData);
  return (
    <div className="h-96">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(128, 128, 128, 0.3)"
          />
          <XAxis dataKey="year" />
          <YAxis yAxisId="left" stroke="#8884d8" />
          <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(30, 30, 30, 0.8)",
              borderColor: "rgba(128, 128, 128, 0.5)",
            }}
          />
          <Legend />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="priceIndex"
            name="Price Index"
            stroke="#8884d8"
            strokeWidth={2}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="rentIndex"
            name="Rent Index"
            stroke="#82ca9d"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}