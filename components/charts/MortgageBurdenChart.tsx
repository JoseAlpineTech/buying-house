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
  ReferenceArea,
  Label,
} from "recharts";
import { CountryData } from "../../data/affordability";
import { calcMortgagePayment, calcMPS } from "../../lib/metrics";

interface MortgageBurdenChartProps {
  countryData: CountryData;
  ltv: number;
  term: number;
  isMini?: boolean; // New prop to control the variant
}

const processBurdenData = (
  countryData: CountryData,
  ltv: number,
  term: number,
) => {
  const data = countryData.income
    .map((incomePoint) => {
      const year = incomePoint.year;
      const income = incomePoint.value;

      const ptiPoint = countryData.pti.find((p) => p.year === year);
      const ratePoint = countryData.mortgageRate.find((r) => r.year === year);

      if (!ptiPoint || !ratePoint) return null;

      const price = income * ptiPoint.value;
      const rate = ratePoint.value;

      const payment = calcMortgagePayment(rate, price, ltv, term);
      const mps = calcMPS(income, payment);

      return {
        year,
        mps: parseFloat(mps.toFixed(2)),
      };
    })
    .filter(Boolean);

  return data as { year: number; mps: number }[];
};

export function MortgageBurdenChart({
  countryData,
  ltv,
  term,
  isMini = false,
}: MortgageBurdenChartProps) {
  const chartData = processBurdenData(countryData, ltv, term);

  return (
    <div className={isMini ? "h-60" : "h-96"}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={
            isMini
              ? { top: 5, right: 20, left: -10, bottom: 5 }
              : { top: 5, right: 30, left: 20, bottom: 5 }
          }
        >
          {!isMini && (
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(128, 128, 128, 0.3)"
            />
          )}
          <XAxis dataKey="year" />
          <YAxis
            unit="%"
            domain={[0, (dataMax: number) => Math.max(dataMax, 45)]} // Start at 0 and ensure the axis includes at least the 43% high-risk benchmark
            allowDataOverflow={true}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(30, 30, 30, 0.8)",
              borderColor: "rgba(128, 128, 128, 0.5)",
            }}
            formatter={(value: number) => `${value.toFixed(1)}%`}
          />
          {!isMini && <Legend />}

          {/* Sustainable Limit Indicator for the mini chart */}
          {isMini && (
            <ReferenceArea
              y1={0}
              y2={30} // 30% is a common affordability benchmark
              ifOverflow="visible"
              stroke="none"
              fill="rgba(75, 181, 67, 0.15)"
            >
              <Label
                value="Sustainable Limit (~30%)"
                position="insideTopLeft"
                fill="rgba(75, 181, 67, 0.8)"
                fontSize={12}
                offset={10}
              />
            </ReferenceArea>
          )}

          <Line
            type="monotone"
            dataKey="mps"
            name="Mortgage Payment to Income"
            stroke="#ff7300"
            strokeWidth={2}
            dot={!isMini}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}