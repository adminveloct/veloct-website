import type { Metadata } from "next";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import SiteFooter from "@/components/site-footer";
import SiteHeader from "@/components/site-header";
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
    title: "VeloCT",
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
    <html lang={locale} className="h-full antialiased">
      <link
        rel="stylesheet"
        href="https://api.fontshare.com/v2/css?f[]=general-sans@400,500,600,700&display=swap"
        precedence="default"
      />
      <body className="min-h-full flex flex-col">
        <NextIntlClientProvider messages={messages}>
          <SiteHeader locale={locale} />
          <main className="flex flex-1 flex-col">{children}</main>
          <SiteFooter locale={locale} />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
