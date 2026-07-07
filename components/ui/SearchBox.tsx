"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { searchPhases, SearchResult } from "@/lib/searchIndex";

export default function SearchBox({ onNavigate }: { onNavigate?: () => void }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!query.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    debounceRef.current = setTimeout(async () => {
      const r = await searchPhases(query);
      setResults(r);
      setActiveIndex(-1);
      setLoading(false);
    }, 150);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function goTo(result: SearchResult) {
    if (!result.available) return;
    router.push(`/${result.lang}/${result.phase}`);
    setOpen(false);
    setQuery("");
    onNavigate?.();
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Escape") {
      setOpen(false);
      return;
    }
    if (!open || results.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % results.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => (i - 1 + results.length) % results.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeIndex >= 0 && results[activeIndex]) goTo(results[activeIndex]);
    }
  }

  return (
    <div ref={containerRef} className="relative w-full sm:w-64">
      <label htmlFor="global-search" className="sr-only">
        Search all lessons across every language
      </label>
      <input
        id="global-search"
        type="search"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={handleKeyDown}
        placeholder="Search all lessons…"
        role="combobox"
        aria-expanded={open}
        aria-controls="global-search-results"
        aria-activedescendant={activeIndex >= 0 ? `search-result-${activeIndex}` : undefined}
        autoComplete="off"
        className="w-full bg-white/5 border border-white/15 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-gold-500 transition"
      />

      {open && query.trim() && (
        <div
          id="global-search-results"
          role="listbox"
          className="absolute z-50 mt-2 w-full sm:w-80 right-0 card overflow-hidden max-h-80 overflow-y-auto"
        >
          {loading ? (
            <p className="px-4 py-3 text-sm text-white/50">Searching…</p>
          ) : results.length === 0 ? (
            <p className="px-4 py-3 text-sm text-white/50">No lessons match &ldquo;{query}&rdquo;.</p>
          ) : (
            results.map((r, i) => (
              <button
                key={`${r.lang}-${r.phase}`}
                id={`search-result-${i}`}
                role="option"
                aria-selected={activeIndex === i}
                disabled={!r.available}
                onClick={() => goTo(r)}
                onMouseEnter={() => setActiveIndex(i)}
                className={`w-full flex items-center gap-3 text-left px-4 py-2.5 text-sm transition ${
                  activeIndex === i ? "bg-gold-500/10" : "hover:bg-white/5"
                } ${!r.available ? "opacity-40 cursor-not-allowed" : ""}`}
              >
                <span aria-hidden="true">{r.langIcon}</span>
                <span className="flex-1 min-w-0">
                  <span className="block truncate">
                    Phase {r.phase}: {r.title}
                  </span>
                  <span className="block text-xs text-white/40">
                    {r.langName}
                    {!r.available && " · coming soon"}
                  </span>
                </span>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
