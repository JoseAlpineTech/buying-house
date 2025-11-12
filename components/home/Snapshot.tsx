"use client";

interface SnapshotProps {
  endYear: number;
  selectedCountryName: string;
  housePrice: number;
  pti: number;
  mps: number;
  ydp: number;
  monthlyPayment: number;
  insightSummary: string[];
}

export default function Snapshot({
  endYear,
  selectedCountryName,
  housePrice,
  pti,
  mps,
  ydp,
  insightSummary,
}: SnapshotProps) {
  return (
    <section className="rounded-xl border border-[--color-border] bg-[--color-card] p-8 mt-12 min-h-[280px]">
      <h2 className="text-4xl font-bold text-[--color-title] mb-6">
        Snapshot for {selectedCountryName} in {endYear} (Real Terms)
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Representative House Price */}
        <div>
          <h3 className="metric-label">Est. Real House Price</h3>
          <p className="text-[--color-label] text-xl mt-1">
            {housePrice > 0
              ? new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                  maximumFractionDigits: 0,
                  minimumFractionDigits: 0,
                }).format(housePrice)
              : "N/A"}
          </p>
          <small>In local currency, inflation-adjusted.</small>
        </div>

        {/* Price-to-Income Ratio */}
        <div>
          <h3 className="metric-label">Real Price-to-Income</h3>
          <p className="text-[--color-label] text-xl mt-1">
            {pti > 0 ? pti.toFixed(1) : "N/A"}
          </p>
          <small>Years of income to buy a home.</small>
        </div>

        {/* Mortgage Burden */}
        <div>
          <h3 className="metric-label">Mortgage Burden</h3>
          <p className="text-[--color-label] text-xl mt-1">
            {mps > 0 && isFinite(mps) ? `${mps.toFixed(1)}%` : "N/A"}
          </p>
          <small>% of real income for mortgage.</small>
        </div>

        {/* Years to Save */}
        <div>
          <h3 className="metric-label">Years to Down Payment</h3>
          <p className="text-[--color-label] text-xl mt-1">
            {ydp > 0 && isFinite(ydp) ? `${ydp.toFixed(1)}` : "N/A"}
          </p>
          <small>Based on selected scenario.</small>
        </div>
      </div>

      <div className="mt-6 border border-[--color-border] rounded-lg bg-[--color-bg] p-6">
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
    </section>
  );
}