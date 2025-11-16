"use client";

import { useTranslations } from "next-intl";

interface AssumptionData {
  label: string;
  value: string | number;
  description: string;
}

interface AssumptionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  countryName: string;
  baseHousePrice?: { price: number; source: string };
  latestMortgageRate: number;
  dataStartYear: number;
  dataEndYear: number;
  startIncome?: number;
  endIncome?: number;
  startIndexValue?: number;
  endIndexValue?: number;
  currency: string;
}

const formatNumber = (
  value: number,
  options: Intl.NumberFormatOptions = {},
) => {
  if (value === undefined || value === null) return "N/A";
  return new Intl.NumberFormat("en-US", options).format(value);
};

export function AssumptionsModal({
  isOpen,
  onClose,
  countryName,
  baseHousePrice,
  latestMortgageRate,
  dataStartYear,
  dataEndYear,
  startIncome,
  endIncome,
  startIndexValue,
  endIndexValue,
  currency,
}: AssumptionsModalProps) {
  const t = useTranslations("AssumptionsModal");

  if (!isOpen) return null;

  const assumptions: AssumptionData[] = [
    {
      label: t("basePrice.label"),
      value: baseHousePrice
        ? formatNumber(baseHousePrice.price, {
            style: "currency",
            currency: currency,
            maximumFractionDigits: 0,
          })
        : "N/A",
      description: t("basePrice.description", {
        source: baseHousePrice?.source ?? "N/A",
      }),
    },
    {
      label: t("mortgageRate.label"),
      value: `${formatNumber(latestMortgageRate, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}%`,
      description: t("mortgageRate.description"),
    },
    {
      label: t("timeRange.label"),
      value: `${dataStartYear} - ${dataEndYear}`,
      description: t("timeRange.description"),
    },
    {
      label: t("incomeRange.label"),
      value: `${formatNumber(startIncome ?? 0, {
        style: "currency",
        currency: currency,
        maximumFractionDigits: 0,
      })} -> ${formatNumber(endIncome ?? 0, {
        style: "currency",
        currency: currency,
        maximumFractionDigits: 0,
      })}`,
      description: t("incomeRange.description"),
    },
    {
      label: t("indexRange.label"),
      value: `${formatNumber(startIndexValue ?? 0, {
        minimumFractionDigits: 2,
      })} -> ${formatNumber(endIndexValue ?? 0, {
        minimumFractionDigits: 2,
      })}`,
      description: t("indexRange.description", {
        startYear: dataStartYear,
        endYear: dataEndYear,
      }),
    },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-[--color-bg]/80 backdrop-blur-sm" />

      {/* Modal Panel */}
      <div
        style={{
          backgroundColor: "var(--color-card)",
          backdropFilter: "none",
        }}
        className="relative w-full max-w-2xl rounded-xl border border-[--color-border] p-8 shadow-lg text-[--color-text] max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[--color-label] hover:text-[--color-title]"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <h2 className="text-2xl font-semibold text-[--color-title] mb-4">
          {t("title", { countryName })}
        </h2>

        <div className="mt-6 space-y-4">
          {assumptions.map((item, index) => (
            <div
              key={index}
              className="grid grid-cols-1 gap-x-4 gap-y-1 border-b border-[--color-border] p-3 md:grid-cols-3"
            >
              <div className="font-semibold text-[--color-label] md:col-span-1">
                {item.label}
              </div>

              {/* Highlighted figure */}
              <div className="font-mono text-lg md:col-span-2">
                <strong>{item.value}</strong>
              </div>

              <div className="mt-1 text-sm text-[--color-text] md:col-span-3 md:pl-0">
                {item.description}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
