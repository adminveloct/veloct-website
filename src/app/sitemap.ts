import type { MetadataRoute } from "next";

import { PAGES, getSlug } from "@/i18n/pages";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const locales = ["id", "en"] as const;

type Locale = (typeof locales)[number];

export default function sitemap(): MetadataRoute.Sitemap {
  const entries = [
    { key: "home" as const },
    ...PAGES.map((page) => ({ key: page.key })),
  ];

  return entries.flatMap((entry) =>
    locales.map((locale) => {
      const pathFor = (target: Locale) =>
        entry.key === "home" ? "" : `/${getSlug(entry.key, target)}`;

      return {
        url: `${baseUrl}/${locale}${pathFor(locale)}`,
        lastModified: new Date(),
        changeFrequency: "monthly" as const,
        priority: entry.key === "home" ? 1 : 0.7,
        alternates: {
          languages: {
            id: `${baseUrl}/id${pathFor("id")}`,
            en: `${baseUrl}/en${pathFor("en")}`,
            "x-default": `${baseUrl}/id${pathFor("id")}`,
          },
        },
      };
    }),
  );
}
