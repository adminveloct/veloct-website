import { getTranslations } from "next-intl/server";
import Image from "next/image";

import LanguageSwitcher from "@/components/language-switcher";
import SiteNav from "@/components/site-nav";
import { Link } from "@/i18n/navigation";
import { getSlug } from "@/i18n/pages";

type Props = {
  locale: string;
};

export default async function SiteHeader({ locale }: Props) {
  const t = await getTranslations({ locale, namespace: "common" });

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200 bg-background px-6 py-3 dark:border-zinc-800">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="flex items-center transition-opacity hover:opacity-80"
          >
            <Image
              src="/images/logo-veloct-black.png"
              alt="VeloCT"
              width={152}
              height={100}
              className="h-auto w-[60px]"
            />
          </Link>
          <SiteNav />
        </div>
        <div className="flex items-center gap-2">
          <Link
            href={`/${getSlug("contact", locale)}`}
            className="btn-flame-hover rounded-lg border border-flame px-4 py-2 text-sm font-semibold text-flame transition-colors hover:text-white dark:hover:text-white"
          >
            {t("nav.contact")}
          </Link>
          <LanguageSwitcher locale={locale} label={t("switcher.label")} />
        </div>
      </div>
    </header>
  );
}
