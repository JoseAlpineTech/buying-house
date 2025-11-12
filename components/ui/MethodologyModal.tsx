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
              . The analysis is based on a consistent set of{" "}
              <strong>real (inflation-adjusted)</strong> metrics to provide a
              meaningful comparison over time. The specific datasets and series
              used are detailed below.
            </p>
            <div className="mt-4 space-y-1 p-4 border border-[--color-border] rounded-lg bg-[--color-bg]">
              {/* Table Header */}
              <div className="grid grid-cols-3 gap-4 text-sm font-semibold text-[--color-label] pb-2">
                <div>Dataset Name</div>
                <div>Series Used</div>
                <div>Data as of</div>
              </div>

              {/* Row 1: Housing */}
              <div className="grid grid-cols-3 gap-4 text-sm border-t border-[--color-border] pt-3">
                <div className="font-medium">
                  Analytical house prices indicators
                </div>
                <div>
                  <ul className="list-disc list-inside">
                    <li>Real house price index</li>
                    <li>Nominal rent price index</li>
                  </ul>
                </div>
                <div>November 10, 2025</div>
              </div>

              {/* Row 2: Income */}
              <div className="grid grid-cols-3 gap-4 text-sm border-t border-[--color-border] pt-3">
                <div className="font-medium">NAAG Chapter 5: Households</div>
                <div>Real net disposable income</div>
                <div>November 10, 2025</div>
              </div>

              {/* Row 3: Interest Rates */}
              <div className="grid grid-cols-3 gap-4 text-sm border-t border-[--color-border] pt-3">
                <div className="font-medium">Financial market</div>
                <div>Long-term interest rates</div>
                <div>November 07, 2025</div>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-[--color-label] mb-2">
              Calculated Metrics & Assumptions
            </h3>
            <p>
              The application calculates key affordability metrics based on the
              source data. This requires an assumption for a base house price to
              anchor the index data to a real-world value.
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
                  The "Base Price 2015" is a representative estimate for a
                  typical home, grounded in sources like national statistical
                  offices (e.g., FRED, ONS) and economic reports from that
                  period. This value gives scale to the trend provided by the
                  OECD index.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}