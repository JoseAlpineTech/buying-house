import {getRequestConfig} from "next-intl/server";
import {locales} from "./navigation";

export default getRequestConfig(async ({requestLocale}) => {
  const resolvedLocale = (await requestLocale) ?? "en";

  const isSupported = locales.includes(
    resolvedLocale as (typeof locales)[number]
  );

  const locale = isSupported ? resolvedLocale : "en";

  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default
  };
});
