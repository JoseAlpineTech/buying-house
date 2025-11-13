"use client";

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
  if (!isOpen) return null;

  const assumptions: AssumptionData[] = [
    {
      label: "Base House Price (2015)",
      value: baseHousePrice
        ? formatNumber(baseHousePrice.price, {
            style: "currency",
            currency: currency,
            maximumFractionDigits: 0,
          })
        : "N/A",
      description: `Anchor price in local currency used to convert the index. Source: ${
        baseHousePrice?.source ?? "N/A"
      }`,
    },
    {
      label: "Latest Mortgage Rate",
      value: `${formatNumber(latestMortgageRate, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}%`,
      description: `The most recent long-term interest rate used for all mortgage burden calculations across time.`,
    },
    {
      label: "Data Time Range",
      value: `${dataStartYear} - ${dataEndYear}`,
      description:
        "The start and end years for the continuous, interpolated data series.",
    },
    {
      label: "Real Equivalised Income Range",
      value: `${formatNumber(startIncome ?? 0, {
        style: "currency",
        currency: currency,
        maximumFractionDigits: 0,
      })} -> ${formatNumber(endIncome ?? 0, {
        style: "currency",
        currency: currency,
        maximumFractionDigits: 0,
      })}`,
      description:
        "This represents 'Equivalised Household Disposable Income,' adjusted for inflation. It modifies total household income by household size to better compare living standards across countries. This may appear lower than raw household income but is a more accurate measure for comparison.",
    },
    {
      label: "Real House Price Index Range",
      value: `${formatNumber(startIndexValue ?? 0, {
        minimumFractionDigits: 2,
      })} -> ${formatNumber(endIndexValue ?? 0, {
        minimumFractionDigits: 2,
      })}`,
      description: `The 2015-based index value change from ${dataStartYear} to ${dataEndYear}.`,
    },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[--color-bg]/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl rounded-xl border border-[--color-border] bg-[#0d2538] p-8 shadow-lg text-[--color-text] max-h-[90vh] overflow-y-auto"
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
          Key Assumptions for {countryName}
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
              <div className="font-mono text-lg text-[--color-title] md:col-span-2">
                {item.value}
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