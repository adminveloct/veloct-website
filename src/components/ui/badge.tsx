import React from "react";

export type BadgeVariant = "neutral" | "red" | "flame" | "mint" | "sun";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

export function Badge({
  variant = "neutral",
  className = "",
  children,
  ...props
}: BadgeProps) {
  const variantStyles: Record<BadgeVariant, string> = {
    neutral: "bg-neutral-100 text-neutral-600",
    red: "bg-red-100 text-red-700",
    flame: "bg-red-100 text-red-700",
    mint: "bg-mint-100 text-forest-800",
    sun: "bg-sun-100 text-neutral-900",
  };

  return (
    <span
      className={`inline-flex items-center rounded-sm px-2 py-0.5 text-xs font-medium ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}
