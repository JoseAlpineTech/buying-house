"use client";

interface HeroProps {
  startYear?: number;
}

export default function Hero({ startYear }: HeroProps) {
  const comparisonText = startYear ? ` ${startYear}` : "the past";

  return (
    <header className="text-center mb-16">
      <h1 className="font-bold text-7xl text-[--color-title]">
        Housing Affordability
      </h1>
      <p className="mt-6 text-[--color-label] text-xl max-w-3xl mx-auto">
        How has the ability to buy a home changed since{comparisonText}? Explore
        inflation-adjusted prices, incomes, and mortgage costs across OECD
        countries.
      </p>
    </header>
  );
}