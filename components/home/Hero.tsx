"use client";

import { useTranslations } from "next-intl";

export default function Hero() {
  const t = useTranslations("Hero");
  return (
    <header className="text-center mb-8 md:mb-16">
      <h1 className="font-bold text-5xl md:text-7xl text-[--color-title]">
        {t("title")}
      </h1>
      <p className="mt-6 text-[--color-label] text-lg md:text-xl max-w-3xl mx-auto">
        {t.rich("subtitle", {
          strong: (chunks) => <strong>{chunks}</strong>,
        })}
      </p>
    </header>
  );
}