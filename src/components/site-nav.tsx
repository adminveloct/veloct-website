"use client";

import { useState } from "react";

import { useLocale, useTranslations } from "next-intl";

import { Link, usePathname } from "@/i18n/navigation";
import { PAGES, getSlug } from "@/i18n/pages";

import LanguageSwitcher from "@/components/language-switcher";

export default function SiteNav() {
  const locale = useLocale();
  const t = useTranslations("common");
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const items = PAGES.filter(
    (page) => page.key !== "privacy" && page.key !== "contact"
  ).map((page) => ({
    key: page.key,
    href: `/${getSlug(page.key, locale)}`,
  }));

  return (
    <>
      <nav aria-label={t("nav.aria")} className="hidden lg:block">
        <ul className="flex items-center gap-1 text-sm">
          {items.map((item) => (
            <li key={item.key}>
              <Link
                href={item.href}
                aria-current={pathname === item.href ? "page" : undefined}
                className={`relative block px-3 py-2 transition-colors ${
                  pathname === item.href
                    ? "font-semibold text-neutral-900 after:absolute after:inset-x-3 after:bottom-0 after:h-[3px] after:bg-linear-to-r after:from-red-500 after:via-red-700 after:to-red-600 after:content-['']"
                    : "font-medium text-neutral-600 hover:text-neutral-900"
                }`}
              >
                {t(`nav.${item.key}`)}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <button
        type="button"
        aria-expanded={open}
        aria-controls="site-menu"
        aria-label={t("nav.menuLabel")}
        onClick={() => setOpen((value) => !value)}
        className="rounded-md p-2 text-neutral-700 transition-colors hover:bg-neutral-100 lg:hidden"
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className="h-6 w-6"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        >
          {open ? (
            <path d="M6 6l12 12M18 6L6 18" />
          ) : (
            <path d="M4 7h16M4 12h16M4 17h16" />
          )}
        </svg>
      </button>

      {open && (
        <div
          id="site-menu"
          className="absolute inset-x-0 top-full z-10 border-b border-neutral-200 bg-background px-6 py-3 shadow-lg lg:hidden"
        >
          <nav aria-label={t("nav.aria")}>
            <ul className="mx-auto flex max-w-6xl flex-col gap-1 text-sm">
              {items.map((item) => (
                <li key={item.key}>
                  <Link
                    href={item.href}
                    aria-current={
                      pathname === item.href ? "page" : undefined
                    }
                    onClick={() => setOpen(false)}
                    className={`relative block rounded-md px-3 py-2 transition-colors ${
                      pathname === item.href
                        ? "font-semibold text-neutral-900 after:absolute after:inset-x-3 after:bottom-1 after:h-[3px] after:bg-linear-to-r after:from-red-500 after:via-red-700 after:to-red-600 after:content-['']"
                        : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
                    }`}
                  >
                    {t(`nav.${item.key}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="mx-auto mt-3 flex max-w-6xl border-t border-neutral-200 pt-3">
            <LanguageSwitcher locale={locale} label={t("switcher.label")} />
          </div>
        </div>
      )}
    </>
  );
}
