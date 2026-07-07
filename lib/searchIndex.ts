import { LANGUAGES, LanguageId } from "./courseManifest";

export interface SearchResult {
  lang: LanguageId;
  langName: string;
  langIcon: string;
  phase: number;
  title: string;
  available: boolean;
}

let cachedIndex: SearchResult[] | null = null;
let inFlight: Promise<SearchResult[]> | null = null;

interface PhaseListResponse {
  phases: { phase: number; title: string; available: boolean }[];
}

/**
 * Builds (and caches, in memory, for this browser session) a flat list of every
 * phase across every language, using the same per-language API route the roadmap
 * page already relies on. Cached after the first call so repeated searches don't
 * re-fetch six endpoints every keystroke.
 */
async function buildSearchIndex(): Promise<SearchResult[]> {
  const results = await Promise.all(
    LANGUAGES.map(async (lang) => {
      try {
        const res = await fetch(`/api/phases/${lang.id}`);
        if (!res.ok) return [];
        const data: PhaseListResponse = await res.json();
        return data.phases.map((p) => ({
          lang: lang.id,
          langName: lang.name,
          langIcon: lang.icon,
          phase: p.phase,
          title: p.title,
          available: p.available,
        }));
      } catch {
        // If one language's endpoint fails, the rest of search should still work.
        return [];
      }
    })
  );
  return results.flat();
}

export async function getSearchIndex(): Promise<SearchResult[]> {
  if (cachedIndex) return cachedIndex;
  if (!inFlight) {
    inFlight = buildSearchIndex().then((index) => {
      cachedIndex = index;
      return index;
    });
  }
  return inFlight;
}

export async function searchPhases(query: string): Promise<SearchResult[]> {
  const trimmed = query.trim().toLowerCase();
  if (!trimmed) return [];

  const index = await getSearchIndex();
  return index
    .filter(
      (r) =>
        r.title.toLowerCase().includes(trimmed) ||
        `phase ${r.phase}`.includes(trimmed) ||
        r.langName.toLowerCase().includes(trimmed)
    )
    .slice(0, 8);
}
