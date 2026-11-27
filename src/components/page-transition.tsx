"use client";

import React from "react";
import { usePathname } from "@/i18n/navigation";

export default function PageTransition({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div key={pathname} className="flex flex-1 flex-col animate-page-enter">
      {children}
    </div>
  );
}
