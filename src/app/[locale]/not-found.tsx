import { getLocale, getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";
import { getSlug } from "@/i18n/pages";

export default async function NotFoundPage() {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: "common" });

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-5 px-6 py-16 text-center">
      <p className="text-sm font-semibold uppercase tracking-widest text-zinc-500">
        404
      </p>
      <h1 className="text-3xl font-semibold leading-tight tracking-tight">
        {t("notFound.title")}
      </h1>
      <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
        {t("notFound.description")}
      </p>
      <div className="mt-1 flex flex-wrap justify-center gap-3">
        <Link
          href="/"
          className="rounded-full bg-foreground px-6 py-3 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc]"
        >
          {t("notFound.backHome")}
        </Link>
        <Link
          href={`/${getSlug("contact", locale)}`}
          className="rounded-full border border-zinc-300 px-6 py-3 transition-colors hover:border-zinc-900 dark:border-zinc-700 dark:hover:border-zinc-100"
        >
          {t("notFound.goContact")}
        </Link>
      </div>
    </div>
  );
}
