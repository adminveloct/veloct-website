import Image from "next/image";
import { headers } from "next/headers";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";

import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import { routing } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import "./globals.css";

export default async function GlobalNotFound() {
  const headerStore = await headers();
  const requestedLocale = headerStore.get("x-next-intl-locale");
  const locale = hasLocale(routing.locales, requestedLocale)
    ? requestedLocale
    : routing.defaultLocale;

  setRequestLocale(locale);
  const messages = await getMessages({ locale });
  const notFound = (
    messages.common as {
      notFound?: {
        title: string;
        description: string;
        backHome: string;
      };
    }
  )?.notFound || {
    title: "Halaman tidak ditemukan",
    description: "Alamat yang Anda buka tidak tersedia.",
    backHome: "Ke Beranda",
  };

  return (
    <html
      lang={locale}
      className="h-full antialiased"
      data-scroll-behavior="smooth"
    >
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{`${notFound.title} | VeloCT`}</title>
        <meta name="robots" content="noindex" />
        <link
          rel="stylesheet"
          href="https://api.fontshare.com/v2/css?f[]=general-sans@400,500,600,700&display=swap"
          precedence="default"
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#FBFBFA]">
        <NextIntlClientProvider messages={messages}>
          <SiteHeader locale={locale} />
          <main className="flex flex-1 flex-col items-center justify-center bg-[#FBFBFA] px-6 py-16 md:py-24">
            <div className="mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
              {/* Kolom Kiri: Teks & Tombol */}
              <div className="flex flex-col items-start">
                <h1 className="max-w-md text-4xl font-bold tracking-tight text-[#222222] sm:text-5xl lg:text-[56px] lg:leading-[1.15]">
                  {notFound.title}
                </h1>
                <p className="mt-4 text-base text-[#555555] md:text-lg">
                  {notFound.description}
                </p>
                <div className="mt-8">
                  <Link
                    href="/"
                    className="btn-flame inline-flex items-center gap-2.5 rounded-lg px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
                  >
                    <span>{notFound.backHome}</span>
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>

              {/* Kolom Kanan: Ilustrasi 404 */}
              <div className="flex justify-center lg:justify-end">
                <Image
                  src="/images/elemen-404.png"
                  alt="404 Illustration"
                  width={600}
                  height={555}
                  priority
                  className="h-auto w-full max-w-md object-contain lg:max-w-lg"
                />
              </div>
            </div>
          </main>
          <SiteFooter locale={locale} />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
