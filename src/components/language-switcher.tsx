"use client";

import { usePathname, useRouter } from "@/i18n/navigation";
import { findPageKey, getSlug } from "@/i18n/pages";
import { routing } from "@/i18n/routing";

type Props = {
  locale: string;
  label: string;
};

export default function LanguageSwitcher({ locale, label }: Props) {
  const router = useRouter();
  const pathname = usePathname();

  function switchLocale(nextLocale: string) {
    const slug = pathname.split("/").filter(Boolean)[0];
    const pageKey = slug ? findPageKey(locale, slug) : undefined;
    const target = pageKey ? `/${getSlug(pageKey, nextLocale)}` : pathname;
    router.replace(target, { locale: nextLocale });
  }

  return (
    <div
      role="group"
      aria-label={label}
      className="flex items-center gap-1 rounded-full border border-zinc-200 p-1 text-sm dark:border-zinc-800"
    >
      {routing.locales.map((candidate) => (
        <button
          key={candidate}
          type="button"
          onClick={() => switchLocale(candidate)}
          aria-current={candidate === locale ? "true" : undefined}
          className={`rounded-full px-3 py-1 transition-colors ${
            candidate === locale
              ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
              : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
          }`}
        >
          {candidate.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
