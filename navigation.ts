import { createNavigation } from "next-intl/navigation";

export const locales = ["en", "es"] as const;
export const localePrefix = "as-needed";

// The `pathnames` object holds pairs of page paths and their translations.
// We don't have any translated paths yet, so this is just an empty object.
export const pathnames = {};

export const { Link, redirect, usePathname, useRouter } = createNavigation({
  locales,
  localePrefix,
  pathnames,
});