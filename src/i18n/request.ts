import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";

import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;

  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  const [common, home, about, services, contact, privacy] = await Promise.all([
    import(`../../messages/${locale}/common.json`),
    import(`../../messages/${locale}/home.json`),
    import(`../../messages/${locale}/about.json`),
    import(`../../messages/${locale}/services.json`),
    import(`../../messages/${locale}/contact.json`),
    import(`../../messages/${locale}/privacy.json`),
  ]);

  return {
    locale,
    messages: {
      common: common.default,
      home: home.default,
      about: about.default,
      services: services.default,
      contact: contact.default,
      privacy: privacy.default,
    },
  };
});
