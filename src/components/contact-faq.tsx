"use client";

import { useState } from "react";

export type FaqItem = {
  question: string;
  answer: string;
};

type Props = {
  title: string;
  items: FaqItem[];
};

export default function ContactFaq({ title, items }: Props) {
  const [openIndices, setOpenIndices] = useState<number[]>([]);

  const toggleIndex = (index: number) => {
    setOpenIndices((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  return (
    <section className="bg-[linear-gradient(180deg,#FCEFB8_0%,#F8E299_100%)] px-6 py-16 md:py-[120px]">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 md:grid-cols-[1fr_1.6fr] md:gap-12 lg:grid-cols-[380px_1fr] items-start">
        {/* Left Column: Title */}
        <h2 className="text-3xl font-bold tracking-tight text-[#222222] md:text-4xl lg:text-[44px] lg:leading-[52px]">
          {title}
        </h2>

        {/* Right Column: Accordion Items */}
        <div className="flex flex-col gap-4">
          {items.map((item, index) => {
            const isOpen = openIndices.includes(index);
            return (
              <div key={index} className="flex flex-col">
                {/* Question Card */}
                <button
                  type="button"
                  onClick={() => toggleIndex(index)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 rounded-xl bg-white p-5 text-left shadow-sm transition hover:opacity-95 md:px-6 md:py-5"
                >
                  <span className="text-sm font-bold text-[#222222] md:text-base">
                    {item.question}
                  </span>
                  <span
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md transition-colors ${
                      isOpen
                        ? "bg-[#F2B705] text-[#222222]"
                        : "bg-[#222222] text-white"
                    }`}
                    aria-hidden="true"
                  >
                    {isOpen ? (
                      <svg
                        className="h-4 w-4"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <line x1="5" y1="12" x2="19" y2="12" />
                      </svg>
                    ) : (
                      <svg
                        className="h-4 w-4"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                      </svg>
                    )}
                  </span>
                </button>

                {/* Answer Card (Terpisah dari card pertanyaan, dengan jeda sedikit) */}
                {isOpen && (
                  <div className="mt-2.5 rounded-xl bg-[#222222] p-5 text-sm leading-relaxed text-[#EDEDED] shadow-sm md:mt-3 md:px-6 md:py-5 md:text-base">
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
