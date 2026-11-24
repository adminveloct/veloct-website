import React from "react";

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  variant?: "default" | "muted" | "gradient" | "none";
}

export function Section({
  variant = "default",
  className = "",
  children,
  ...props
}: SectionProps) {
  const variantStyles = {
    none: "",
    default: "bg-neutral-50",
    muted: "bg-white",
    gradient: "bg-linear-to-r from-neutral-50 to-neutral-400/25",
  };

  return (
    <section
      className={`w-full py-12 md:py-16 ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </section>
  );
}
