"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { countryCodeMap } from "../../data/countryCodes";

export interface ComparisonData {
  countryCode: string;
  countryName: string;
  pti: number | null;
  mps: number | null;
  ydp: number | null;
}

export type SortKey = "countryName" | "pti" | "mps" | "ydp";
export type SortDirection = "ascending" | "descending";

interface ComparisonTableProps {
  data: ComparisonData[];
  selectedCountryCode: string;
  sortConfig: { key: SortKey; direction: SortDirection } | null;
  setSortConfig: (
    config: { key: SortKey; direction: SortDirection } | null,
  ) => void;
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
}: ComparisonTableProps) {
  const sortedData = useMemo(() => {
    let sortableItems = [...data];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
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
    return sortableItems;
  }, [data, sortConfig]);

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
    key: SortKey | "rank";
    label: string;
    isSortable: boolean;
  }[] = [
    { key: "rank", label: "#", isSortable: false },
    { key: "countryName", label: "Country", isSortable: true },
    { key: "pti", label: "Price-to-Income", isSortable: true },
    { key: "mps", label: "Mortgage Burden (%)", isSortable: true },
    { key: "ydp", label: "Years to Save", isSortable: true },
  ];

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-[--color-border]">
            {headers.map(({ key, label, isSortable }) => (
              <th
                key={key}
                className="py-3 px-4 text-sm font-semibold text-[--color-label] uppercase tracking-wider"
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
              layout
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <td className="py-2 px-4 text-[--color-label]">
                {index + 1}
              </td>
              <td className="py-2 px-4 whitespace-nowrap">
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
              <td className="py-2 px-4">
                {item.pti !== null ? item.pti.toFixed(1) : "N/A"}
              </td>
              <td className="py-2 px-4">
                {item.mps !== null && isFinite(item.mps)
                  ? item.mps.toFixed(1)
                  : "N/A"}
              </td>
              <td className="py-2 px-4">
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