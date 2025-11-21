"use client";

import { useTranslations } from "next-intl";

export function MethodologyModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const t = useTranslations("MethodologyModal");

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      {/* Backdrop layer */}
      <div className="absolute inset-0 bg-[--color-bg]/80 backdrop-blur-sm" />

      {/* Modal panel */}
      <div
        style={{
          backgroundColor: "var(--color-card)",
          backdropFilter: "none",
        }}
        className="relative w-full max-w-3xl rounded-xl border border-[--color-border] p-8 shadow-lg text-[--color-text] max-h-[90vh] overflow-y-auto"
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
          {t("title")}
        </h2>

        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-[--color-label] mb-2">
              {t("primarySources.title")}
            </h3>
            <p>
              {t.rich("primarySources.p1", {
                link: (chunks) => (
                  <a
                    href="https://data.oecd.org"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 underline hover:text-[--color-accent]"
                  >
                    {chunks}
                  </a>
                ),
              })}
            </p>
            <div className="mt-4 space-y-3 p-4 border border-[--color-border] rounded-lg">
              <div>
                <h4 className="font-semibold text-[--color-title]">
                  {t("primarySources.housePrices.title")}
                </h4>
                <p className="text-sm">
                  {t("primarySources.housePrices.description")}
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-[--color-title]">
                  {t("primarySources.income.title")}
                </h4>
                <p className="text-sm">
                  {t("primarySources.income.description")}
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-[--color-title]">
                  {t("primarySources.financial.title")}
                </h4>
                <p className="text-sm">
                  {t("primarySources.financial.description")}
                </p>
              </div>

              {/* Country Specific Sources - No borders, matching list style */}
              <div>
                <h4 className="font-semibold text-[--color-title]">
                  {t("primarySources.banxico.title")}
                </h4>
                <p className="text-sm">
                  {t.rich("primarySources.banxico.description", {
                    link: (chunks) => (
                      <a
                        href="https://www.banxico.org.mx/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 underline hover:text-[--color-accent]"
                      >
                        {chunks}
                      </a>
                    ),
                  })}
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-[--color-title]">
                  {t("primarySources.abs.title")}
                </h4>
                <p className="text-sm">
                  {t.rich("primarySources.abs.description", {
                    link: (chunks) => (
                      <a
                        href="https://www.abs.gov.au/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 underline hover:text-[--color-accent]"
                      >
                        {chunks}
                      </a>
                    ),
                  })}
                </p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-[--color-label] mb-2">
              {t("seriesExplained.title")}
            </h3>
            <p
              dangerouslySetInnerHTML={{
                __html: t.raw("seriesExplained.p1"),
              }}
            />
            <div className="mt-2 space-y-4 p-4 border border-[--color-border] rounded-lg">
              <div>
                <h4 className="font-semibold text-[--color-label]">
                  {t("seriesExplained.realIncome.title")}
                </h4>
                <p className="text-sm">
                  {t("seriesExplained.realIncome.description")}
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-[--color-label]">
                  {t("seriesExplained.realHousePrice.title")}
                </h4>
                {/* Using dangerouslySetInnerHTML to correctly render &times; and &divide; entities */}
                <p
                  className="text-sm"
                  dangerouslySetInnerHTML={{
                    __html: t.raw("seriesExplained.realHousePrice.description"),
                  }}
                />
              </div>
              <div>
                <h4 className="font-semibold text-[--color-label]">
                  {t("seriesExplained.mortgageRate.title")}
                </h4>
                <p className="text-sm">
                  {t("seriesExplained.mortgageRate.description")}
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-[--color-label]">
                  {t("seriesExplained.rentToPrice.title")}
                </h4>
                <p className="text-sm">
                  {t("seriesExplained.rentToPrice.description")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}