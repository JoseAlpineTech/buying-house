"use client";

import { useTranslations } from "next-intl";
import { useMemo } from "react";
import { calcYDP, calcMortgagePayment, calcMPS } from "../../lib/metrics";

interface SnapshotProps {
  startYear: number;
  endYear: number;
  selectedCountryName: string;
  housePrice: number;
  income: number;
  pti: number;
  // mps prop removed; calculated internally
  insightSummary: string[];
  currency: string;

  // New props for MPS calculation
  mortgageRate: number;
  term: number;

  // Shared slider props
  downPaymentPct: number;
  savingsRate: number;
  setDownPaymentPct: (value: number) => void;
  setSavingsRate: (value: number) => void;
}

const ExplanationCard = ({ children }: { children: React.ReactNode }) => (
  <div className="p-4 rounded-lg bg-[--color-card] border border-[--color-border] text-sm text-[--color-text] h-full">
    {children}
  </div>
);

const MetricCard = ({
  label,
  value,
  unit,
}: {
  label: string;
  value: string;
  unit: string;
}) => (
  <div className="p-4 rounded-lg bg-[--color-card] border border-[--color-border] h-full">
    <h3 className="metric-label">{label}</h3>
    <p className="text-xl mt-1">
      <strong>{value}</strong>
    </p>
    <small>{unit}</small>
  </div>
);

export default function Snapshot({
  startYear,
  endYear,
  selectedCountryName,
  housePrice,
  income,
  pti,
  insightSummary,
  currency,
  mortgageRate,
  term,

  downPaymentPct,
  savingsRate,
  setDownPaymentPct,
  setSavingsRate,
}: SnapshotProps) {
  const t = useTranslations("Snapshot");

  const liveLtv = useMemo(() => 100 - downPaymentPct, [downPaymentPct]);

  const liveYdp = useMemo(() => {
    return calcYDP(housePrice, downPaymentPct, income, savingsRate);
  }, [housePrice, downPaymentPct, income, savingsRate]);

  const liveMps = useMemo(() => {
    const monthlyPayment = calcMortgagePayment(
      mortgageRate,
      housePrice,
      liveLtv,
      term,
    );
    return calcMPS(income, monthlyPayment);
  }, [mortgageRate, housePrice, liveLtv, term, income]);

  // Replace static 10% with live values
  const liveExplanation4 = useMemo(() => {
    let text = t.raw("explanation4");

    text = text.replace("10%</strong>", `${downPaymentPct}%</strong>`);
    text = text.replace("10%</strong>", `${savingsRate}%</strong>`);

    return text;
  }, [t, downPaymentPct, savingsRate]);

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-3xl md:text-4xl font-bold text-[--color-title]">
          {t("title", { countryName: selectedCountryName, endYear })}
        </h2>
        <p className="text-sm text-[--color-text] mt-1">
          {t("subtitle", { startYear, endYear })}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Group 1: House Price */}
        <div className="flex flex-col gap-6">
          <MetricCard
            label={t("housePriceLabel")}
            value={
              housePrice > 0
                ? new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: currency,
                    maximumFractionDigits: 0,
                    minimumFractionDigits: 0,
                  }).format(housePrice)
                : "N/A"
            }
            unit={t("housePriceUnit")}
          />
          <ExplanationCard>{t("explanation1")}</ExplanationCard>
        </div>

        {/* Group 2: PTI */}
        <div className="flex flex-col gap-6">
          <MetricCard
            label={t("ptiLabel")}
            value={pti > 0 ? pti.toFixed(1) : "N/A"}
            unit={t("ptiUnit")}
          />
          <ExplanationCard>
            {t.rich("explanation2", {
              pti: pti > 0 ? pti.toFixed(1) : "N/A",
              strong: (chunks) => <strong>{chunks}</strong>,
            })}
          </ExplanationCard>
        </div>

        {/* Group 3: MPS */}
        <div className="flex flex-col gap-6">
          <MetricCard
            label={t("mpsLabel")}
            value={
              liveMps > 0 && isFinite(liveMps) ? `${liveMps.toFixed(1)}%` : "N/A"
            }
            unit={t("mpsUnit")}
          />
          <ExplanationCard>
            {t.rich("explanation3", {
              strong: (chunks) => <strong>{chunks}</strong>,
            })}
          </ExplanationCard>
        </div>

        {/* Group 4: YDP */}
        <div className="flex flex-col gap-6">
          <MetricCard
            label={t("ydpLabel")}
            value={
              liveYdp > 0 && isFinite(liveYdp)
                ? `${liveYdp.toFixed(1)}`
                : "N/A"
            }
            unit={t("ydpUnit")}
          />

          <ExplanationCard>
            <div
              dangerouslySetInnerHTML={{
                __html: liveExplanation4,
              }}
            />

            {/* Down Payment Slider */}
            <div className="mt-4">
              <label className="text-xs flex items-center justify-between">
                <span>{t("ydpSlider_downPayment")}</span>
                <span>{downPaymentPct}%</span>
              </label>
              <input
                type="range"
                min={0}
                max={50}
                value={downPaymentPct}
                onChange={(e) => setDownPaymentPct(Number(e.target.value))}
                className="w-full mt-1"
              />
            </div>

            {/* Savings Rate Slider */}
            <div className="mt-4">
              <label className="text-xs flex items-center justify-between">
                <span>{t("ydpSlider_savingsRate")}</span>
                <span>{savingsRate}%</span>
              </label>
              <input
                type="range"
                min={1}
                max={30}
                value={savingsRate}
                onChange={(e) => setSavingsRate(Number(e.target.value))}
                className="w-full mt-1"
              />
            </div>
          </ExplanationCard>
        </div>
      </div>

      {/* Insights */}
      <div className="mt-6 border border-[--color-border] rounded-lg bg-[--color-card] p-6">
        <h3 className="text-2xl font-semibold text-[--color-label] mb-2">
          {t("insightsTitle")}
        </h3>
        <ul className="list-disc list-inside space-y-2">
          {insightSummary.map((item, index) => (
            <li key={index} className="text-[--color-text]">
              {item.split(/(\*\*.*?\*\*)/g).map((part, i) =>
                part.startsWith("**") ? (
                  <strong key={i}>{part.slice(2, -2)}</strong>
                ) : (
                  part
                ),
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}