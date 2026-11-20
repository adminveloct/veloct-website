import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { Link } from "@/i18n/navigation";
import { PAGES, findPageKey, getSlug } from "@/i18n/pages";
import type { Locale } from "@/i18n/pages";
import { getTeamData } from "@/lib/team";

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
      ? "ml-2 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#222222] align-middle text-white transition hover:bg-[#EE4A1B] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#222222] md:h-8 md:w-8"
      : "ml-1.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#222222] align-middle text-white transition hover:bg-[#EE4A1B] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#222222]";

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

const LOGO_ROW_BACKGROUNDS = ["bg-[#FADBD5]", "bg-[#D9EEDF]", "bg-[#FCEFB8]"] as const;
const LOGO_SWATCHES = ["bg-[#EC3013]", "bg-[#2E9E4F]", "bg-[#F2B705]"] as const;
const VALUE_CARD_COLORS = [
  "bg-[#D9EEDF]",
  "bg-[#B1DABC]",
  "bg-[#89C799]",
  "bg-[#5FB375]",
] as const;
const VALUE_CARD_HEIGHTS = [
  "lg:min-h-[260px]",
  "lg:min-h-[300px]",
  "lg:min-h-[340px]",
  "lg:min-h-[380px]",
] as const;
const TEAM_MEMBER_BADGE_COLORS = [
  "bg-[#D9EEDF] text-[#222222]",
  "bg-[#B1DABC] text-[#222222]",
  "bg-[#89C799] text-[#222222]",
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

  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: {
      canonical: `/${locale}/${slug}`,
      languages: {
        id: `/id/${getSlug(key, "id")}`,
        en: `/en/${getSlug(key, "en")}`,
      },
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
      <div className="flex flex-1 flex-col bg-[#FBFBFA]">
        <section className="px-6 pb-16 pt-12 md:pb-24 md:pt-20">
          <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-2">
            <div className="max-w-xl">
              <h1 className="text-4xl font-bold leading-tight tracking-tight text-[#222222] md:text-5xl lg:text-[64px]">
                {t("heading")}
              </h1>
              <p className="mt-6 text-[20px] font-normal leading-8 text-[#222222]">
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
          </div>
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

        <section className="px-6 py-20 md:py-28">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-xl font-bold text-[#222222] md:text-2xl">
              {t("visionLabel")}
            </h2>
            <p className="mt-8 text-3xl font-semibold leading-tight tracking-tight text-[#222222] md:mt-12 md:text-5xl lg:mt-16 lg:text-[56px] lg:leading-[1.15]">
              {t.rich("visionText", {
                yellow: (chunks) => (
                  <span className="text-[#F2B705]">{chunks}</span>
                ),
                red: (chunks) => <span className="text-[#EC3013]">{chunks}</span>,
                green: (chunks) => (
                  <span className="text-[#2E9E4F]">{chunks}</span>
                ),
              })}
            </p>
          </div>
        </section>

        <section className="relative overflow-hidden bg-[#222222] px-6 py-14 md:h-[480px] md:py-0">
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

        <section className="px-6 pb-14 pt-14 md:pb-20 md:pt-20">
          <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-[180px_1fr] md:gap-x-10 lg:gap-x-14">
            <h2 className="text-3xl font-bold text-[#222222] md:pt-8 lg:text-[40px]">
              {t("missionLabel")}
            </h2>
            <ul className="flex flex-col gap-2">
              {missionItems.map((item, index) => (
                <li
                  key={item}
                  className="flex gap-1.5 md:items-center md:gap-6"
                >
                  <span className="flex w-12 shrink-0 items-center justify-center bg-[#222222] text-2xl font-bold text-white md:h-32 md:w-[113px] md:rounded-full md:text-4xl">
                    {index + 1}
                  </span>
                  <p className="flex-1 bg-[#EDEDED] px-4 py-4 text-base leading-7 text-[#222222] md:rounded-md md:px-8 md:py-6 md:text-[20px] md:leading-8">
                    {item}
                  </p>
                </li>
              ))}
            </ul>
          </div>
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

        <section className="px-6 pb-14 pt-14 md:pb-20 md:pt-24">
          <div className="mx-auto max-w-6xl">
            <div className="grid items-center gap-10 md:grid-cols-2">
              <Image
                src="/images/logo-veloct-black.png"
                alt="VeloCT"
                width={152}
                height={100}
                className="h-auto w-full max-w-[320px]"
              />
              <div>
                <h2 className="text-xl font-semibold text-[#222222] md:text-2xl">
                  {t("nameLabel")}
                </h2>
                <p className="mt-4 text-[56px] font-bold leading-none tracking-tight text-[#222222] md:text-[64px] lg:text-[72px]">
                  {t("nameWord")}
                </p>
                <p className="mt-6 max-w-xl text-[20px] leading-8 text-[#222222]">
                  {t("nameText")}
                </p>
              </div>
            </div>

            <div className="mt-16 md:mt-20">
              <h2 className="text-3xl font-semibold text-[#222222] md:text-[36px]">
                {t("logoLabel")}
              </h2>
              <p className="mt-4 max-w-3xl text-lg leading-8 text-[#222222]">
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
                      <span className="text-xl font-bold text-[#222222] sm:w-40 sm:shrink-0 sm:text-2xl">
                        {item.name}
                      </span>
                    </span>
                    <span className="text-lg leading-8 text-[#222222] sm:text-2xl">
                      {item.meaning}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
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

        <section className="px-6 pb-14 pt-14 md:pb-20 md:pt-20">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-3xl font-semibold text-[#222222] md:text-[40px]">
              {t("valuesLabel")}
            </h2>
            <ul className="mt-8 grid gap-0 sm:grid-cols-2 sm:gap-3 lg:mt-12 lg:grid-cols-4 lg:items-end">
              {values.map((item, index) => (
                <li
                  key={item.title}
                  className={`px-6 py-6 ${VALUE_CARD_COLORS[index]} ${VALUE_CARD_HEIGHTS[index]}`}
                >
                  <h3 className="text-xl font-bold leading-snug text-[#222222] md:text-2xl">
                    {item.title}
                  </h3>
                  <p className="mt-4 text-base leading-7 text-[#222222]">
                    {item.text}
                  </p>
                </li>
              ))}
            </ul>

            <div className="flex flex-col gap-6 bg-[#222222] px-6 py-10 md:flex-row md:items-center md:justify-between md:px-8 md:py-12">
              <p className="text-[40px] font-bold leading-none tracking-tight text-white md:text-7xl lg:text-[80px]">
                {t("valuesBanner")}
              </p>
              <p className="max-w-md text-xl leading-8 text-white md:text-2xl md:leading-9">
                {t("valuesBannerText")}
              </p>
            </div>
          </div>
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

        <section className="px-6 pb-16 pt-14 md:pb-24 md:pt-20">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-3xl font-semibold text-[#222222] md:text-[40px]">
              {t("teamLabel")}
            </h2>

            <article className="mt-8 flex flex-col gap-4 rounded-[20px] bg-[#D9EEDF] p-4 md:mt-10 md:grid md:grid-cols-[minmax(0,519.33px)_1fr] md:items-center md:gap-8 md:p-6 lg:p-7">
              <div
                className="relative w-full max-w-[519.33px] overflow-hidden rounded-[14px] bg-[#EDEDED]"
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
                <span className="rounded-md bg-[#89C799] px-3 py-1 text-xs font-bold text-[#222222] md:text-sm">
                  {teamLead.badge}
                </span>
                <h3 className="mt-3 text-2xl font-bold tracking-tight text-[#222222] md:text-3xl">
                  <MemberName
                    name={teamLead.name}
                    linkedin={teamLead.linkedin}
                    linkedinLabel={t("teamLinkedin")}
                    size="lg"
                  />
                </h3>
                <p className="mt-1 text-sm font-semibold text-[#EE4A1B] md:text-base">
                  {teamLead.role}
                </p>
                {teamLead.certifications.length > 0 && (
                  <div className="mt-3">
                    <p className="text-xs font-bold text-[#222222]">
                      {t("teamCertLabel")}
                    </p>
                    <ul className="mt-1.5 flex flex-wrap gap-2">
                      {teamLead.certifications.map((certification) => (
                        <li
                          key={certification}
                          className="rounded-md bg-[#D0D0D0] px-3 py-1.5 text-xs font-medium leading-snug text-[#333333]"
                        >
                          {certification}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {teamLead.skills && (
                  <div className="mt-3">
                    <p className="text-xs font-bold text-[#222222]">
                      {t("teamSkillsLabel")}
                    </p>
                    <p className="mt-0.5 text-sm text-[#444444]">
                      {teamLead.skills}
                    </p>
                  </div>
                )}
                {teamLead.bio && (
                  <div className="mt-3">
                    <p className="text-xs font-bold text-[#222222]">
                      {t("teamBioLabel")}
                    </p>
                    <p className="mt-0.5 text-sm leading-relaxed text-[#555555]">
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
                  className="flex flex-row items-start gap-4 rounded-[20px] bg-[#EDEDED] p-4 md:flex-col md:h-full md:p-4"
                >
                  <div
                    className="relative w-[110px] shrink-0 overflow-hidden rounded-[14px] bg-[#C6C6C6] sm:w-[130px] md:w-full md:max-w-[362.67px]"
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
                      <h3 className="mt-2 text-base font-bold tracking-tight text-[#222222] md:text-lg">
                        <MemberName
                          name={member.name}
                          linkedin={member.linkedin}
                          linkedinLabel={t("teamLinkedin")}
                          size="md"
                        />
                      </h3>
                      <p className="mt-0.5 text-xs font-semibold text-[#EE4A1B] md:text-sm">
                        {member.role}
                      </p>

                      {member.certifications.length > 0 && (
                        <div className="mt-2.5">
                          <p className="text-[11px] font-bold text-[#222222]">
                            {t("teamCertLabel")}
                          </p>
                          <ul className="mt-1 flex flex-wrap gap-1.5">
                            {member.certifications.map((certification) => (
                              <li
                                key={certification}
                                className="max-w-full rounded-md bg-[#D0D0D0] px-2 py-0.5 text-[10px] font-medium leading-snug text-[#333333] md:text-[11px]"
                              >
                                {certification}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {member.skills && (
                        <div className="mt-2.5">
                          <p className="text-[11px] font-bold text-[#222222]">
                            {t("teamSkillsLabel")}
                          </p>
                          <p className="mt-0.5 text-xs text-[#444444]">
                            {member.skills}
                          </p>
                        </div>
                      )}

                      {member.bio && (
                        <div className="mt-2.5">
                          <p className="text-[11px] font-bold text-[#222222]">
                            {t("teamBioLabel")}
                          </p>
                          <p className="mt-0.5 text-xs leading-relaxed text-[#555555]">
                            {member.bio}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="bg-[linear-gradient(to_right,#FBFBFA,rgba(153,153,153,0.25))] px-6 pt-10 pb-30">
          <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-2">
            <div className="flex justify-center lg:justify-start">
              <Image
                src="/images/elemen-callNow.png"
                alt=""
                width={644}
                height={470}
                className="h-auto w-full max-w-sm"
              />
            </div>
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-[#222222] md:text-4xl">
                {home("ctaTitle")}
              </h2>
              <p className="mt-4 max-w-md text-base leading-7 text-[#222222]">
                {home("ctaSubtitle")}
              </p>
              <Link
                href={`/${getSlug("contact", locale)}`}
                className="btn-flame mt-6 flex w-full items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:brightness-110 sm:inline-flex sm:w-auto"
              >
                {home("ctaButton")}
              </Link>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-3xl flex-1 px-6 py-16">
      <h1 className="text-3xl font-semibold leading-tight tracking-tight">
        {t("heading")}
      </h1>
      <p className="mt-4 text-lg leading-8 text-zinc-600">
        {t("description")}
      </p>
    </div>
  );
}
