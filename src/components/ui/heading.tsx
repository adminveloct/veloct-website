import React from "react";

export type HeadingLevel = 1 | 2 | 3 | 4;

export interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  level?: HeadingLevel;
  as?: `h${HeadingLevel}`;
}

export function Heading({
  level = 2,
  as,
  className = "",
  children,
  ...props
}: HeadingProps) {
  const Component = as || (`h${level}` as const);

  const levelStyles: Record<HeadingLevel, string> = {
    1: "text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl lg:text-[40px] lg:leading-tight",
    2: "text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl lg:text-[32px] lg:leading-snug",
    3: "text-xl font-bold tracking-tight text-neutral-900 sm:text-2xl",
    4: "text-lg font-bold tracking-tight text-neutral-900",
  };

  return (
    <Component
      className={`${levelStyles[level]} ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
}
