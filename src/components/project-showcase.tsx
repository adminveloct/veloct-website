"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

export type Project = {
  id: string;
  year: string;
  category: "ai" | "bigData" | "infrastructure" | "software";
  categoryLabel: string;
  title: string;
  sector: string;
  description?: string;
  image?: string;
};

type Props = {
  projects: Project[];
  filterLabels: {
    all: string;
    ai: string;
    bigData: string;
    infrastructure: string;
    software: string;
  };
  showMoreLabel: string;
  showLessLabel: string;
};

const CATEGORY_TAG_STYLES: Record<string, string> = {
  ai: "bg-mint-300 text-neutral-900",
  bigData: "bg-forest-700 text-white",
  infrastructure: "bg-forest-800 text-white",
  software: "bg-mint-200 text-neutral-900",
};

export default function ProjectShowcase({
  projects,
  filterLabels,
  showMoreLabel,
  showLessLabel,
}: Props) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedProjectId, setSelectedProjectId] = useState<string>(
    projects[0]?.id || ""
  );
  const [isExpanded, setIsExpanded] = useState(false);

  const filterOptions = [
    { key: "all", label: filterLabels.all },
    { key: "ai", label: filterLabels.ai },
    { key: "bigData", label: filterLabels.bigData },
    { key: "infrastructure", label: filterLabels.infrastructure },
    { key: "software", label: filterLabels.software },
  ];

  const filteredProjects = useMemo(() => {
    if (selectedCategory === "all") {
      return projects;
    }
    return projects.filter((p) => p.category === selectedCategory);
  }, [projects, selectedCategory]);

  const visibleProjects = useMemo(() => {
    if (isExpanded || filteredProjects.length <= 5) {
      return filteredProjects;
    }
    return filteredProjects.slice(0, 5);
  }, [filteredProjects, isExpanded]);

  const selectedProject = useMemo(() => {
    const found = filteredProjects.find((p) => p.id === selectedProjectId);
    return found || filteredProjects[0] || projects[0];
  }, [filteredProjects, selectedProjectId, projects]);

  return (
    <div className="mt-8">
      {/* Category Filter Buttons */}
      <div className="flex flex-wrap items-center gap-2">
        {filterOptions.map((opt) => {
          const isActive = selectedCategory === opt.key;
          return (
            <button
              key={opt.key}
              type="button"
              aria-pressed={isActive}
              onClick={() => {
                setSelectedCategory(opt.key);
                setIsExpanded(false);
              }}
              className={`min-h-[44px] rounded-lg px-4 py-2 text-xs font-semibold transition-colors md:text-sm ${
                isActive
                  ? "bg-neutral-900 text-white"
                  : "bg-neutral-100 text-neutral-900 hover:bg-neutral-200"
              }`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>

      {/* Mobile View (< lg) */}
      <div className="mt-8 flex flex-col gap-4 lg:hidden">
        {visibleProjects.map((project) => (
          <article
            key={project.id}
            className="flex flex-col items-start rounded-xl bg-neutral-100/70 p-4"
          >
            <span className="text-sm font-normal text-neutral-600">
              {project.year} · {project.categoryLabel}
            </span>
            <h3 className="mt-1 text-lg font-bold tracking-tight text-neutral-900">
              {project.title}
            </h3>
            <p className="mt-1 text-sm text-neutral-600">
              {project.sector}
            </p>
            {project.description?.trim() ? (
              <span className="mt-2 inline-block rounded-[3px] bg-neutral-100 px-2 py-0.5 text-xs text-neutral-600">
                {project.description}
              </span>
            ) : null}
          </article>
        ))}

        {filteredProjects.length > 5 && (
          <button
            type="button"
            onClick={() => setIsExpanded((prev) => !prev)}
            className="mt-2 min-h-[44px] w-full rounded-lg bg-sun-500 py-2.5 text-center text-sm font-bold text-neutral-900 transition hover:brightness-105 active:scale-[0.99]"
          >
            {isExpanded ? showLessLabel : showMoreLabel}
          </button>
        )}
      </div>

      {/* Desktop 2-Column Grid Layout (>= lg) */}
      <div className="mt-6 hidden items-start gap-8 lg:grid lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:gap-10">
        {/* Left Column: Project List */}
        <div className="flex flex-col gap-2">
          {visibleProjects.map((project) => {
            const isSelected = selectedProject?.id === project.id;
            return (
              <button
                key={project.id}
                type="button"
                aria-pressed={isSelected}
                onClick={() => setSelectedProjectId(project.id)}
                className={`flex min-h-[44px] w-full items-center justify-between gap-4 rounded-xl p-4 text-left transition-colors md:px-5 md:py-4 ${
                  isSelected
                    ? "bg-neutral-900 text-white"
                    : "bg-neutral-100 text-neutral-900 hover:bg-neutral-200"
                }`}
              >
                <div className="flex items-baseline gap-4 md:gap-6">
                  <span
                    className={`text-sm font-bold md:text-base ${
                      isSelected ? "text-white" : "text-neutral-900"
                    }`}
                  >
                    {project.year}
                  </span>
                  <div>
                    <span
                      className={`block text-sm font-bold md:text-base ${
                        isSelected ? "text-white" : "text-neutral-900"
                      }`}
                    >
                      {project.title}
                    </span>
                    <span
                      className={`mt-0.5 block text-xs ${
                        isSelected ? "text-neutral-300" : "text-neutral-600"
                      }`}
                    >
                      {project.sector}
                    </span>
                  </div>
                </div>

                <span
                  className={`shrink-0 rounded-md px-2.5 py-1 text-xs font-bold ${
                    CATEGORY_TAG_STYLES[project.category] ||
                    "bg-mint-100 text-neutral-900"
                  }`}
                >
                  {project.categoryLabel}
                </span>
              </button>
            );
          })}

          {filteredProjects.length > 5 && (
            <button
              type="button"
              onClick={() => setIsExpanded((prev) => !prev)}
              className="mt-3 min-h-[44px] w-full rounded-lg bg-sun-500 py-2.5 text-center text-sm font-bold text-neutral-900 transition hover:brightness-105 active:scale-[0.99]"
            >
              {isExpanded ? showLessLabel : showMoreLabel}
            </button>
          )}
        </div>

        {/* Right Column: Project Preview */}
        {selectedProject && (
          <div className="flex flex-col self-start">
            {selectedProject.image ? (
              <div className="relative mb-4 aspect-[16/10] w-full overflow-hidden rounded-lg bg-neutral-300">
                <Image
                  src={selectedProject.image}
                  alt={selectedProject.title}
                  fill
                  sizes="(min-width: 1024px) 45vw, 100vw"
                  className="object-cover"
                />
              </div>
            ) : null}

            <div>
              <span
                className={`inline-block rounded-md px-2.5 py-0.5 text-xs font-bold ${
                  CATEGORY_TAG_STYLES[selectedProject.category] ||
                  "bg-mint-100 text-neutral-900"
                }`}
              >
                {selectedProject.categoryLabel}
              </span>

              <h3 className="mt-2 text-xl font-bold tracking-tight text-neutral-900 md:text-2xl">
                {selectedProject.year} {selectedProject.title}
              </h3>

              <p className="mt-1 text-sm text-neutral-600">
                {selectedProject.sector}
              </p>

              {selectedProject.description?.trim() ? (
                <p className="mt-2 text-sm text-neutral-600">
                  {selectedProject.description}
                </p>
              ) : null}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
