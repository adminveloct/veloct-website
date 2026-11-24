import React from "react";
import { Heading, type HeadingLevel } from "@/components/ui/heading";

export interface SectionHeaderProps {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  align?: "left" | "center";
  className?: string;
  level?: HeadingLevel;
  as?: `h${HeadingLevel}`;
}

export function SectionHeader({
  title,
  subtitle,
  align = "center",
  className = "",
  level = 2,
  as,
}: SectionHeaderProps) {
  const alignClass = align === "center" ? "text-center items-center" : "text-left items-start";

  return (
    <div className={`flex flex-col ${alignClass} ${className}`}>
      <Heading level={level} as={as}>
        {title}
      </Heading>
      {subtitle && (
        <p className="mt-4 max-w-2xl text-base leading-7 text-neutral-600 md:text-lg">
          {subtitle}
        </p>
      )}
    </div>
  );
}
