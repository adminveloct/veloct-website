"use client";

import { useState } from "react";
import { PlusIcon, MinusIcon } from "@/components/icons";

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
    <section className="bg-linear-to-b from-sun-100 to-sun-200 px-6 py-16 md:py-[120px]">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 md:grid-cols-[1fr_1.6fr] md:gap-12 lg:grid-cols-[380px_1fr] items-start">
        {/* Left Column: Title */}
        <h2 className="text-3xl font-bold tracking-tight text-neutral-900 md:text-4xl lg:text-[44px] lg:leading-[52px]">
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
                  <span className="text-sm font-bold text-neutral-900 md:text-base">
                    {item.question}
                  </span>
                  <span
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md transition-colors ${
                      isOpen
                        ? "bg-sun-500 text-neutral-900"
                        : "bg-neutral-900 text-white"
                    }`}
                    aria-hidden="true"
                  >
                    {isOpen ? (
                      <MinusIcon size={16} />
                    ) : (
                      <PlusIcon size={16} />
                    )}
                  </span>
                </button>

                {/* Answer Card (Terpisah dari card pertanyaan, dengan jeda sedikit) */}
                {isOpen && (
                  <div className="mt-2.5 rounded-xl bg-neutral-900 p-5 text-sm leading-relaxed text-neutral-100 shadow-sm md:mt-3 md:px-6 md:py-5 md:text-base">
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
