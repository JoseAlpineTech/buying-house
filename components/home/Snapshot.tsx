"use client";

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
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-4xl font-bold text-[--color-title]">
          Snapshot for {selectedCountryName} in {endYear}
        </h2>
        <p className="text-sm text-[--color-text] mt-1">
          Based on available data from {startYear} to {endYear}.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Representative House Price */}
        <div className="p-4 rounded-lg bg-[#061522] border border-[--color-border]">
          <h3 className="metric-label">Est. Real House Price</h3>
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
          <small>In local currency, inflation-adjusted.</small>
        </div>

        {/* Price-to-Income Ratio */}
        <div className="p-4 rounded-lg bg-[#061522] border border-[--color-border]">
          <h3 className="metric-label">Real Price-to-Income</h3>
          <p className="text-xl mt-1">
            <strong>{pti > 0 ? pti.toFixed(1) : "N/A"}</strong>
          </p>
          <small>Years of income to buy a home.</small>
        </div>

        {/* Mortgage Burden */}
        <div className="p-4 rounded-lg bg-[#061522] border border-[--color-border]">
          <h3 className="metric-label">Mortgage Burden</h3>
          <p className="text-xl mt-1">
            <strong>
              {mps > 0 && isFinite(mps) ? `${mps.toFixed(1)}%` : "N/A"}
            </strong>
          </p>
          <small>% of real income for mortgage.</small>
        </div>

        {/* Years to Save */}
        <div className="p-4 rounded-lg bg-[#061522] border border-[--color-border]">
          <h3 className="metric-label">Years to Down Payment</h3>
          <p className="text-xl mt-1">
            <strong>
              {ydp > 0 && isFinite(ydp) ? `${ydp.toFixed(1)}` : "N/A"}
            </strong>
          </p>
          <small>For an average homebuyer profile.</small>
        </div>
      </div>

      <div className="mt-6 border border-[--color-border] rounded-lg bg-[#061522] p-6">
        <h3 className="text-2xl font-semibold text-[--color-label] mb-2">
          Insight Summary
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