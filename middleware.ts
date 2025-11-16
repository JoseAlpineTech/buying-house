import createMiddleware from "next-intl/middleware";
import { locales, defaultLocale, localePrefix } from "./navigation";

export default createMiddleware({
  locales,
  defaultLocale,
  localePrefix,
});

export const config = {
  // Match all pathnames except:
  // - /api, /trpc
  // - /_next, /_vercel
  // - anything containing a dot (files)
  matcher: ["/((?!api|trpc|_next|_vercel|.*\\..*).*)"],
};
