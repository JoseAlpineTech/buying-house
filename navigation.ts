import { createNavigation } from "next-intl/navigation";

export const locales = [
  "en",
  "es",
  "fr",
  "de",
  "it",
  "ja",
  "pt",
  "ko",
] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";
export const localePrefix = "as-needed";

export const { Link, redirect, usePathname, useRouter } = createNavigation({
  locales,
  defaultLocale,
  localePrefix,
});