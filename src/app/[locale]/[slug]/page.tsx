import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PAGES, findPageKey, getSlug } from "@/i18n/pages";
import type { Locale } from "@/i18n/pages";
import { getTeamData } from "@/lib/team";
import ProjectShowcase from "@/components/project-showcase";
import type { Project } from "@/components/project-showcase";
import ContactForm from "@/components/contact-form";
import ContactFaq from "@/components/contact-faq";
import type { FaqItem } from "@/components/contact-faq";
import PrivacyToc from "@/components/privacy-toc";
import { Container } from "@/components/ui/container";
import { CtaClosing } from "@/components/sections/cta-closing";

const PARTNER_LOGOS = [
  { src: "/images/logo-polairud-polri.webp", alt: "Polairud Polri" },
  { src: "/images/logo-istn.png", alt: "ISTN" },
  { src: "/images/logo-densus-88-polri.png", alt: "Densus 88 Polri" },
  { src: "/images/logo-korlantas-polri.png", alt: "Korlantas Polri" },
  { src: "/images/logo-telkom-akses.png", alt: "Telkom Akses" },
  { src: "/images/logo-pertamina-energy-institute.png", alt: "Pertamina Energy Institute" },
] as const;

type ServiceRole = {
  key: string;
  category: string;
  problem: string;
  solution: string;
  partnerNote?: string;
};

type WorkStep = {
  key: string;
  title: string;
  description: string;
  bg: string;
};

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.59 0 4.25 2.36 4.25 5.43v6.31zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45z" />
    </svg>
  );
}

function MemberName({
  name,
  linkedin,
  linkedinLabel,
  size = "md",
}: {
  name: string;
  linkedin?: string;
  linkedinLabel: string;
  size?: "md" | "lg";
}) {
  const parts = name.trim().split(/\s+/);
  const firstWords = parts.slice(0, -1).join(" ");
  const lastWord = parts[parts.length - 1];

  const iconLinkClasses =
    size === "lg"
      ? "ml-2 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-neutral-900 align-middle text-white transition hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 md:h-8 md:w-8"
      : "ml-1.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-neutral-900 align-middle text-white transition hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900";

  const iconSvgClasses =
    size === "lg" ? "h-3.5 w-3.5 md:h-4 md:w-4" : "h-3 w-3";

  return (
    <>
      {firstWords ? `${firstWords} ` : ""}
      <span className="inline-flex items-center whitespace-nowrap">
        <span>{lastWord}</span>
        {linkedin ? (
          <a
            href={linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${linkedinLabel} ${name}`}
            title={`${linkedinLabel} ${name}`}
            className={iconLinkClasses}
          >
            <LinkedInIcon className={iconSvgClasses} />
          </a>
        ) : null}
      </span>
    </>
  );
}

export const dynamicParams = false;

const LOGO_ROW_BACKGROUNDS = ["bg-red-100", "bg-mint-100", "bg-sun-100"] as const;
const LOGO_SWATCHES = ["bg-red-500", "bg-forest-500", "bg-sun-500"] as const;
const VALUE_CARD_COLORS = [
  "bg-mint-100",
  "bg-mint-200",
  "bg-mint-300",
  "bg-mint-400",
] as const;
const VALUE_CARD_HEIGHTS = [
  "lg:min-h-[260px]",
  "lg:min-h-[300px]",
  "lg:min-h-[340px]",
  "lg:min-h-[380px]",
] as const;
const TEAM_MEMBER_BADGE_COLORS = [
  "bg-mint-100 text-neutral-900",
  "bg-mint-200 text-neutral-900",
  "bg-mint-300 text-neutral-900",
] as const;
const TEAM_PHOTOS: Record<string, string> = {
  "ivan-sudirman": "/images/tim/ivan-sudirman.webp",
  daffa: "/images/tim/daffa.webp",
  "fauzan-rajwa-dhavansyah": "/images/tim/fauzan-rajwa-dhavansyah.webp",
  "rizki-mahasari": "/images/tim/rizki-mahasari.webp",
  "azka-nurun-ala": "/images/tim/azka-nurun-ala.webp",
  "husnia-munzayana": "/images/tim/husnia-munzayana.webp",
  "asyifa-nurul-shafira": "/images/tim/asyifa-nurul-shafira.webp",
};

export async function generateStaticParams({
  params,
}: {
  params: { locale: string; slug: string };
}) {
  const { locale } = params;
  return PAGES.map((page) => ({ slug: page.slugs[locale as Locale] }));
}

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const key = findPageKey(locale, slug);
  if (!key) {
    return {};
  }
  const t = await getTranslations({ locale, namespace: key });
  const title = t("metaTitle");
  const description = t("metaDescription");

  return {
    title,
    description,
    alternates: {
      canonical: `/${locale}/${slug}`,
      languages: {
        id: `/id/${getSlug(key, "id")}`,
        en: `/en/${getSlug(key, "en")}`,
      },
    },
    openGraph: {
      title,
      description,
      url: `/${locale}/${slug}`,
      locale: locale === "id" ? "id_ID" : "en_US",
      siteName: "VeloCT",
      type: "website",
      images: [
        {
          url: "/images/og-image.png",
          width: 2838,
          height: 1440,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/images/og-image.png"],
    },
  };
}

export default async function SlugPage({ params }: Props) {
  const { locale, slug } = await params;
  const key = findPageKey(locale, slug);
  if (!key) {
    notFound();
  }
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: key });

  if (key === "about") {
    const home = await getTranslations({ locale, namespace: "home" });
    const missionItems = t.raw("missionItems") as string[];
    const logoItems = t.raw("logoItems") as Array<{
      name: string;
      meaning: string;
    }>;
    const values = t.raw("values") as Array<{ title: string; text: string }>;
    const { teamLead, teamMembers } = getTeamData(locale);

    return (
      <div className="flex flex-1 flex-col bg-neutral-50">
        <section className="pb-16 pt-12 md:pb-24 md:pt-20">
          <Container size="default" className="grid items-center gap-10 lg:grid-cols-2">
            <div className="max-w-xl">
              <h1 className="text-4xl font-bold leading-tight tracking-tight text-neutral-900 md:text-5xl lg:text-[64px] lg:leading-[1.15]">
                {t("heading")}
              </h1>
              <p className="mt-6 text-lg leading-relaxed text-neutral-900 md:text-xl lg:text-[20px] lg:leading-8">
                {t("description")}
              </p>
            </div>
            <div className="w-full max-w-[519.33px] justify-self-center lg:justify-self-end">
              <div
                className="w-full overflow-hidden rounded-[28px]"
                style={{ aspectRatio: "519.33 / 480" }}
              >
                <Image
                  src="/images/foto-tim.webp"
                  alt={t("heroImageAlt")}
                  width={1536}
                  height={1149}
                  priority
                  sizes="(min-width: 1024px) 519px, 100vw"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </Container>
        </section>

        <div aria-hidden="true" className="relative">
          <Image
            src="/images/Frame4.png"
            alt=""
            width={5760}
            height={800}
            className="block h-auto w-full"
          />
        </div>

        <section className="py-20 md:py-28">
          <Container size="default">
            <h2 className="text-xl font-bold text-neutral-900 md:text-2xl">
              {t("visionLabel")}
            </h2>
            <p className="mt-8 text-3xl font-semibold leading-tight tracking-tight text-neutral-900 md:mt-12 md:text-5xl lg:mt-16 lg:text-[56px] lg:leading-[1.15]">
              {t.rich("visionText", {
                yellow: (chunks) => (
                  <span className="text-sun-500">{chunks}</span>
                ),
                red: (chunks) => <span className="text-red-500">{chunks}</span>,
                green: (chunks) => (
                  <span className="text-forest-500">{chunks}</span>
                ),
              })}
            </p>
          </Container>
        </section>

        <section className="relative overflow-hidden bg-neutral-900 px-6 py-14 md:h-[480px] md:py-0">
          <Image
            src="/images/elemen-moto2.png"
            alt=""
            aria-hidden="true"
            width={416}
            height={1920}
            className="pointer-events-none absolute right-1 top-0 h-full w-14 object-fill md:right-6 md:w-[104px] lg:right-24 lg:w-[140px]"
          />
          <div className="relative mx-auto flex h-full max-w-6xl flex-col justify-center pr-14 md:pr-28 lg:pr-56 xl:pr-[180px] min-[1440px]:pr-[120px] min-[1536px]:pr-[84px]">
            <p className="text-xl font-bold text-white md:text-2xl">
              {t("motoLabel")}
            </p>
            <p className="mt-5 text-[40px] font-bold leading-none tracking-tight text-white md:mt-6 md:text-[64px] lg:text-[72px] xl:text-[96px] min-[1440px]:text-[112px]">
              {t("motoLine1")}
            </p>
            <Image
              src="/images/elemen-moto1.png"
              alt=""
              aria-hidden="true"
              width={4320}
              height={32}
              className="mt-6 h-2 w-full md:mt-16 md:h-[10px]"
            />
            <p className="mt-6 text-right text-[40px] font-bold leading-none tracking-tight text-white md:mt-16 md:text-[64px] lg:text-[72px] xl:text-[96px] min-[1440px]:text-[112px]">
              {t("motoLine2")}
            </p>
          </div>
        </section>

        <section className="pb-14 pt-14 md:pb-20 md:pt-20">
          <Container size="default" className="grid gap-8 md:grid-cols-[180px_1fr] md:gap-x-10 lg:gap-x-14">
            <h2 className="text-3xl font-bold text-neutral-900 md:pt-8 lg:text-[40px]">
              {t("missionLabel")}
            </h2>
            <ul className="flex flex-col gap-2">
              {missionItems.map((item, index) => (
                <li
                  key={item}
                  className="flex gap-1.5 md:items-center md:gap-6"
                >
                  <span className="flex w-12 shrink-0 items-center justify-center bg-neutral-900 text-2xl font-bold text-white md:h-32 md:w-[113px] md:rounded-full md:text-4xl">
                    {index + 1}
                  </span>
                  <p className="flex-1 bg-neutral-100 px-4 py-4 text-base leading-7 text-neutral-900 md:rounded-md md:px-8 md:py-6 md:text-[20px] md:leading-8">
                    {item}
                  </p>
                </li>
              ))}
            </ul>
          </Container>
        </section>

        <div aria-hidden="true" className="relative">
          <Image
            src="/images/Frame5.png"
            alt=""
            width={5760}
            height={800}
            className="block h-auto w-full"
          />
        </div>

        <section className="pb-14 pt-14 md:pb-20 md:pt-24">
          <Container size="default">
            <div className="grid items-center gap-10 md:grid-cols-2">
              <Image
                src="/images/logo-veloct-black.png"
                alt="VeloCT"
                width={152}
                height={100}
                className="h-auto w-full max-w-[320px]"
              />
              <div>
                <h2 className="text-xl font-semibold text-neutral-900 md:text-2xl">
                  {t("nameLabel")}
                </h2>
                <p className="mt-4 text-[56px] font-bold leading-none tracking-tight text-neutral-900 md:text-[64px] lg:text-[72px]">
                  {t("nameWord")}
                </p>
                <p className="mt-6 max-w-xl text-[20px] leading-8 text-neutral-900">
                  {t("nameText")}
                </p>
              </div>
            </div>

            <div className="mt-16 md:mt-20">
              <h2 className="text-3xl font-semibold text-neutral-900 md:text-[36px]">
                {t("logoLabel")}
              </h2>
              <p className="mt-4 max-w-3xl text-lg leading-8 text-neutral-900">
                {t("logoText")}
              </p>
              <ul className="mt-8 flex flex-col gap-2">
                {logoItems.map((item, index) => (
                  <li
                    key={item.name}
                    className={`flex flex-col gap-2 px-6 py-5 sm:flex-row sm:items-center sm:gap-10 sm:px-8 sm:py-6 ${LOGO_ROW_BACKGROUNDS[index]}`}
                  >
                    <span className="flex items-center gap-4 sm:contents">
                      <span
                        aria-hidden="true"
                        className={`h-[18px] w-[18px] shrink-0 rounded-[2px] ${LOGO_SWATCHES[index]}`}
                      />
                      <span className="text-xl font-bold text-neutral-900 sm:w-40 sm:shrink-0 sm:text-2xl">
                        {item.name}
                      </span>
                    </span>
                    <span className="text-lg leading-8 text-neutral-900 sm:text-2xl">
                      {item.meaning}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </Container>
        </section>

        <div aria-hidden="true" className="relative">
          <Image
            src="/images/Frame4.png"
            alt=""
            width={5760}
            height={800}
            className="block h-auto w-full"
          />
        </div>

        <section className="pb-14 pt-14 md:pb-20 md:pt-20">
          <Container size="default">
            <h2 className="text-3xl font-semibold text-neutral-900 md:text-[40px]">
              {t("valuesLabel")}
            </h2>
            <ul className="mt-8 grid gap-0 sm:grid-cols-2 sm:gap-3 lg:mt-12 lg:grid-cols-4 lg:items-end">
              {values.map((item, index) => (
                <li
                  key={item.title}
                  className={`px-6 py-6 ${VALUE_CARD_COLORS[index]} ${VALUE_CARD_HEIGHTS[index]}`}
                >
                  <h3 className="text-xl font-bold leading-snug text-neutral-900 md:text-2xl">
                    {item.title}
                  </h3>
                  <p className="mt-4 text-base leading-7 text-neutral-900">
                    {item.text}
                  </p>
                </li>
              ))}
            </ul>

            <div className="flex flex-col gap-6 bg-neutral-900 px-6 py-10 md:flex-row md:items-center md:justify-between md:px-8 md:py-12">
              <p className="text-[40px] font-bold leading-none tracking-tight text-white md:text-7xl lg:text-[80px]">
                {t("valuesBanner")}
              </p>
              <p className="max-w-md text-xl leading-8 text-white md:text-2xl md:leading-9">
                {t("valuesBannerText")}
              </p>
            </div>
          </Container>
        </section>

        <div aria-hidden="true" className="relative">
          <Image
            src="/images/Frame6.png"
            alt=""
            width={5760}
            height={800}
            className="block h-auto w-full"
          />
        </div>

        <section className="pb-16 pt-14 md:pb-24 md:pt-20">
          <Container size="default">
            <h2 className="text-3xl font-semibold text-neutral-900 md:text-[40px]">
              {t("teamLabel")}
            </h2>

            <article className="mt-8 flex flex-col gap-4 rounded-[20px] bg-mint-100 p-4 md:mt-10 md:grid md:grid-cols-[minmax(0,519.33px)_1fr] md:items-center md:gap-8 md:p-6 lg:p-7">
              <div
                className="relative w-full max-w-[519.33px] overflow-hidden rounded-[14px] bg-neutral-100"
                style={{ aspectRatio: "519.33 / 440" }}
              >
                <Image
                  src={TEAM_PHOTOS[teamLead.id]}
                  alt={teamLead.name}
                  fill
                  sizes="(min-width: 1024px) 519px, 100vw"
                  className="object-cover object-[center_35%]"
                />
              </div>
              <div className="flex flex-col items-start justify-center">
                <span className="rounded-md bg-mint-300 px-3 py-1 text-xs font-bold text-neutral-900 md:text-sm">
                  {teamLead.badge}
                </span>
                <h3 className="mt-3 text-2xl font-bold tracking-tight text-neutral-900 md:text-3xl">
                  <MemberName
                    name={teamLead.name}
                    linkedin={teamLead.linkedin}
                    linkedinLabel={t("teamLinkedin")}
                    size="lg"
                  />
                </h3>
                <p className="mt-1 text-sm font-semibold text-red-500 md:text-base">
                  {teamLead.role}
                </p>
                {teamLead.certifications.length > 0 && (
                  <div className="mt-3">
                    <p className="text-xs font-bold text-neutral-900">
                      {t("teamCertLabel")}
                    </p>
                    <ul className="mt-1.5 flex flex-wrap gap-2">
                      {teamLead.certifications.map((certification) => (
                        <li
                          key={certification}
                          className="rounded-md bg-neutral-200 px-3 py-1.5 text-xs font-medium leading-snug text-neutral-800"
                        >
                          {certification}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {teamLead.skills && (
                  <div className="mt-3">
                    <p className="text-xs font-bold text-neutral-900">
                      {t("teamSkillsLabel")}
                    </p>
                    <p className="mt-0.5 text-sm text-neutral-700">
                      {teamLead.skills}
                    </p>
                  </div>
                )}
                {teamLead.bio && (
                  <div className="mt-3">
                    <p className="text-xs font-bold text-neutral-900">
                      {t("teamBioLabel")}
                    </p>
                    <p className="mt-0.5 text-sm leading-relaxed text-neutral-600">
                      {teamLead.bio}
                    </p>
                  </div>
                )}
              </div>
            </article>

            <ul className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-5">
              {teamMembers.map((member, index) => (
                <li
                  key={member.id}
                  className="flex flex-row items-start gap-4 rounded-[20px] bg-neutral-100 p-4 md:h-full md:flex-col md:p-4"
                >
                  <div
                    className="relative w-[110px] shrink-0 overflow-hidden rounded-[14px] bg-neutral-300 sm:w-[130px] md:w-full md:max-w-[362.67px]"
                    style={{ aspectRatio: "362.67 / 330" }}
                  >
                    <Image
                      src={TEAM_PHOTOS[member.id]}
                      alt={member.name}
                      fill
                      sizes="(min-width: 1024px) 363px, (min-width: 768px) 45vw, 130px"
                      className="object-cover object-[center_35%]"
                    />
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col md:h-full md:justify-between">
                    <div>
                      <span
                        className={`inline-flex rounded-md px-2.5 py-0.5 text-xs font-bold ${TEAM_MEMBER_BADGE_COLORS[index % TEAM_MEMBER_BADGE_COLORS.length]}`}
                      >
                        {member.badge}
                      </span>
                      <h3 className="mt-2 text-base font-bold tracking-tight text-neutral-900 md:text-lg">
                        <MemberName
                          name={member.name}
                          linkedin={member.linkedin}
                          linkedinLabel={t("teamLinkedin")}
                          size="md"
                        />
                      </h3>
                      <p className="mt-0.5 text-xs font-semibold text-red-500 md:text-sm">
                        {member.role}
                      </p>

                      {member.certifications.length > 0 && (
                        <div className="mt-2.5">
                          <p className="text-[11px] font-bold text-neutral-900">
                            {t("teamCertLabel")}
                          </p>
                          <ul className="mt-1 flex flex-wrap gap-1.5">
                            {member.certifications.map((certification) => (
                              <li
                                key={certification}
                                className="max-w-full rounded-md bg-neutral-200 px-2 py-0.5 text-[10px] font-medium leading-snug text-neutral-800 md:text-[11px]"
                              >
                                {certification}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {member.skills && (
                        <div className="mt-2.5">
                          <p className="text-[11px] font-bold text-neutral-900">
                            {t("teamSkillsLabel")}
                          </p>
                          <p className="mt-0.5 text-xs text-neutral-700">
                            {member.skills}
                          </p>
                        </div>
                      )}

                      {member.bio && (
                        <div className="mt-2.5">
                          <p className="text-[11px] font-bold text-neutral-900">
                            {t("teamBioLabel")}
                          </p>
                          <p className="mt-0.5 text-xs leading-relaxed text-neutral-600">
                            {member.bio}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </Container>
        </section>

        <CtaClosing
          title={home("ctaTitle")}
          subtitle={home("ctaSubtitle")}
          ctaText={home("ctaButton")}
          ctaHref={`/${getSlug("contact", locale)}`}
          imageSrc="/images/elemen-callNow.png"
        />
      </div>
    );
  }

  if (key === "services-products") {
    const home = await getTranslations({ locale, namespace: "home" });
    const roles = t.raw("roles") as ServiceRole[];
    const steps = t.raw("steps") as WorkStep[];
    const projects = t.raw("projects") as Project[];
    const projectFilters = t.raw("projectFilters") as {
      all: string;
      ai: string;
      bigData: string;
      infrastructure: string;
      software: string;
    };

    return (
      <div className="flex flex-1 flex-col bg-neutral-50">
        {/* Hero Section */}
        <section className="pb-16 pt-12 md:pb-24 md:pt-20">
          <Container size="default">
            <h1 className="text-4xl font-bold leading-tight tracking-tight text-neutral-900 md:text-5xl lg:text-[64px] lg:leading-[1.15]">
              {t("heading")}
            </h1>
            <p className="mt-6 max-w-4xl text-lg leading-relaxed text-neutral-900 md:text-xl lg:text-[20px] lg:leading-8">
              {t("description")}
            </p>

            {/* Peran Section */}
            <div className="mt-16 md:mt-24">
              <h2 className="text-2xl font-bold tracking-tight text-neutral-900 md:text-3xl lg:text-[40px] lg:leading-[48px]">
                {t("roleHeading")}
              </h2>

              <div className="mt-8 flex flex-col gap-6 md:mt-12 md:gap-7">
                {roles.map((role) => (
                  <div
                    key={role.key}
                    className="grid grid-cols-1 gap-3 md:grid-cols-[180px_1fr_1fr] md:items-stretch md:gap-6 lg:grid-cols-[220px_1fr_1fr]"
                  >
                    <div className="flex items-center">
                      <h3 className="text-3xl font-bold tracking-tight text-neutral-900 lg:text-[40px]">
                        {role.category}
                      </h3>
                    </div>
                    <div className="flex flex-col justify-start bg-red-100 p-6 lg:p-8">
                      <h4 className="text-base font-bold text-neutral-900 lg:text-[18px]">
                        {t("problemTitle")}
                      </h4>
                      <p className="mt-3 text-sm leading-relaxed text-neutral-900 lg:text-[16px]">
                        {role.problem}
                      </p>
                    </div>
                    <div className="flex flex-col justify-between bg-mint-100 p-6 lg:p-8">
                      <div>
                        <h4 className="text-base font-bold text-neutral-900 lg:text-[18px]">
                          {t("solutionTitle")}
                        </h4>
                        <p className="mt-3 text-sm leading-relaxed text-neutral-900 lg:text-[16px]">
                          {role.solution}
                        </p>
                      </div>
                      {role.partnerNote && (
                        <p className="mt-4 text-xs font-normal text-neutral-900 lg:text-[15px]">
                          {role.partnerNote}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Container>
        </section>

        {/* Frame 7 Divider */}
        <div aria-hidden="true" className="relative">
          <Image
            src="/images/Frame7.png"
            alt=""
            width={2880}
            height={162}
            className="block h-auto w-full"
          />
        </div>

        {/* Cara Kerja Section */}
        <section className="bg-[radial-gradient(50%_50%_at_50%_50%,var(--color-background)_0%,var(--color-neutral-100)_100%)] py-16 md:py-[120px]">
          <Container size="default">
            <h2 className="text-3xl font-bold tracking-tight text-neutral-900 md:text-4xl">
              {t("howWeWorkHeading")}
            </h2>

            <div className="mt-10 flex flex-col items-start gap-6 md:mt-12">
              {steps.map((step, index) => {
                const stepClass =
                  index === 0
                    ? "w-full md:max-w-2xl lg:max-w-3xl md:ml-0"
                    : index === 1
                      ? "w-full md:max-w-2xl lg:max-w-3xl md:ml-16 lg:ml-28"
                      : "w-full md:max-w-2xl lg:max-w-3xl md:ml-32 lg:ml-56";

                return (
                  <div
                    key={step.key}
                    className={`${stepClass} ${step.bg} p-6 md:p-8`}
                  >
                    <h3 className="text-2xl font-bold tracking-tight text-neutral-900 md:text-[28px]">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-neutral-900 md:text-base">
                      {step.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </Container>
        </section>

        {/* Frame 8 Divider */}
        <div aria-hidden="true" className="relative">
          <Image
            src="/images/Frame8.png"
            alt=""
            width={2880}
            height={162}
            className="block h-auto w-full"
          />
        </div>

        {/* Daftar Proyek Section */}
        <section
          id={locale === "id" ? "proyek" : "projects"}
          className="scroll-mt-20 bg-neutral-50 py-16 md:py-20"
        >
          <span id={locale === "id" ? "projects" : "proyek"} className="sr-only" />
          <Container size="default">
            <h2 className="text-3xl font-bold tracking-tight text-neutral-900 md:text-4xl lg:text-[48px]">
              {t("projectsHeading")}
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-neutral-600 md:text-base">
              {t("projectsSubtitle")}
            </p>

            <ProjectShowcase
              projects={projects}
              filterLabels={projectFilters}
              showMoreLabel={t("showMore")}
              showLessLabel={t("showLess")}
            />
          </Container>
        </section>

        {/* Klien dan Mitra Kami Section */}
        <section className="bg-neutral-50 py-16 md:py-20">
          <Container size="default">
            <h2 className="text-center text-3xl font-bold tracking-tight text-neutral-900 md:text-4xl">
              {home("partnersTitle")}
            </h2>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-x-12 gap-y-8">
              {PARTNER_LOGOS.map((logo) => (
                <Image
                  key={logo.src}
                  src={logo.src}
                  alt={logo.alt}
                  width={160}
                  height={64}
                  className="h-16 w-auto object-contain md:h-24"
                />
              ))}
            </div>
          </Container>
        </section>

        <CtaClosing
          title={home("ctaTitle")}
          subtitle={home("ctaSubtitle")}
          ctaText={home("ctaButton")}
          ctaHref={`/${getSlug("contact", locale)}`}
          imageSrc="/images/elemen-callNow.png"
        />
      </div>
    );
  }

  if (key === "contact") {
    const steps = t.raw("steps") as string[];
    const faqTitle = t("faqTitle");
    const faqItems = t.raw("faq") as FaqItem[];
    const errorMessages = t.raw("errors") as Record<
      string,
      Record<string, string>
    >;
    const invalidMessage = t("api.invalid");
    const formLabels = t.raw("form") as {
      nameLabel: string;
      namePlaceholder: string;
      emailLabel: string;
      emailPlaceholder: string;
      phoneLabel: string;
      phonePlaceholder: string;
      organizationLabel: string;
      organizationPlaceholder: string;
      messageLabel: string;
      privacyConsentPrefix: string;
      privacyConsentLink: string;
      privacyConsentSuffix: string;
      privacyNote?: string;
      submitButton: string;
      submitting: string;
      successTitle: string;
      successSubtitle?: string;
      backHome?: string;
      sendAnother?: string;
      errorTitle: string;
    };
    const infoItems = [
      { label: t("infoEmailLabel"), value: t("infoEmailValue") },
      { label: t("infoWhatsappLabel"), value: t("infoWhatsappValue") },
      { label: t("infoAddressLabel"), value: t("infoAddressValue") },
    ].filter(
      (item) =>
        Boolean(item.value?.trim()) &&
        item.value !== "[menyusul]" &&
        item.value !== "[to follow]"
    );

    return (
      <div className="flex flex-1 flex-col">
        {/* Bagian Formulir & Hero dengan gradasi berakhir tepat di mint-100 */}
        <div className="bg-linear-to-b from-white via-mint-100/30 to-mint-100">
          {/* Hero Section */}
          <section className="pt-12 pb-8 md:pt-16 md:pb-10">
            <Container size="default">
              <h1 className="text-4xl font-bold leading-tight tracking-tight text-neutral-900 md:text-5xl lg:text-[64px] lg:leading-[1.15]">
                {t("heading")}
              </h1>
              <p className="mt-6 max-w-3xl text-lg leading-relaxed text-neutral-900 md:text-xl lg:text-[20px] lg:leading-8">
                {t("subtitle")}{" "}
                <span className="font-semibold text-red-500">
                  {t("subtitleHighlight")}
                </span>
              </p>
            </Container>
          </section>

          {/* 3 Columns Section: Langkah Kerja Sama, Form, Informasi Kontak */}
          <section className="pb-20 md:pb-28">
            <Container
              size="default"
              className={`grid grid-cols-1 gap-10 lg:items-start lg:gap-8 ${
                infoItems.length > 0
                  ? "lg:grid-cols-[280px_1fr_220px]"
                  : "lg:grid-cols-[280px_1fr]"
              }`}
            >
              {/* Kolom 1: Langkah Kerja Sama */}
              <div>
                <h2 className="text-xl font-bold tracking-tight text-neutral-900">
                  {t("stepsTitle")}
                </h2>
                <ul className="mt-6 flex flex-col gap-6">
                  {steps.map((step, index) => (
                    <li key={index} className="flex items-start gap-4">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-forest-800 text-base font-bold text-white">
                        {index + 1}
                      </span>
                      <p className="pt-2 text-sm font-medium leading-snug text-neutral-900">
                        {step}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Kolom 2: Form Kontak */}
              <div>
                <ContactForm
                  locale={locale}
                  labels={formLabels}
                  errorMessages={errorMessages}
                  invalidMessage={invalidMessage}
                />
              </div>

              {/* Kolom 3: Informasi Kontak (hanya tampil jika ada data) */}
              {infoItems.length > 0 && (
                <div>
                  <h2 className="text-xl font-bold tracking-tight text-neutral-900">
                    {t("infoTitle")}
                  </h2>
                  <div className="mt-6 flex flex-col gap-5 text-sm text-neutral-900">
                    {infoItems.map((item, index) => (
                      <div key={index}>
                        <h3 className="font-bold">{item.label}</h3>
                        <p className="mt-1 text-neutral-600">{item.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Container>
          </section>
        </div>

        {/* Frame 9 Divider */}
        <div aria-hidden="true" className="relative -mt-px -mb-px">
          <Image
            src="/images/Frame9.png"
            alt=""
            width={5760}
            height={800}
            className="block h-auto w-full"
          />
        </div>

        {/* FAQ Section */}
        <ContactFaq title={faqTitle} items={faqItems} />
      </div>
    );
  }

  if (key === "privacy") {
    const sections = t.raw("sections") as Array<{
      id: string;
      title: string;
      content: string;
    }>;

    return (
      <Container size="default" className="w-full flex-1 py-12 md:py-16">
        <h1 className="text-4xl font-bold leading-tight tracking-tight text-neutral-900 md:text-5xl lg:text-[64px] lg:leading-[1.15]">
          {t("heading")}
        </h1>

        <div className="mt-10 grid grid-cols-1 gap-12 lg:grid-cols-[240px_1fr] lg:gap-16">
          {/* Sidebar Navigasi / Table of Contents */}
          <PrivacyToc heading={t("heading")} sections={sections} />

          {/* Konten Utama (6 Judul Bagian) */}
          <div className="space-y-20 pb-32 md:space-y-24">
            {sections.map((section) => {
              const hasContent =
                Boolean(section.content?.trim()) &&
                section.content !== "[menyusul]" &&
                section.content !== "[to follow]";

              return (
                <section key={section.id} id={section.id} className="scroll-mt-28">
                  <h2 className="text-2xl font-bold tracking-tight text-neutral-900 md:text-[28px]">
                    {section.title}
                  </h2>
                  {hasContent && (
                    <div className="mt-3">
                      <p className="whitespace-pre-line text-sm leading-relaxed text-neutral-600 md:text-base">
                        {section.content}
                      </p>
                    </div>
                  )}
                </section>
              );
            })}
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container size="narrow" className="w-full flex-1 py-16">
      <h1 className="text-3xl font-semibold leading-tight tracking-tight text-neutral-900">
        {t("heading")}
      </h1>
      <p className="mt-4 text-lg leading-8 text-neutral-600">
        {t("description")}
      </p>
    </Container>
  );
}
