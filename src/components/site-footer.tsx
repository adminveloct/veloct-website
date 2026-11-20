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
      <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" />
      <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" />
      <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" />
      <path d="M10 6h4" />
      <path d="M10 10h4" />
      <path d="M10 14h4" />
      <path d="M10 18h4" />
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
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
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
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
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
      <div className="bg-[#222222] px-6 py-12 md:py-16">
        <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-[auto_1fr_1fr] md:gap-12">
          <div className="flex justify-center md:block md:w-fit">
            <div className="inline-block">
              <Image
                src="/images/logo-veloct.png"
                alt="VeloCT"
                width={152}
                height={100}
                unoptimized
                className="h-auto w-[160px] md:h-24 md:w-auto"
              />
            </div>
          </div>

          <div className="text-center md:max-w-sm md:text-left">
            <p className="text-lg font-bold text-white">
              {t("footer.companyName")}
            </p>
            <p className="mx-auto mt-3 max-w-[280px] text-sm leading-6 text-zinc-300 md:mx-0 md:max-w-none md:text-zinc-400">
              {t("footer.tagline")}
            </p>
          </div>

          <div>
            <p className="text-lg font-bold text-white">
              {t("footer.contactTitle")}
            </p>
            <ul className="mt-4 space-y-4 md:space-y-3">
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

        {/* Mobile only: Copyright & Kebijakan Privasi */}
        <div className="mt-12 space-y-8 text-center md:hidden">
          <p className="text-sm font-medium text-zinc-300">
            © {new Date().getFullYear()} {t("footer.companyName")}
          </p>
          <div>
            <Link
              href={`/${getSlug("privacy", locale)}`}
              className="inline-block text-base font-medium text-white transition-opacity hover:opacity-80"
            >
              {t("nav.privacy")}
            </Link>
          </div>
        </div>
      </div>

      {/* Desktop only: Light bottom bar */}
      <div className="hidden bg-[#FBFBFA] px-6 py-3 md:block">
        <div className="mx-auto flex max-w-6xl items-center justify-center gap-8 text-sm text-zinc-600">
          <span className="font-medium">
            © {new Date().getFullYear()} {t("footer.companyName")}
          </span>
          <Link
            href={`/${getSlug("privacy", locale)}`}
            className="font-medium transition-colors hover:text-zinc-900"
          >
            {t("nav.privacy")}
          </Link>
        </div>
      </div>
    </footer>
  );
}
