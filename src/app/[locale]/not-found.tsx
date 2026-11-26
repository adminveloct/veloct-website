import Image from "next/image";
import { getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";

export default async function NotFoundPage() {
  const t = await getTranslations("common.notFound");

  return (
    <div className="flex flex-1 items-center bg-neutral-50 px-6 py-16 md:py-24">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
        {/* Kolom Kiri: Teks & Tombol */}
        <div className="flex flex-col items-start">
          <h1 className="max-w-md text-4xl font-bold tracking-tight text-neutral-900 sm:text-5xl lg:text-[56px] lg:leading-[1.15]">
            {t("title")}
          </h1>
          <p className="mt-4 text-base text-neutral-600 md:text-lg">
            {t("description")}
          </p>
          <div className="mt-8">
            <Link
              href="/"
              className="btn-flame inline-flex items-center gap-2.5 rounded-lg px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
            >
              <span>{t("backHome")}</span>
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
    </div>
  );
}
