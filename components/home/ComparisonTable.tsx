"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { countryCodeMap } from "../../data/countryCodes";

export interface ComparisonData {
  countryCode: string;
  countryName: string;
  pti: number | null;
  mps: number | null;
  ydp: number | null;
  year: number;
}

export type SortKey = "countryName" | "pti" | "mps" | "ydp";
export type SortDirection = "ascending" | "descending";

interface ComparisonTableProps {
  data: ComparisonData[];
  selectedCountryCode: string;
  sortConfig: { key: SortKey; direction: SortDirection } | null;
  setSortConfig: (
    config: { key: SortKey; direction: SortDirection } | null
  ) => void;

  // NEW shared slider props
  downPaymentPct: number;
  savingsRate: number;
  setDownPaymentPct: (value: number) => void;
  setSavingsRate: (value: number) => void;
}

const SortIcon = ({ direction }: { direction: SortDirection | null }) => {
  if (!direction)
    return <span className="text-[--color-text] opacity-50">↕</span>;
  return direction === "ascending" ? (
    <span className="text-[--color-accent]">▲</span>
  ) : (
    <span className="text-[--color-accent]">▼</span>
  );
};

export default function ComparisonTable({
  data,
  selectedCountryCode,
  sortConfig,
  setSortConfig,

  downPaymentPct,
  savingsRate,
  setDownPaymentPct,
  setSavingsRate,
}: ComparisonTableProps) {
  const t = useTranslations("ComparisonTable");
  const [yearMode, setYearMode] = useState<"latest" | "common">("latest");

  const commonYear = useMemo(() => {
    const years = data
      .map((d) => d.year)
      .filter((y) => typeof y === "number" && !Number.isNaN(y));
    if (!years.length) return null;

    const yearCounts = years.reduce(
      (acc, y) => {
        acc[y] = (acc[y] || 0) + 1;
        return acc;
      },
      {} as Record<number, number>
    );

    return Object.keys(yearCounts)
      .map(Number)
      .reduce((a, b) => (yearCounts[a] > yearCounts[b] ? a : b));
  }, [data]);

  const alignedData = useMemo(() => {
    if (yearMode === "latest" || commonYear === null) return data;
    return data.filter((d) => d.year === commonYear);
  }, [data, yearMode, commonYear]);

  const sortedData = useMemo(() => {
    const rows = [...alignedData];
    if (sortConfig !== null) {
      rows.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (aValue === null) return 1;
        if (bValue === null) return -1;

        if (aValue < bValue) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }
    return rows;
  }, [alignedData, sortConfig]);

  const requestSort = (key: SortKey) => {
    let direction: SortDirection = "ascending";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "ascending"
    ) {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const headers: {
    key: SortKey | "rank" | "year";
    label: string;
    isSortable: boolean;
  }[] = [
    { key: "rank", label: t("headers.rank"), isSortable: false },
    { key: "countryName", label: t("headers.country"), isSortable: true },
    ...(yearMode === "latest"
      ? [
          {
            key: "year",
            label: t("headers.year"),
            isSortable: false,
          } as const,
        ]
      : []),
    { key: "pti", label: t("headers.pti"), isSortable: true },
    { key: "mps", label: t("headers.mps"), isSortable: true },
    { key: "ydp", label: t("headers.ydp"), isSortable: true },
  ];

  return (
    <div className="overflow-x-auto">

      {/* ====================== */}
      {/*  Shared Slider Controls */}
      {/* ====================== */}

      <div className="flex flex-row gap-4 mb-6 w-full">

        <div className="w-full">
          <label className="text-xs flex items-center justify-between mb-1">
            <span>{t("ydpSlider_downPayment")}</span>
            <span>{downPaymentPct}%</span>
          </label>
          <input
            type="range"
            min={0}
            max={50}
            value={downPaymentPct}
            onChange={(e) => setDownPaymentPct(Number(e.target.value))}
            className="w-full"
          />
        </div>

        <div className="w-full">
          <label className="text-xs flex items-center justify-between mb-1">
            <span>{t("ydpSlider_savingsRate")}</span>
            <span>{savingsRate}%</span>
          </label>
          <input
            type="range"
            min={1}
            max={30}
            value={savingsRate}
            onChange={(e) => setSavingsRate(Number(e.target.value))}
            className="w-full"
          />
        </div>

      </div>

      {/* ================== */}
      {/*  Year Alignment UI */}
      {/* ================== */}

      <div className="flex gap-4 items-center mb-4">
        <span className="text-[--color-label] text-sm">
          {t("alignToggle.label")}:
        </span>
        <button
          onClick={() => setYearMode("latest")}
          className={`px-3 py-1 rounded-md text-sm border ${
            yearMode === "latest"
              ? "bg-[--color-accent] border-[--color-accent] text-[--color-bg] font-semibold"
              : "border-[--color-border] text-[--color-text]"
          }`}
        >
          {t("alignToggle.latest")}
        </button>
        <button
          onClick={() => setYearMode("common")}
          className={`px-3 py-1 rounded-md text-sm border ${
            yearMode === "common"
              ? "bg-[--color-accent] border-[--color-accent] text-[--color-bg] font-semibold"
              : "border-[--color-border] text-[--color-text]"
          }`}
          disabled={commonYear === null}
        >
          {t("alignToggle.common")}
          {commonYear !== null && ` (${commonYear})`}
        </button>
      </div>

      {/* ========= */}
      {/*  TABLE    */}
      {/* ========= */}

      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-[--color-border]">
            {headers.map(({ key, label, isSortable }) => (
              <th
                key={key}
                className="py-3 px-2 md:px-4 text-sm font-semibold text-[--color-label] uppercase tracking-wider"
                onClick={() => isSortable && requestSort(key as SortKey)}
                style={{ cursor: isSortable ? "pointer" : "default" }}
              >
                <div className="flex items-center gap-2">
                  {label}
                  {isSortable && (
                    <SortIcon
                      direction={
                        sortConfig?.key === key ? sortConfig.direction : null
                      }
                    />
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {sortedData.map((item, index) => (
            <motion.tr
              key={item.countryCode}
              className={`transition-all duration-300 border-l-4 ${
                item.countryCode === selectedCountryCode
                  ? "bg-[--color-accent]/10 border-l-[--color-accent] shadow-[0_0_15px_-5px_var(--color-accent)]"
                  : "border-l-transparent hover:bg-[--color-border]/20"
              }`}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <td className="py-2 px-2 md:px-4 text-[--color-label]">
                {index + 1}
              </td>

              <td className="py-2 px-2 md:px-4 whitespace-nowrap">
                <div className="flex items-center gap-3">
                  <span
                    className={`fi fi-${
                      countryCodeMap[item.countryCode] ?? ""
                    } w-6 h-4 rounded-sm`}
                  />
                  <span className="font-semibold text-[--color-title]">
                    {item.countryName}
                  </span>
                </div>
              </td>

              {yearMode === "latest" && (
                <td className="py-2 px-2 md:px-4 text-[--color-label]">
                  {typeof item.year === "number" && !Number.isNaN(item.year)
                    ? item.year
                    : "—"}
                </td>
              )}

              {/* PTI */}
              <td className="py-2 px-2 md:px-4">
                {item.pti !== null ? item.pti.toFixed(1) : "N/A"}
              </td>

              {/* MPS */}
              <td className="py-2 px-2 md:px-4">
                {item.mps !== null && isFinite(item.mps)
                  ? item.mps.toFixed(1)
                  : "N/A"}
              </td>

              {/* YDP (based on shared sliders) */}
              <td className="py-2 px-2 md:px-4">
                {item.ydp !== null && isFinite(item.ydp)
                  ? item.ydp.toFixed(1)
                  : "N/A"}
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}