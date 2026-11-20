import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { Link } from "@/i18n/navigation";
import { getSlug } from "@/i18n/pages";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: Pick<Props, "params">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "home" });

  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: {
      canonical: `/${locale}`,
      languages: {
        id: "/id",
        en: "/en",
      },
    },
  };
}

const SERVICE_IMAGES: Record<string, string> = {
  ai: "/images/elemen-AI.png",
  bigData: "/images/elemen-BigData.png",
  cloud: "/images/elemen-CloudAWS.png",
  software: "/images/elemen-Software.png",
};

const SERVICE_KEYS = ["ai", "bigData", "cloud", "software"] as const;

const SERVICE_TOP_OFFSETS = ["lg:mt-7", "lg:mt-26", "lg:mt-15", ""];

const PARTNER_LOGOS = [
  { src: "/images/logo-polairud-polri.webp", alt: "Polairud Polri" },
  { src: "/images/logo-istn.png", alt: "ISTN" },
  { src: "/images/logo-densus-88-polri.png", alt: "Densus 88 Polri" },
  { src: "/images/logo-korlantas-polri.png", alt: "Korlantas Polri" },
  { src: "/images/logo-telkom-akses.png", alt: "Telkom Akses" },
  { src: "/images/logo-pertamina-energy-institute.png", alt: "Pertamina Energy Institute" },
] as const;

function ArrowIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 10h11m0 0l-4-4m4 4l-4 4" />
    </svg>
  );
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const servicesSectionId = locale === "id" ? "layanan" : "services";

  const t = await getTranslations({ locale, namespace: "home" });
  const projects = t.raw("projects") as Array<{
    year: string;
    tag: string;
    label: string;
  }>;

  return (
    <div className="flex flex-1 flex-col">
      <section className="bg-linear-to-b from-blush via-blush to-blush-deep/80 px-6 pb-14 pt-12 md:pt-16">
        <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-2">
          <div className="max-w-xl">
            <h1 className="text-4xl font-normal leading-tight tracking-tight text-zinc-900 md:text-5xl">
              {t.rich("heading", {
                bold: (chunks) => <strong className="font-bold">{chunks}</strong>,
              })}
            </h1>
            <p className="mt-5 text-lg leading-8 text-zinc-700">
              {t.rich("description", {
                bold: (chunks) => <strong className="font-semibold">{chunks}</strong>,
              })}
            </p>
            <Link
              href={`/${getSlug("services-products", locale)}`}
              className="btn-flame mt-8 flex h-14 w-full items-center justify-center gap-2 rounded-lg px-5 text-base font-semibold text-white shadow-sm transition hover:brightness-110 sm:inline-flex sm:w-auto"
            >
              {t("button")}
              <ArrowIcon />
            </Link>
          </div>

          <div className="w-full max-w-sm md:max-w-md ml-auto">
            <Image
              src="/images/hero.png"
              alt={t("heroImageAlt")}
              priority
              width={921}
              height={1080}
              className="block h-auto w-full"
            />
          </div>
        </div>

        <div className="mt-12 flex justify-center">
          <a
            href={`#${servicesSectionId}`}
            className="inline-flex items-center gap-2 rounded-full bg-[#222222] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-black"
          >
            {t("scrollHint")}
            <svg
              aria-hidden="true"
              viewBox="0 0 20 20"
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M10 4v11m0 0l-4-4m4 4l4-4" />
            </svg>
          </a>
        </div>
      </section>

      <div aria-hidden="true" className="relative">
        <Image
          src="/images/Frame1.png"
          alt=""
          width={2880}
          height={400}
          className="block h-auto w-full"
        />
      </div>

      <section
        id={servicesSectionId}
        className="bg-linear-to-b from-mint via-mint to-[#f4faf6] px-6 py-16 md:py-20"
      >
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-3xl font-semibold tracking-tight text-zinc-900 md:text-4xl">
            {t("servicesTitle")}
          </h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:items-start">
            {SERVICE_KEYS.map((key, index) => (
              <Link
                key={key}
                href={`/${getSlug("services-products", locale)}`}
                className={`group flex flex-col rounded-2xl border border-white/80 bg-white p-5 shadow-sm transition-shadow hover:shadow-md ${SERVICE_TOP_OFFSETS[index] ?? ""
                  }`}
              >
                <div className="aspect-[4/3] overflow-hidden rounded-xl bg-mint/40">
                  <Image
                    src={SERVICE_IMAGES[key]}
                    alt=""
                    width={506}
                    height={336}
                    className="h-full w-full object-cover"
                  />
                </div>
                <h3 className="mt-4 text-center text-lg font-bold text-zinc-900 md:text-xl">
                  {t(`services.${key}`)}
                </h3>
                <p className="mt-3 flex-1 text-center text-sm leading-6 text-zinc-600">
                  {t.rich(`serviceDescriptions.${key}`, {
                    medium: (chunks) => (
                      <span className="font-medium text-zinc-900">{chunks}</span>
                    ),
                    bold: (chunks) => (
                      <span className="font-medium text-zinc-900">{chunks}</span>
                    ),
                  })}
                </p>
                <span className="mt-4 flex w-full items-center justify-center gap-3 rounded-full bg-[#D9EEDF] px-4 py-2 text-sm font-medium text-[#222222] transition-colors group-hover:bg-[#21813E] group-hover:text-white">
                  {t("serviceCardCta")}
                  <ArrowIcon />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <div aria-hidden="true" className="relative">
        <Image
          src="/images/Frame2.png"
          alt=""
          width={2880}
          height={400}
          className="block h-auto w-full"
        />
      </div>

      <section className="bg-sun px-6 py-16 md:py-20">
        <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight text-zinc-900 md:text-4xl">
              {t("workTitle")}
            </h2>
            <p className="mt-4 max-w-md text-base leading-7 text-zinc-700">
              {t.rich("workSubtitle", {
                bold: (chunks) => <strong className="font-bold">{chunks}</strong>,
              })}
            </p>
            <Link
              href={`/${getSlug("services-products", locale)}`}
              className="btn-flame mt-6 flex w-full items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:brightness-110 sm:inline-flex sm:w-auto"
            >
              {t("workCta")}
              <ArrowIcon />
            </Link>
          </div>
          <ul className="flex flex-col gap-2">
            {projects.map((project) => (
              <li
                key={`${project.year}-${project.label}`}
                className="flex items-center gap-6 rounded-lg bg-white px-5 py-3.5 shadow-sm"
              >
                <span className="shrink-0 text-sm text-zinc-500">
                  {project.year}
                </span>
                <span className="shrink-0 text-sm font-bold text-zinc-900">
                  {project.tag}
                </span>
                <span className="text-sm text-zinc-700">{project.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <div aria-hidden="true" className="relative">
        <Image
          src="/images/Frame3.png"
          alt=""
          width={2880}
          height={400}
          className="block h-auto w-full"
        />
      </div>

      <section className="bg-[#FBFBFA]  px-6 py-16 md:py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-3xl font-semibold tracking-tight text-zinc-900 md:text-4xl">
            {t("partnersTitle")}
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
            <h2 className="text-3xl font-bold tracking-tight text-zinc-900 md:text-4xl">
              {t("ctaTitle")}
            </h2>
            <p className="mt-4 max-w-md text-base leading-7 text-zinc-700">
              {t("ctaSubtitle")}
            </p>
            <Link
              href={`/${getSlug("contact", locale)}`}
              className="btn-flame mt-6 flex w-full items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:brightness-110 sm:inline-flex sm:w-auto"
            >
              {t("ctaButton")}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
