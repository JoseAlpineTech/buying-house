"use client";

import { useState } from "react";

export default function FloatingControls({
  children,
}: {
  children: React.ReactNode[];
}) {
  const [open, setOpen] = useState(true);

  return (
    <div className="fixed top-5 right-6 z-50 pointer-events-auto">
      <div className="flex flex-col items-end gap-3">
        {/* Toggle button */}
        <button
          onClick={() => setOpen(!open)}
          className="p-1 px-2 rounded-lg bg-[--color-card] border border-[--color-border] shadow-xl hover:bg-[--color-border] transition-colors text-[--color-title]"
          title={open ? "Hide menu" : "Show menu"}
        >
          {open ? "⮜" : "⮞"}
        </button>

        {open && (
          <div className="rounded-lg bg-[--color-bg] border border-[--color-border] shadow-xl">
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
