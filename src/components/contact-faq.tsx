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
              <div
                key={index}
                className={`overflow-hidden rounded-2xl shadow-[0px_4px_12px_0px_rgba(0,0,0,0.08)] transition-[translate,transform,box-shadow,background-color] duration-300 ease-out hover:-translate-y-1.5 hover:shadow-[0px_10px_20px_0px_rgba(0,0,0,0.25)] ${
                  isOpen
                    ? "bg-neutral-900 text-white"
                    : "bg-neutral-50 text-neutral-900"
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleIndex(index)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 p-5 text-left transition-colors duration-300 ease-out md:px-6 md:py-5"
                >
                  <span
                    className={`text-sm font-bold transition-colors duration-300 ease-out md:text-base ${
                      isOpen ? "text-white" : "text-neutral-900"
                    }`}
                  >
                    {item.question}
                  </span>
                  <span
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-sm transition-all duration-300 ease-out ${
                      isOpen
                        ? "rotate-180 bg-sun-500 text-neutral-900"
                        : "rotate-0 bg-neutral-900 text-white"
                    }`}
                    aria-hidden="true"
                  >
                    {isOpen ? (
                      <MinusIcon
                        size={16}
                        className="transition-transform duration-300 ease-out"
                      />
                    ) : (
                      <PlusIcon
                        size={16}
                        className="transition-transform duration-300 ease-out"
                      />
                    )}
                  </span>
                </button>

                <div
                  className={`grid transition-all duration-300 ease-out ${
                    isOpen
                      ? "grid-rows-[1fr] opacity-100"
                      : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="px-5 pb-5 pt-0 text-sm leading-relaxed text-neutral-200 md:px-6 md:pb-6 md:text-base">
                      {item.answer}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
