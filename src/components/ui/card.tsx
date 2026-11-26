import React from "react";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "outline" | "flat";
}

export function Card({
  variant = "default",
  className = "",
  children,
  ...props
}: CardProps) {
  const variantStyles = {
    default: "bg-white shadow-[0_4px_24px_rgba(0,0,0,0.06)]",
    outline: "border border-neutral-200 bg-white",
    flat: "bg-neutral-100",
  };

  return (
    <div
      className={`rounded-xl p-6 md:p-8 ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
