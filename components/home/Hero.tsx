"use client";

interface HeroProps {
  startYear?: number;
}

export default function Hero() {
  return (
    <header className="text-center mb-16">
      <h1 className="font-bold text-7xl text-[--color-title]">
        Housing Affordability
      </h1>
      <p className="mt-6 text-[--color-label] text-xl max-w-3xl mx-auto">
        How has the ability to buy a home changed over time? Explore
        inflation-adjusted prices, incomes, and mortgage costs across OECD
        countries.
      </p>
    </header>
  );
}