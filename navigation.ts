import { createNavigation, Pathnames } from "next-intl/navigation";

export const locales = ["en", "es"] as const;
export const localePrefix = "always"; // Default

// The `pathnames` object holds pairs of page paths and their translations.
// We don't have any translated paths yet, so this is just an empty object.
export const pathnames: Pathnames<typeof locales> = {};

export const { Link, redirect, usePathname, useRouter } = createNavigation({
  locales,
  localePrefix,
  pathnames,
});