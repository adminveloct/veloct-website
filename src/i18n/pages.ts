export type Locale = "id" | "en";

export type PageKey = "about" | "services" | "contact" | "privacy";

type PageDefinition = {
  key: PageKey;
  slugs: Record<Locale, string>;
};

export const PAGES: readonly PageDefinition[] = [
  { key: "about", slugs: { id: "tentang", en: "about" } },
  { key: "services", slugs: { id: "layanan", en: "services-products" } },
  { key: "contact", slugs: { id: "kontak", en: "contact" } },
  { key: "privacy", slugs: { id: "kebijakan-privasi", en: "privacy-policy" } },
];

export function getSlug(key: PageKey, locale: string): string {
  const page = PAGES.find((candidate) => candidate.key === key);
  if (!page) {
    throw new Error(`Halaman tidak dikenal: ${key}`);
  }
  const slug = page.slugs[locale as Locale];
  if (!slug) {
    throw new Error(`Slug tidak dikenal: ${key} (${locale})`);
  }
  return slug;
}

export function findPageKey(locale: string, slug: string): PageKey | undefined {
  return PAGES.find(
    (candidate) => candidate.slugs[locale as Locale] === slug,
  )?.key;
}
