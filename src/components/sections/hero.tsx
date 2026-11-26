import React from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/container";
import { ArrowRightIcon, ArrowDownIcon } from "@/components/icons";

export interface HeroProps {
  title: React.ReactNode;
  description: React.ReactNode;
  ctaText?: string;
  ctaHref?: string;
  imageSrc?: string;
  imageAlt?: string;
  scrollHintText?: string;
  scrollHintHref?: string;
  children?: React.ReactNode;
}

export function Hero({
  title,
  description,
  ctaText,
  ctaHref,
  imageSrc = "/images/hero.png",
  imageAlt = "Hero Illustration",
  scrollHintText,
  scrollHintHref,
  children,
}: HeroProps) {
  return (
    <section className="bg-linear-to-b from-blush via-blush to-blush-deep/80 pb-14 pt-12 md:pt-16">
      <Container size="default" className="grid items-center gap-10 lg:grid-cols-2">
        <div className="max-w-xl">
          <h1 className="text-4xl font-normal leading-tight tracking-tight text-neutral-900 md:text-5xl">
            {title}
          </h1>
          <div className="mt-5 text-lg leading-8 text-neutral-700">
            {description}
          </div>
          {ctaText && ctaHref && (
            <Link
              href={ctaHref}
              className="btn-flame mt-8 flex h-14 w-full items-center justify-center gap-2 rounded-lg px-5 text-base font-semibold text-white shadow-sm transition hover:brightness-110 sm:inline-flex sm:w-auto"
            >
              {ctaText}
              <ArrowRightIcon size={18} />
            </Link>
          )}
          {children}
        </div>

        <div className="ml-auto w-full max-w-sm md:max-w-md">
          <Image
            src={imageSrc}
            alt={imageAlt}
            priority
            fetchPriority="high"
            quality={80}
            width={921}
            height={1080}
            sizes="(min-width: 768px) 448px, 384px"
            className="block h-auto w-full"
          />
        </div>
      </Container>

      {scrollHintText && scrollHintHref && (
        <div className="mt-12 flex justify-center">
          <a
            href={scrollHintHref}
            className="inline-flex items-center gap-2 rounded-full bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-black"
          >
            {scrollHintText}
            <ArrowDownIcon size={18} />
          </a>
        </div>
      )}
    </section>
  );
}
