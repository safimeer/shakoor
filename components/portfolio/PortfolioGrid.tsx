"use client";

import { useState } from "react";
import { portfolioCategories } from "@/data/portfolio";
import { ProjectCard, type ProjectCardData } from "./ProjectCard";

export function PortfolioGrid({ items }: { items: ProjectCardData[] }) {
  const [filter, setFilter] = useState<(typeof portfolioCategories)[number]["id"]>("all");
  const visible = filter === "all" ? items : items.filter((p) => p.category === filter);

  return (
    <div>
      <div role="group" aria-label="Filter projects by category" className="flex flex-wrap gap-2">
        {portfolioCategories.map((c) => {
          const active = filter === c.id;
          const count = c.id === "all" ? items.length : items.filter((p) => p.category === c.id).length;
          return (
            <button
              key={c.id}
              type="button"
              aria-pressed={active}
              onClick={() => setFilter(c.id)}
              className={`min-h-11 cursor-pointer rounded-xl border px-4 text-sm font-semibold transition-colors ${
                active ? "border-blue bg-blue text-white" : "border-line-light bg-white text-slate-ink hover:border-blue/50 hover:text-ink"
              }`}
            >
              {c.label} <span className={active ? "text-white/75" : "text-slate-ink/70"}>({count})</span>
            </button>
          );
        })}
      </div>
      <p className="sr-only" aria-live="polite">
        Showing {visible.length} {visible.length === 1 ? "project" : "projects"}
      </p>
      {visible.length > 0 ? (
        <ul className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {visible.map((p) => (
            <li key={p.slug}>
              <ProjectCard project={p} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-10 rounded-[var(--radius-card)] border border-dashed border-line-light bg-white p-10 text-center">
          <p className="font-semibold text-ink">No projects in this category yet.</p>
          <button type="button" onClick={() => setFilter("all")} className="mt-3 min-h-11 cursor-pointer font-semibold text-blue">
            Show all work
          </button>
        </div>
      )}
    </div>
  );
}
