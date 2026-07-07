export type LanguageId = "html" | "c" | "cpp" | "python" | "js" | "java";

export interface LanguageInfo {
  id: LanguageId;
  name: string;
  color: string; // tailwind gradient classes
  icon: string; // emoji fallback, swap for real icon later
  totalPhases: number;
}

// NOTE: totalPhases reflects your current dataset. Update as you add more phase JSON files.
export const LANGUAGES: LanguageInfo[] = [
  { id: "html", name: "HTML & CSS", color: "from-orange-500 to-pink-500", icon: "🌐", totalPhases: 15 },
  { id: "c", name: "C", color: "from-blue-600 to-cyan-500", icon: "🔧", totalPhases: 21 },
  { id: "cpp", name: "C++", color: "from-indigo-600 to-blue-500", icon: "⚙️", totalPhases: 15 },
  { id: "python", name: "Python", color: "from-yellow-500 to-green-500", icon: "🐍", totalPhases: 14 },
  { id: "js", name: "JavaScript", color: "from-yellow-400 to-amber-500", icon: "⚡", totalPhases: 15 },
  { id: "java", name: "Java", color: "from-red-500 to-orange-600", icon: "☕", totalPhases: 15 },
];

export function getLanguage(id: string): LanguageInfo | undefined {
  return LANGUAGES.find((l) => l.id === id);
}

// Total topics across the whole course = sum of all phases (1 phase = 1 topic for locking purposes).
// If you later split a phase into multiple "topics" (e.g. concept / examples / quiz as separate
// unlockable steps), change TOPICS_PER_PHASE accordingly and update lib/progress.ts.
export const TOPICS_PER_PHASE = 1;

export function totalTopicsInCourse(): number {
  return LANGUAGES.reduce((sum, l) => sum + l.totalPhases * TOPICS_PER_PHASE, 0);
}

export function totalPhasesInCourse(): number {
  return LANGUAGES.reduce((sum, l) => sum + l.totalPhases, 0);
}
