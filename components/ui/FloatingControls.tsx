"use client";

import { useState } from "react";
import { countryCodeMap } from "../../data/countryCodes";

export default function FloatingControls({
  children,
  selectedCountry,
}: {
  children: React.ReactNode[];
  selectedCountry: string;
}) {
  const [open, setOpen] = useState(true);

  // Map 3-letter to 2-letter ISO for the flag icon
  const twoLetterCode = countryCodeMap[selectedCountry] ?? "";

  return (
    <div className="hidden md:block fixed top-5 right-6 z-50 pointer-events-auto">
      <div className="flex flex-col items-end gap-3">
        {/* Toggle button */}
        <button
          onClick={() => setOpen(!open)}
          className="p-1 px-2 rounded-lg bg-[--color-card] border border-[--color-border] shadow-xl hover:bg-[--color-border] transition-colors"
          title={open ? "Hide menu" : "Show menu"}
        >
          <span
            className={`fi fi-${twoLetterCode} w-6 h-4 rounded-sm`}
          />
        </button>

        {open && (
          <div
            style={{
              backgroundColor: "var(--color-card)",
              backdropFilter: "none",
            }}
            className="rounded-lg border border-[--color-border] shadow-xl"
          >
            <div className="flex flex-col items-end gap-4 p-4">
              {/* Country */}
              <div>{children[0]}</div>

              {/* Language + Theme */}
              <div className="flex flex-row gap-3">
                {children[1]}
                {children[2]}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}