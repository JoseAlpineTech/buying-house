"use client";

export function MethodologyModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[--color-bg]/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl rounded-xl border border-[--color-border] bg-[--color-card] p-8 shadow-lg text-[--color-text] max-h-[90vh] overflow-y-auto"
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
          Methodology & Data Sources
        </h2>
        <div className="space-y-4">
          <section>
            <h3 className="text-lg font-semibold text-[--color-label] mb-2">
              Data Source & Philosophy
            </h3>
            <p>
              All core data is sourced from the{" "}
              <a
                href="https://data.oecd.org"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-[--color-accent]"
              >
                OECD database
              </a>
              . To ensure a consistent and meaningful comparison over time, this
              entire analysis is based on **real (inflation-adjusted)** data.
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>
                <strong>Real House Price Index:</strong> Tracks house prices
                after removing the effect of general inflation (2015=100).
              </li>
              <li>
                <strong>Real Household Income:</strong> Disposable income per
                household, adjusted for inflation.
              </li>
              <li>
                <strong>Mortgage Rate:</strong> Representative long-term mortgage
                interest rates (nominal).
              </li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-[--color-label] mb-2">
              Core Calculated Metrics
            </h3>
            <p>
              The snapshot figures are derived from the source data to create a
              standardized view of affordability in real terms.
            </p>
            <div className="mt-2 space-y-3 p-4 border border-[--color-border] rounded-lg bg-[--color-bg]">
              <div>
                <h4 className="font-semibold text-[--color-label]">
                  Estimated Real House Price
                </h4>
                <p className="text-sm">
                  <code>
                    (Base Price 2015) &times; (Real Index for Year &divide; Real
                    Index for 2015)
                  </code>
                  <br />
                  This converts the price index into an estimated,
                  inflation-adjusted monetary value. A representative base price
                  for 2015 is used as a consistent anchor for each country.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-[--color-label]">
                  Real Price-to-Income Ratio
                </h4>
                <p className="text-sm">
                  <code>
                    Est. Real House Price &divide; Real Annual Income
                  </code>
                  <br />
                  Measures how many years of real income it would take to buy an
                  average home. This is the core affordability metric.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-[--color-label]">
                  Mortgage Burden (%)
                </h4>
                <p className="text-sm">
                  <code>
                    (Monthly Payment &divide; (Real Annual Income &divide; 12))
                    &times; 100
                  </code>
                  <br />
                  Shows the percentage of real monthly income required to cover
                  the mortgage on the estimated real house price.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-[--color-label] mb-2">
              Limitations
            </h3>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>National Averages:</strong> The data reflects a national
                average and does not account for significant variations in
                regional or local housing markets.
              </li>
              <li>
                <strong>Simplified Costs:</strong> Calculations do not include
                property taxes, insurance, maintenance, or other costs of
                homeownership.
              </li>
              <li>
                <strong>Interest Rate Type:</strong> The mortgage rate used is
                nominal, as this reflects the rate available in the market. This
                is the one component not adjusted for inflation, as it's the
                actual rate borrowers face.
              </li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}