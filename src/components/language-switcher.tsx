"use client";

import Image from "next/image";

import { usePathname, useRouter } from "@/i18n/navigation";
import { findPageKey, getSlug } from "@/i18n/pages";
import { routing } from "@/i18n/routing";

type Props = {
  locale: string;
  label: string;
};

const FLAGS: Record<string, { src: string; width: number; height: number }> = {
  id: { src: "/images/id.png", width: 36, height: 36 },
  en: { src: "/images/en.png", width: 36, height: 32 },
};

export default function LanguageSwitcher({ locale, label }: Props) {
  const router = useRouter();
  const pathname = usePathname();

  function switchLocale(nextLocale: string) {
    const slug = pathname.split("/").filter(Boolean)[0];
    const pageKey = slug ? findPageKey(locale, slug) : undefined;
    const target = pageKey ? `/${getSlug(pageKey, nextLocale)}` : pathname;
    router.replace(target, { locale: nextLocale, scroll: false });
  }

  return (
    <div
      role="group"
      aria-label={label}
      className="flex items-center gap-1.5"
    >
      {routing.locales.map((candidate) => (
        <button
          key={candidate}
          type="button"
          onClick={() => switchLocale(candidate)}
          aria-current={candidate === locale ? "true" : undefined}
          className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
            candidate === locale
              ? "bg-zinc-900 text-white"
              : "border border-zinc-200 bg-background text-zinc-600 hover:text-zinc-900"
          }`}
        >
          <Image
            src={FLAGS[candidate].src}
            alt=""
            width={FLAGS[candidate].width}
            height={FLAGS[candidate].height}
            className="h-4 w-auto"
          />
          {candidate.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
