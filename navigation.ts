import { createNavigation } from "next-intl/navigation";

export const locales = ["en", "es"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";
export const localePrefix = "as-needed";

export const pathnames = {};

export const { Link, redirect, usePathname, useRouter } = createNavigation({
  locales,
  defaultLocale,
  localePrefix,
  pathnames,
});
