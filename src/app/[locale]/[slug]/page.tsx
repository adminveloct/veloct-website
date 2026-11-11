import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { PAGES, findPageKey, getSlug } from "@/i18n/pages";
import type { Locale } from "@/i18n/pages";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export const dynamicParams = false;

export async function generateStaticParams({
  params,
}: {
  params: { locale: string; slug: string };
}) {
  const { locale } = params;
  return PAGES.map((page) => ({ slug: page.slugs[locale as Locale] }));
}

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const key = findPageKey(locale, slug);
  if (!key) {
    return {};
  }
  const t = await getTranslations({ locale, namespace: key });

  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: {
      canonical: `/${locale}/${slug}`,
      languages: {
        id: `/id/${getSlug(key, "id")}`,
        en: `/en/${getSlug(key, "en")}`,
      },
    },
  };
}

export default async function SlugPage({ params }: Props) {
  const { locale, slug } = await params;
  const key = findPageKey(locale, slug);
  if (!key) {
    notFound();
  }
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: key });

  return (
    <div className="mx-auto w-full max-w-3xl flex-1 px-6 py-16">
      <h1 className="text-3xl font-semibold leading-tight tracking-tight">
        {t("heading")}
      </h1>
      <p className="mt-4 text-lg leading-8 text-zinc-600 dark:text-zinc-400">
        {t("description")}
      </p>
    </div>
  );
}
