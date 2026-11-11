import { getTranslations } from "next-intl/server";

import LanguageSwitcher from "@/components/language-switcher";
import SiteNav from "@/components/site-nav";
import { Link } from "@/i18n/navigation";

type Props = {
  locale: string;
};

export default async function SiteHeader({ locale }: Props) {
  const t = await getTranslations({ locale, namespace: "common" });

  return (
    <header className="relative border-b border-zinc-200 px-6 py-4 dark:border-zinc-800">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
        <Link
          href="/"
          className="text-lg font-semibold tracking-tight transition-colors hover:text-zinc-600 dark:hover:text-zinc-300"
        >
          {t("brand")}
        </Link>
        <div className="flex items-center gap-2">
          <SiteNav />
          <LanguageSwitcher locale={locale} label={t("switcher.label")} />
        </div>
      </div>
    </header>
  );
}
