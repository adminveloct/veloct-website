import Image from "next/image";
import { getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";
import { getSlug } from "@/i18n/pages";

type Props = {
  locale: string;
};

function IconBuilding() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-[18px] w-[18px] shrink-0"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 21h16M6 21V5a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v16M14 9h4a1 1 0 0 1 1 1v11M9 8h2M9 12h2M9 16h2" />
    </svg>
  );
}

function IconPhone() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-[18px] w-[18px] shrink-0"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6.5 3h3l1.5 4-2 1.5a12 12 0 0 0 5.5 5.5L16 12l4 1.5v3a2 2 0 0 1-2.2 2A17 17 0 0 1 4.5 5.2 2 2 0 0 1 6.5 3z" />
    </svg>
  );
}

function IconWhatsApp() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-[18px] w-[18px] shrink-0"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 3a9 9 0 0 0-7.8 13.5L3 21l4.7-1.2A9 9 0 1 0 12 3z" />
      <path d="M9 9c.6 2.4 2.6 4.4 5 5l1.2-1.6 2.3 1v1.6c-3.4.4-7.4-2.7-8-6.4H9.5l1 2-2 1" />
    </svg>
  );
}

function IconMail() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-[18px] w-[18px] shrink-0"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  );
}

export default async function SiteFooter({ locale }: Props) {
  const t = await getTranslations({ locale, namespace: "common" });
  const pending = t("footer.pending");

  const contacts = [
    { icon: <IconBuilding />, label: pending },
    { icon: <IconPhone />, label: pending },
    { icon: <IconWhatsApp />, label: pending },
    { icon: <IconMail />, label: pending },
  ];

  return (
    <footer>
      <div className="bg-[#222222] px-6 py-14 md:py-16">
        <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-[auto_1fr_1fr] md:gap-12">
          <div className="w-fit">
            <Image
              src="/images/logo-veloct.png"
              alt="VeloCT"
              width={600}
              height={416}
              unoptimized
              className="h-20 w-auto md:h-24"
            />
          </div>

          <div className="max-w-sm">
            <p className="text-lg font-bold text-white">
              {t("footer.companyName")}
            </p>
            <p className="mt-3 text-sm leading-6 text-zinc-400">
              {t("footer.tagline")}
            </p>
          </div>

          <div>
            <p className="text-lg font-bold text-white">
              {t("footer.contactTitle")}
            </p>
            <ul className="mt-4 space-y-3">
              {contacts.map((contact, index) => (
                <li
                  key={index}
                  className="flex items-center gap-3 text-sm text-zinc-300"
                >
                  <span className="text-zinc-300">{contact.icon}</span>
                  <span>{contact.label}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-[#FBFBFA] px-6 py-3">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-center gap-3 text-sm text-zinc-600 sm:flex-row sm:gap-8">
          <span>
            © {new Date().getFullYear()} {t("footer.companyName")}
          </span>
          <Link
            href={`/${getSlug("privacy", locale)}`}
            className="transition-colors hover:text-zinc-900"
          >
            {t("nav.privacy")}
          </Link>
        </div>
      </div>
    </footer>
  );
}
