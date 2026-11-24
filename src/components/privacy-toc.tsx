"use client";

import { useEffect, useRef, useState } from "react";

export type TocSection = {
  id: string;
  title: string;
};

type Props = {
  heading: string;
  sections: TocSection[];
};

export default function PrivacyToc({ heading, sections }: Props) {
  const [activeId, setActiveId] = useState<string>(sections[0]?.id || "");

  const isManualScrolling = useRef(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!sections.length) return;

    const handleScroll = () => {
      if (isManualScrolling.current) return;

      // If user scrolled to near bottom of page, activate the last section
      const isBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 80;

      if (isBottom) {
        setActiveId(sections[sections.length - 1].id);
        return;
      }

      let currentActive = sections[0].id;
      for (const section of sections) {
        const el = document.getElementById(section.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 180) {
            currentActive = section.id;
          }
        }
      }
      setActiveId(currentActive);
    };

    // Check hash and initial position after hydration completes
    const rafId = requestAnimationFrame(() => {
      if (window.location.hash) {
        const hashId = window.location.hash.replace("#", "");
        if (sections.some((s) => s.id === hashId)) {
          setActiveId(hashId);
          return;
        }
      }
      handleScroll();
    });

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("hashchange", handleScroll, { passive: true });

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("hashchange", handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [sections]);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    setActiveId(id);

    const el = document.getElementById(id);
    if (el) {
      isManualScrolling.current = true;
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      const yOffset = -112; // navbar height + breathing room offset
      const targetY = el.getBoundingClientRect().top + window.scrollY + yOffset;

      window.scrollTo({
        top: Math.max(0, targetY),
        behavior: "smooth",
      });

      window.history.pushState(null, "", `#${id}`);

      scrollTimeoutRef.current = setTimeout(() => {
        isManualScrolling.current = false;
      }, 700);
    }
  };

  return (
    <aside className="hidden lg:block">
      <nav aria-label={heading} className="sticky top-28">
        <div className="flex flex-col">
          {sections.map((section) => {
            const isActive = activeId === section.id;
            return (
              <div
                key={section.id}
                className="relative flex items-center py-1.5"
              >
                <span
                  aria-hidden="true"
                  className={`absolute left-[7px] top-0 bottom-0 w-px bg-[#D5D5D5] transition-opacity duration-300 ease-in-out ${
                    isActive ? "opacity-0" : "opacity-100"
                  }`}
                />
                <a
                  href={`#${section.id}`}
                  onClick={(e) => handleClick(e, section.id)}
                  className={`block text-xs transition-all duration-300 ease-in-out ${
                    isActive
                      ? "pl-0 font-bold text-[#222222]"
                      : "pl-[18px] text-[#555555] hover:font-bold hover:text-[#222222]"
                  }`}
                >
                  {section.title}
                </a>
              </div>
            );
          })}
        </div>
      </nav>
    </aside>
  );
}

