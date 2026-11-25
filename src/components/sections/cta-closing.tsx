import React from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/container";

export interface CtaClosingProps {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  ctaText: string;
  ctaHref: string;
  imageSrc?: string;
  imageAlt?: string;
}

export function CtaClosing({
  title,
  subtitle,
  ctaText,
  ctaHref,
  imageSrc = "/images/elemen-callNow.png",
  imageAlt = "Call Now Illustration",
}: CtaClosingProps) {
  return (
    <section className="bg-linear-to-r from-neutral-50 to-neutral-400/25 pt-10 pb-30">
      <Container size="default" className="grid items-center gap-10 lg:grid-cols-2">
        <div className="flex justify-center lg:justify-start">
          <Image
            src={imageSrc}
            alt={imageAlt}
            width={644}
            height={470}
            sizes="(min-width: 768px) 384px, 90vw"
            className="h-auto w-full max-w-sm"
          />
        </div>
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-neutral-900 md:text-4xl">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-4 max-w-md text-base leading-7 text-neutral-700">
              {subtitle}
            </p>
          )}
          <Link
            href={ctaHref}
            className="btn-flame mt-6 flex w-full items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:brightness-110 sm:inline-flex sm:w-auto"
          >
            {ctaText}
          </Link>
        </div>
      </Container>
    </section>
  );
}
