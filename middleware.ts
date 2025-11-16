import createMiddleware from "next-intl/middleware";
import { locales, localePrefix } from "./navigation";

export default createMiddleware({
  defaultLocale: "en",
  locales,
  localePrefix: "as-needed"
});

export const config = {
  matcher: ["/((?!_next|api|.*\\..*).*)"]
};
