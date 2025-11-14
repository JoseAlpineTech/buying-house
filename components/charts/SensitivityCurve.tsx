"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceArea,
  ReferenceLine,
} from "recharts";
import { runSimulation, SimulationAssumptions } from "../../lib/simulator";

interface SensitivityCurveProps {
  currentHomePrice: number;
  mortgageRate: number;
  yearsToSimulate: number;
  downPayment: number;
  assumptions: SimulationAssumptions;
  currency: string;
}

function formatCompact(num: number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(num);
}

export default function SensitivityCurve({
  currentHomePrice,
  mortgageRate,
  yearsToSimulate,
  downPayment,
  assumptions,
  currency,
}: SensitivityCurveProps) {
  const data: { rate: number; advantage: number }[] = [];

  for (let r = 0; r <= 15; r += 0.5) {
    const modified = { ...assumptions, annualStockMarketReturn: r };

    const result = runSimulation({
      currentHomePrice,
      mortgageRate,
      yearsToSimulate,
      downPayment,
      mortgageTerm: 30,
      assumptions: modified,
    });

    data.push({
      rate: r,
      advantage:
        result.renter.finalInvestmentValue - result.homeowner.homeEquity,
    });
  }

  const yVals = data.map((d) => d.advantage);
  const rawMin = Math.min(...yVals);
  const rawMax = Math.max(...yVals);
  const pad = Math.max(Math.abs(rawMin), Math.abs(rawMax)) * 0.15;
  const yMin = rawMin - pad;
  const yMax = rawMax + pad;

  return (
    <div className="w-full">
      {/* Subtitle */}
      <div className="mb-2 text-[--color-label] text-sm">
        <p>
          <strong className="text-[--color-accent]">Y-axis:</strong> Advantage
          (Renter – Homeowner)
        </p>
        <p>
          <strong className="text-[--color-accent]">X-axis:</strong> Stock
          Market Return (%)
        </p>
      </div>

      <div className="relative w-full h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 10, right: 20, left: 45, bottom: 25 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />

            {/* Shaded regions */}
            <ReferenceArea y1={0} y2={yMax} fill="rgba(255,80,80,0.12)" />
            <ReferenceArea y1={yMin} y2={0} fill="rgba(80,200,120,0.12)" />

            <ReferenceLine
              y={0}
              stroke="var(--color-border)"
              strokeWidth={2}
              strokeDasharray="4 2"
            />

            <XAxis
              dataKey="rate"
              stroke="var(--color-text)"
              tickFormatter={(v) => `${v}%`}
            />

            <YAxis
              domain={[yMin, yMax]}
              stroke="var(--color-text)"
              tickFormatter={(v) => formatCompact(Number(v), currency)}
            />

            <Tooltip
              contentStyle={{
                backgroundColor: "var(--color-card)",
                border: "1px solid var(--color-border)",
              }}
              formatter={(value) => [
                formatCompact(Number(value), currency),
                "Renter Advantage",
              ]}
              labelFormatter={(v) => `Stock Market Return: ${v}%`}
            />

            <Line
              type="monotone"
              dataKey="advantage"
              stroke="#ffb703"
              strokeWidth={3}
              dot={false}
            />

            {/* ============================
                INSIDE-CHART SHADE LABELS
               ============================ */}
            <ReferenceLine
              y={yMax - (yMax - 0) * 0.1}
              label={{
                value: "Renting Wins",
                position: "insideLeft",
                fill: "rgba(255,120,120,0.95)",
                fontSize: 12,
                offset: 10,
              }}
              stroke="none"
            />

            <ReferenceLine
              y={yMin + (0 - yMin) * 0.15}
              label={{
                value: "Buying Wins",
                position: "insideLeft",
                fill: "rgba(120,255,180,0.95)",
                fontSize: 12,
                offset: 10,
              }}
              stroke="none"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
