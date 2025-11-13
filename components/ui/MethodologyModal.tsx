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
        className="relative w-full max-w-3xl rounded-xl border border-[--color-border] bg-[#0d2538] p-8 shadow-lg text-[--color-text] max-h-[90vh] overflow-y-auto"
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
              Primary Data Sources
            </h3>
            <p>
              All core time-series data is sourced from the{" "}
              <a
                href="https://data.oecd.org"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 underline hover:text-[--color-accent]"
              >
                OECD Data Explorer
              </a>
              . The analysis relies on combining several key indicators to
              construct a consistent, inflation-adjusted view of affordability.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-[--color-label] mb-2">
              Data Series Explained
            </h3>
            <p>
              The application calculates key affordability metrics by combining
              these sources. All metrics are presented in{" "}
              <strong>real (inflation-adjusted)</strong> terms using 2015 as
              the baseline year.
            </p>
            <div className="mt-2 space-y-4 p-4 border border-[--color-border] rounded-lg bg-[#061522]">
              <div>
                <h4 className="font-semibold text-[--color-label]">
                  Real Median Income (Equivalised)
                </h4>
                <p className="text-sm">
                  This series uses "Equivalised Household Disposable Income." It
                  adjusts total household income by the number of people in the
                  household to better represent the economic resources available
                  to each member. While the resulting number may appear lower
                  than raw household income, it provides a more accurate
                  comparison of living standards between countries with
                  different average household sizes. The nominal income is then
                  adjusted for inflation using the CPI.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-[--color-label]">
                  Estimated Real House Price
                </h4>
                <p className="text-sm">
                  This value is calculated from the OECD's Real House Price
                  Index, which is anchored to a representative base price for a
                  typical home in 2015. The formula is:{" "}
                  <code>
                    (Base Price 2015) &times; (Index for Year &divide; Index for
                    2015)
                  </code>
                  . This converts the index into an estimated monetary value
                  while maintaining the integrity of the inflation-adjusted
                  trend.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-[--color-label]">
                  Mortgage Rate Proxy (Long-Term Interest Rate)
                </h4>
                <p className="text-sm">
                  To ensure consistency across countries, the app uses the
                  long-term government bond yield (typically 10-year bonds) as
                  a proxy for mortgage rates. This is a standard macroeconomic
                  indicator that moves in close harmony with consumer mortgage
                  rates and accurately reflects changes in borrowing costs over
                  time.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-[--color-label]">
                  Rent-to-Price Index
                </h4>
                <p className="text-sm">
                  This index measures the relative cost of buying a home versus
                  renting one. A higher value suggests that house prices are
                  high relative to rental costs, potentially indicating lower
                  profitability for landlords or that it is more financially
-advantageous to rent.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}