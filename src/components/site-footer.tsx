import { getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";
import { PAGES, getSlug } from "@/i18n/pages";

type Props = {
  locale: string;
};

export default async function SiteFooter({ locale }: Props) {
  const t = await getTranslations({ locale, namespace: "common" });

  const items = [
    { key: "home", href: "/" },
    ...PAGES.map((page) => ({
      key: page.key,
      href: `/${getSlug(page.key, locale)}`,
    })),
  ];

  return (
    <footer className="border-t border-zinc-200 bg-zinc-50 px-6 py-8 dark:border-zinc-800 dark:bg-zinc-900/30">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <nav aria-label={t("nav.aria")}>
          <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-zinc-600 dark:text-zinc-400">
            {items.map((item) => (
              <li key={item.key}>
                <Link
                  href={item.href}
                  className="transition-colors hover:text-zinc-900 dark:hover:text-zinc-100"
                >
                  {t(`nav.${item.key}`)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <p className="text-sm text-zinc-500">
          © {new Date().getFullYear()} {t("brand")} · {t("footer.rights")}
        </p>
      </div>
    </footer>
  );
}
