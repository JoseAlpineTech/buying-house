"use client";

interface FooterProps {
  onMethodologyOpen: () => void;
  onAssumptionsOpen: () => void;
}

export default function Footer({
  onMethodologyOpen,
  onAssumptionsOpen,
}: FooterProps) {
  return (
    <footer className="mt-16 text-center text-sm text-[--color-label] flex justify-center items-center gap-4 flex-wrap">
      <a
        href="https://data.oecd.org"
        target="_blank"
        rel="noopener noreferrer"
        className="underline hover:text-[--color-accent]"
      >
        Source: OECD Data
      </a>
      <span className="text-[--color-border]">|</span>
      <button
        onClick={onMethodologyOpen}
        className="underline hover:text-[--color-accent] bg-transparent border-none p-0"
      >
        Methodology
      </button>
      <span className="text-[--color-border]">|</span>
      <button
        onClick={onAssumptionsOpen}
        className="underline hover:text-[--color-accent] bg-transparent border-none p-0"
      >
        Assumptions
      </button>
      <span className="text-[--color-border]">|</span>
      <a
        href="https://www.alpinetech.ca"
        target="_blank"
        rel="noopener noreferrer"
        className="underline hover:text-[--color-accent]"
      >
        Powered by: Alpine Tech Inc.
      </a>
    </footer>
  );
}