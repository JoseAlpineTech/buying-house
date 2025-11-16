"use client";

import { useTranslations } from "next-intl";

interface SnapshotProps {
  startYear: number;
  endYear: number;
  selectedCountryName: string;
  housePrice: number;
  pti: number;
  mps: number;
  ydp: number;
  monthlyPayment: number;
  insightSummary: string[];
  currency: string;
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
  pti,
  mps,
  ydp,
  insightSummary,
  currency,
}: SnapshotProps) {
  const t = useTranslations("Snapshot");

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
            value={mps > 0 && isFinite(mps) ? `${mps.toFixed(1)}%` : "N/A"}
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
            value={ydp > 0 && isFinite(ydp) ? `${ydp.toFixed(1)}` : "N/A"}
            unit={t("ydpUnit")}
          />
          <ExplanationCard>
            {t.rich("explanation4", {
              strong: (chunks) => <strong>{chunks}</strong>,
            })}
          </ExplanationCard>
        </div>
      </div>

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