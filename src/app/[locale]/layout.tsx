import type { Metadata } from "next";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import SiteFooter from "@/components/site-footer";
import SiteHeader from "@/components/site-header";
import PageTransition from "@/components/page-transition";
import { routing } from "@/i18n/routing";

import "../globals.css";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    metadataBase: new URL(
      process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
    ),
    title: {
      default: "VeloCT",
      template: "%s",
    },
    icons: {
      icon: [
        { url: "/favicon.ico" },
        { url: "/icon.png", type: "image/png" },
      ],
      apple: [{ url: "/apple-icon.png" }],
    },
    openGraph: {
      siteName: "VeloCT",
      type: "website",
      images: [
        {
          url: "/images/og-image.png",
          width: 2838,
          height: 1440,
          alt: "VeloCT — Konsultan AI dan Data untuk Pemerintah dan Industri",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      images: ["/images/og-image.png"],
    },
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);

  const messages = await getMessages({ locale });

  return (
    <html
      lang={locale}
      className="h-full antialiased"
      data-scroll-behavior="smooth"
    >
      <link
        rel="preconnect"
        href="https://api.fontshare.com"
        crossOrigin="anonymous"
      />
      <link
        rel="preconnect"
        href="https://cdn.fontshare.com"
        crossOrigin="anonymous"
      />
      <link
        rel="stylesheet"
        href="https://api.fontshare.com/v2/css?f[]=general-sans@400,500,600,700&display=swap"
        precedence="default"
      />
      <body className="min-h-full flex flex-col">
        <NextIntlClientProvider messages={messages}>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-neutral-900 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white focus:shadow-lg"
          >
            {locale === "id" ? "Langsung ke konten utama" : "Skip to main content"}
          </a>
          <SiteHeader locale={locale} />
          <main id="main-content" className="flex flex-1 flex-col">
            <PageTransition>{children}</PageTransition>
          </main>
          <SiteFooter locale={locale} />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
