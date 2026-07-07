"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getLanguage, LanguageId } from "@/lib/courseManifest";
import { isPhaseCompleted, isPhaseUnlocked, loadProgress } from "@/lib/progress";
import { SkeletonList } from "@/components/ui/Skeleton";
import EmptyState from "@/components/ui/EmptyState";

interface PhaseListItem {
  phase: number;
  title: string;
  available: boolean;
  isFallback: boolean;
  estimatedTime?: string;
}

type FilterKey = "all" | "completed" | "incomplete" | "locked" | "unlocked";

export default function LanguageRoadmap() {
  const params = useParams();
  const langId = params.lang as LanguageId;
  const lang = getLanguage(langId);

  const [phases, setPhases] = useState<PhaseListItem[] | null>(null);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<FilterKey>("all");

  useEffect(() => {
    setPhases(null);
    fetch(`/api/phases/${langId}`)
      .then((r) => r.json())
      .then((d) => setPhases(d.phases ?? []));
  }, [langId]);

  const state = loadProgress();

  const filtered = useMemo(() => {
    if (!phases) return [];
    return phases.filter((p) => {
      const completed = isPhaseCompleted(state, langId, p.phase);
      const unlocked = isPhaseUnlocked(state, langId, p.phase);
      if (query && !p.title.toLowerCase().includes(query.toLowerCase()) && !`phase ${p.phase}`.includes(query.toLowerCase())) {
        return false;
      }
      switch (filter) {
        case "completed":
          return completed;
        case "incomplete":
          return !completed;
        case "locked":
          return !unlocked;
        case "unlocked":
          return unlocked;
        default:
          return true;
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phases, query, filter]);

  if (!lang) return <p>Unknown language.</p>;

  const FILTERS: { key: FilterKey; label: string }[] = [
    { key: "all", label: "All" },
    { key: "unlocked", label: "Unlocked" },
    { key: "completed", label: "Completed" },
    { key: "incomplete", label: "Incomplete" },
    { key: "locked", label: "Locked" },
  ];

  return (
    <div>
      <div className="mb-8">
        <p className="text-white/50 text-sm mb-1">Course</p>
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <span>{lang.icon}</span> {lang.name}
        </h1>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search phases by title or number…"
          aria-label="Search phases"
          className="flex-1 bg-white/5 border border-white/15 rounded-lg px-4 py-2 outline-none focus:border-gold-500 text-sm"
        />
        <div className="flex gap-2 overflow-x-auto">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition ${
                filter === f.key ? "bg-gold-500 text-navy-950" : "bg-white/5 text-white/60 hover:bg-white/10"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {phases === null ? (
        <SkeletonList count={6} />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon="🔍"
          title="No phases match this filter"
          description="Try a different search term or switch back to All."
          action={
            <button className="btn-secondary" onClick={() => { setQuery(""); setFilter("all"); }}>
              Clear filters
            </button>
          }
        />
      ) : (
        <div className="space-y-3">
          {filtered.map((p) => {
            const completed = isPhaseCompleted(state, langId, p.phase);
            const unlocked = isPhaseUnlocked(state, langId, p.phase);
            const clickable = unlocked && p.available;

            return (
              <Link
                key={p.phase}
                href={clickable ? `/${langId}/${p.phase}` : "#"}
                className={`card flex items-center justify-between p-4 ${
                  clickable ? "card-hover" : "opacity-50 pointer-events-none"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
                      completed
                        ? "bg-emerald-500/20 text-emerald-400"
                        : unlocked
                        ? "bg-gold-500/20 text-gold-400"
                        : "bg-white/5 text-white/30"
                    }`}
                  >
                    {completed ? "✓" : unlocked ? p.phase : "🔒"}
                  </div>
                  <div>
                    <p className="font-medium">
                      Phase {p.phase}: {p.title}
                    </p>
                    {!p.available && (
                      <p className="text-xs text-amber-400/80">Content coming soon</p>
                    )}
                    {p.isFallback && (
                      <p className="text-xs text-red-400/80">⚠ Placeholder content — needs authoring</p>
                    )}
                    {!unlocked && (
                      <p className="text-xs text-white/40">Complete the previous topic to unlock this lesson.</p>
                    )}
                  </div>
                </div>
                {completed && <span className="text-xs text-emerald-400 font-semibold">COMPLETED</span>}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
