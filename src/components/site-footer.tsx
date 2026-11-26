import Image from "next/image";
import { getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";
import { getSlug } from "@/i18n/pages";
import { BuildingIcon, PhoneIcon, MailIcon } from "@/components/icons";

type Props = {
  locale: string;
};

function IconBuilding() {
  return <BuildingIcon size={18} className="shrink-0" />;
}

function IconPhone() {
  return <PhoneIcon size={18} className="shrink-0" />;
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
  return <MailIcon size={18} className="shrink-0" />;
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

  const activeContacts = contacts.filter((contact) =>
    Boolean(contact.label?.trim())
  );

  return (
    <footer>
      <div className="bg-neutral-900 px-6 py-12 md:py-16">
        <div
          className={`mx-auto grid max-w-6xl gap-10 md:gap-12 ${
            activeContacts.length > 0
              ? "md:grid-cols-[auto_1fr_1fr]"
              : "md:grid-cols-[auto_1fr]"
          }`}
        >
          <div className="flex justify-center md:block md:w-fit">
            <div className="inline-block">
              <Image
                src="/images/logo-veloct.png"
                alt="VeloCT"
                width={152}
                height={100}
                sizes="160px"
                className="h-auto w-[160px] md:h-24 md:w-auto"
              />
            </div>
          </div>

          <div className="text-center md:max-w-sm md:text-left">
            <p className="text-lg font-bold text-white">
              {t("footer.companyName")}
            </p>
            <p className="mx-auto mt-3 max-w-[280px] text-sm leading-6 text-neutral-300 md:mx-0 md:max-w-none">
              {t("footer.tagline")}
            </p>
          </div>

          {activeContacts.length > 0 && (
            <div>
              <p className="text-lg font-bold text-white">
                {t("footer.contactTitle")}
              </p>
              <ul className="mt-4 space-y-4 md:space-y-3">
                {activeContacts.map((contact, index) => (
                  <li
                    key={index}
                    className="flex items-center gap-3 text-sm text-neutral-300"
                  >
                    <span className="text-neutral-300">{contact.icon}</span>
                    <span>{contact.label}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Mobile only: Copyright & Kebijakan Privasi */}
        <div className="mt-12 space-y-8 text-center md:hidden">
          <p className="text-sm font-medium text-neutral-300">
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
      <div className="hidden bg-neutral-50 px-6 py-3 md:block">
        <div className="mx-auto flex max-w-6xl items-center justify-center gap-8 text-sm text-neutral-600">
          <span className="font-medium">
            © {new Date().getFullYear()} {t("footer.companyName")}
          </span>
          <Link
            href={`/${getSlug("privacy", locale)}`}
            className="font-medium transition-colors hover:text-neutral-900"
          >
            {t("nav.privacy")}
          </Link>
        </div>
      </div>
    </footer>
  );
}
