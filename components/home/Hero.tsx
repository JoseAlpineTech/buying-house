"use client";

import { useTranslations } from "next-intl";

interface HeroProps {
  startYear?: number;
}

export default function Hero() {
  const t = useTranslations("Hero");
  return (
    <header className="text-center mb-16">
      <h1 className="font-bold text-7xl text-[--color-title]">{t("title")}</h1>
      <p className="mt-6 text-[--color-label] text-xl max-w-3xl mx-auto">
        {t("subtitle")}
      </p>
    </header>
  );
}