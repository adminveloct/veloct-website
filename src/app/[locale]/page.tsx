import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { Link } from "@/i18n/navigation";
import { getSlug } from "@/i18n/pages";
import { Container } from "@/components/ui/container";
import { Hero } from "@/components/sections/hero";
import { CtaClosing } from "@/components/sections/cta-closing";
import { ArrowRightIcon } from "@/components/icons";

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
      <Hero
        title={t.rich("heading", {
          bold: (chunks) => <strong className="font-bold">{chunks}</strong>,
        })}
        description={t.rich("description", {
          bold: (chunks) => <strong className="font-semibold">{chunks}</strong>,
        })}
        ctaText={t("button")}
        ctaHref={`/${getSlug("services-products", locale)}`}
        imageSrc="/images/hero.png"
        imageAlt={t("heroImageAlt")}
        scrollHintText={t("scrollHint")}
        scrollHintHref={`#${servicesSectionId}`}
      />

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
        className="bg-linear-to-b from-mint via-mint to-mint-50 py-16 md:py-20"
      >
        <Container size="default">
          <h2 className="text-center text-3xl font-semibold tracking-tight text-neutral-900 md:text-4xl">
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
                <h3 className="mt-4 text-center text-lg font-bold text-neutral-900 md:text-xl">
                  {t(`services.${key}`)}
                </h3>
                <p className="mt-3 flex-1 text-center text-sm leading-6 text-neutral-600">
                  {t.rich(`serviceDescriptions.${key}`, {
                    medium: (chunks) => (
                      <span className="font-medium text-neutral-900">{chunks}</span>
                    ),
                    bold: (chunks) => (
                      <span className="font-medium text-neutral-900">{chunks}</span>
                    ),
                  })}
                </p>
                <span className="mt-4 flex w-full items-center justify-center gap-3 rounded-full bg-mint-100 px-4 py-2 text-sm font-medium text-neutral-900 transition-colors group-hover:bg-forest-600 group-hover:text-white">
                  {t("serviceCardCta")}
                  <ArrowRightIcon size={18} />
                </span>
              </Link>
            ))}
          </div>
        </Container>
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

      <section className="bg-sun py-16 md:py-20">
        <Container size="default" className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight text-neutral-900 md:text-4xl">
              {t("workTitle")}
            </h2>
            <p className="mt-4 max-w-md text-base leading-7 text-neutral-700">
              {t.rich("workSubtitle", {
                bold: (chunks) => <strong className="font-bold">{chunks}</strong>,
              })}
            </p>
            <Link
              href={`/${getSlug("services-products", locale)}#${locale === "id" ? "proyek" : "projects"}`}
              className="btn-flame mt-6 flex w-full items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:brightness-110 sm:inline-flex sm:w-auto"
            >
              {t("workCta")}
              <ArrowRightIcon size={18} />
            </Link>
          </div>
          <ul className="flex flex-col gap-2">
            {projects.map((project) => (
              <li
                key={`${project.year}-${project.label}`}
                className="flex items-center gap-6 rounded-lg bg-white px-5 py-3.5 shadow-sm"
              >
                <span className="shrink-0 text-sm text-neutral-500">
                  {project.year}
                </span>
                <span className="shrink-0 text-sm font-bold text-neutral-900">
                  {project.tag}
                </span>
                <span className="text-sm text-neutral-700">{project.label}</span>
              </li>
            ))}
          </ul>
        </Container>
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

      <section className="bg-neutral-50 py-16 md:py-20">
        <Container size="default">
          <h2 className="text-center text-3xl font-semibold tracking-tight text-neutral-900 md:text-4xl">
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
        </Container>
      </section>

      <CtaClosing
        title={t("ctaTitle")}
        subtitle={t("ctaSubtitle")}
        ctaText={t("ctaButton")}
        ctaHref={`/${getSlug("contact", locale)}`}
        imageSrc="/images/elemen-callNow.png"
      />
    </div>
  );
}
