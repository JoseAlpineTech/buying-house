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
  <div className="p-4 rounded-lg bg-[#061522] border border-[--color-border] text-sm text-[--color-text] h-full">
    {children}
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
        <h2 className="text-4xl font-bold text-[--color-title]">
          {t("title", { countryName: selectedCountryName, endYear })}
        </h2>
        <p className="text-sm text-[--color-text] mt-1">
          {t("subtitle", { startYear, endYear })}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Metric Row */}
        <div className="p-4 rounded-lg bg-[#061522] border border-[--color-border]">
          <h3 className="metric-label">{t("housePriceLabel")}</h3>
          <p className="text-xl mt-1">
            <strong>
              {housePrice > 0
                ? new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: currency,
                    maximumFractionDigits: 0,
                    minimumFractionDigits: 0,
                  }).format(housePrice)
                : "N/A"}
            </strong>
          </p>
          <small>{t("housePriceUnit")}</small>
        </div>
        <div className="p-4 rounded-lg bg-[#061522] border border-[--color-border]">
          <h3 className="metric-label">{t("ptiLabel")}</h3>
          <p className="text-xl mt-1">
            <strong>{pti > 0 ? pti.toFixed(1) : "N/A"}</strong>
          </p>
          <small>{t("ptiUnit")}</small>
        </div>
        <div className="p-4 rounded-lg bg-[#061522] border border-[--color-border]">
          <h3 className="metric-label">{t("mpsLabel")}</h3>
          <p className="text-xl mt-1">
            <strong>
              {mps > 0 && isFinite(mps) ? `${mps.toFixed(1)}%` : "N/A"}
            </strong>
          </p>
          <small>{t("mpsUnit")}</small>
        </div>
        <div className="p-4 rounded-lg bg-[#061522] border border-[--color-border]">
          <h3 className="metric-label">{t("ydpLabel")}</h3>
          <p className="text-xl mt-1">
            <strong>
              {ydp > 0 && isFinite(ydp) ? `${ydp.toFixed(1)}` : "N/A"}
            </strong>
          </p>
          <small>{t("ydpUnit")}</small>
        </div>

        {/* Explanation Row */}
        <ExplanationCard>{t("explanation1")}</ExplanationCard>
        <ExplanationCard>
          {t.rich("explanation2", {
            pti: pti > 0 ? pti.toFixed(1) : "N/A",
            strong: (chunks) => <strong>{chunks}</strong>,
          })}
        </ExplanationCard>
        <ExplanationCard>
          {t.rich("explanation3", {
            strong: (chunks) => <strong>{chunks}</strong>,
          })}
        </ExplanationCard>
        <ExplanationCard>
          {t.rich("explanation4", {
            strong: (chunks) => <strong>{chunks}</strong>,
          })}
        </ExplanationCard>
      </div>

      <div className="mt-6 border border-[--color-border] rounded-lg bg-[#061522] p-6">
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