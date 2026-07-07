import { LANGUAGES, LanguageId, totalPhasesInCourse } from "./courseManifest";

const STORAGE_KEY = "coding-tutor:progress:v1";

export interface ActivityEntry {
  lang: LanguageId;
  phase: number;
  completedAt: string; // ISO
}

export interface LanguageCertificate {
  lang: LanguageId;
  certificateId: string;
  issuedAt: string; // ISO
  studentName: string;
}

export interface ProgressState {
  // "html:3" -> true  means phase 3 of html is completed
  completed: Record<string, boolean>;
  studentName?: string;
  /** @deprecated kept for backward compatibility with earlier single-certificate builds */
  certificateId?: string;
  /** @deprecated kept for backward compatibility with earlier single-certificate builds */
  certificateIssuedAt?: string;
  /** One certificate per completed language, keyed by language id. */
  certificates?: Partial<Record<LanguageId, LanguageCertificate>>;
  activity?: ActivityEntry[];
  visitDates?: string[]; // "YYYY-MM-DD", for streak tracking
}

function emptyState(): ProgressState {
  return { completed: {} };
}

export function loadProgress(): ProgressState {
  if (typeof window === "undefined") return emptyState();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyState();
    const parsed = JSON.parse(raw);
    return { completed: parsed.completed ?? {}, ...parsed };
  } catch {
    return emptyState();
  }
}

export function saveProgress(state: ProgressState) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function key(lang: LanguageId, phase: number) {
  return `${lang}:${phase}`;
}

export function isPhaseCompleted(state: ProgressState, lang: LanguageId, phase: number): boolean {
  return Boolean(state.completed[key(lang, phase)]);
}

/**
 * The core "locked learning path" rule:
 * - Phase 1 of every language is always unlocked, independent of any other language.
 * - Phase N (N > 1) of a language is unlocked only if phase N-1 of that SAME language
 *   is completed.
 * - Completing (or not completing) one language has no effect on any other language.
 */
export function isPhaseUnlocked(state: ProgressState, langId: LanguageId, phase: number): boolean {
  const lang = LANGUAGES.find((l) => l.id === langId);
  if (!lang) return false;

  if (phase <= 1) return true;
  return isPhaseCompleted(state, langId, phase - 1);
}

export function isLanguageCompleted(state: ProgressState, langId: LanguageId): boolean {
  const lang = LANGUAGES.find((l) => l.id === langId);
  if (!lang) return false;
  for (let p = 1; p <= lang.totalPhases; p++) {
    if (!isPhaseCompleted(state, langId, p)) return false;
  }
  return true;
}

export function markPhaseCompleted(langId: LanguageId, phase: number): ProgressState {
  const state = loadProgress();
  const already = state.completed[key(langId, phase)];
  state.completed[key(langId, phase)] = true;
  if (!already) {
    const activity = state.activity ?? [];
    activity.push({ lang: langId, phase, completedAt: new Date().toISOString() });
    state.activity = activity.slice(-200); // keep it bounded
  }
  saveProgress(state);
  recordVisitToday();
  return state;
}

/** Call once per session (e.g. on dashboard/home load) to track daily streaks. */
export function recordVisitToday(): ProgressState {
  const state = loadProgress();
  const today = new Date().toISOString().slice(0, 10);
  const visits = state.visitDates ?? [];
  if (visits[visits.length - 1] !== today) {
    visits.push(today);
    state.visitDates = visits.slice(-400);
    saveProgress(state);
  }
  return state;
}

/** Current consecutive-day streak, counting today or yesterday as still "alive". */
export function getCurrentStreak(state: ProgressState): number {
  const visits = state.visitDates ?? [];
  if (visits.length === 0) return 0;
  const dates = new Set(visits);
  let streak = 0;
  const cursor = new Date();
  // If today has no visit yet, still allow yesterday to start the count.
  if (!dates.has(cursor.toISOString().slice(0, 10))) {
    cursor.setDate(cursor.getDate() - 1);
  }
  while (dates.has(cursor.toISOString().slice(0, 10))) {
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  earned: boolean;
}

export function getAchievements(state: ProgressState): Achievement[] {
  const completedCount = Object.values(state.completed).filter(Boolean).length;
  const stats = getOverallStats();
  const streak = getCurrentStreak(state);

  return [
    {
      id: "first-step",
      title: "First Step",
      description: "Complete your first phase",
      icon: "🌱",
      earned: completedCount >= 1,
    },
    {
      id: "five-phases",
      title: "Building Momentum",
      description: "Complete 5 phases",
      icon: "🔥",
      earned: completedCount >= 5,
    },
    {
      id: "first-language",
      title: "Language Mastered",
      description: "Fully complete one language",
      icon: "🏆",
      earned: stats.perLanguage.some((p) => p.percent === 100),
    },
    {
      id: "streak-3",
      title: "Consistent Learner",
      description: "3-day learning streak",
      icon: "📅",
      earned: streak >= 3,
    },
    {
      id: "course-complete",
      title: "Full-Stack Graduate",
      description: "Complete every language",
      icon: "🎓",
      earned: stats.isCourseCompleted,
    },
  ];
}

export function getOverallStats() {
  const state = loadProgress();
  const totalPhases = totalPhasesInCourse();
  let completedPhases = 0;
  const perLanguage = LANGUAGES.map((lang) => {
    let done = 0;
    for (let p = 1; p <= lang.totalPhases; p++) {
      if (isPhaseCompleted(state, lang.id, p)) done++;
    }
    completedPhases += done;
    return { lang, done, total: lang.totalPhases, percent: Math.round((done / lang.totalPhases) * 100) };
  });

  const percent = totalPhases === 0 ? 0 : Math.round((completedPhases / totalPhases) * 100);

  return {
    totalPhases,
    completedPhases,
    percent,
    perLanguage,
    isCourseCompleted: completedPhases === totalPhases,
  };
}

export function getNextUnlockedPhase(langId: LanguageId): number {
  const state = loadProgress();
  const lang = LANGUAGES.find((l) => l.id === langId);
  if (!lang) return 1;
  for (let p = 1; p <= lang.totalPhases; p++) {
    if (!isPhaseCompleted(state, langId, p)) return p;
  }
  return lang.totalPhases; // all done, land on last
}

function generateCertificateId(langId: LanguageId): string {
  return `CT-${langId.toUpperCase()}-${Date.now().toString(36).toUpperCase()}-${Math.floor(
    Math.random() * 9000 + 1000
  )}`;
}

/**
 * Issues (or returns the existing) certificate for a single language, the moment that
 * language is fully completed. Does NOT require any other language to be finished.
 */
export function ensureLanguageCertificate(langId: LanguageId, name: string): LanguageCertificate {
  const state = loadProgress();
  const certificates = state.certificates ?? {};
  const existing = certificates[langId];

  const cert: LanguageCertificate =
    existing ?? {
      lang: langId,
      certificateId: generateCertificateId(langId),
      issuedAt: new Date().toISOString(),
      studentName: name,
    };

  // Allow the student to correct their printed name even after the cert was first issued.
  cert.studentName = name;
  certificates[langId] = cert;
  state.certificates = certificates;
  state.studentName = name;
  saveProgress(state);
  return cert;
}

export function getLanguageCertificate(langId: LanguageId): LanguageCertificate | undefined {
  return loadProgress().certificates?.[langId];
}

export function getAllCertificates(): LanguageCertificate[] {
  const state = loadProgress();
  return Object.values(state.certificates ?? {}).filter(Boolean) as LanguageCertificate[];
}

/** Auto-issues a certificate the instant a language reaches 100%, using any previously-entered name. */
export function autoIssueCertificateIfEligible(langId: LanguageId): LanguageCertificate | null {
  const state = loadProgress();
  if (!isLanguageCompleted(state, langId)) return null;
  if (state.certificates?.[langId]) return state.certificates[langId]!;
  if (!state.studentName) return null; // need a name on file before we can print a cert
  return ensureLanguageCertificate(langId, state.studentName);
}

/* ---------------------------------------------------------------
   Backup / restore. Since all progress lives only in this browser's
   localStorage, this gives learners a way to back it up before
   clearing browser data, or move it to another device manually.
----------------------------------------------------------------*/

export interface ProgressBackup {
  exportedAt: string;
  version: 1;
  state: ProgressState;
}

/** Serializes current progress into a JSON string suitable for downloading as a file. */
export function exportProgress(): string {
  const backup: ProgressBackup = {
    exportedAt: new Date().toISOString(),
    version: 1,
    state: loadProgress(),
  };
  return JSON.stringify(backup, null, 2);
}

export interface ImportResult {
  success: boolean;
  error?: string;
}

/**
 * Restores progress from a previously exported backup string.
 * Validates shape defensively — a malformed or unrelated file should never crash the app
 * or silently corrupt existing progress.
 */
export function importProgress(raw: string): ImportResult {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return { success: false, error: "That file isn't valid JSON." };
  }

  if (
    typeof parsed !== "object" ||
    parsed === null ||
    !("state" in parsed) ||
    typeof (parsed as ProgressBackup).state !== "object"
  ) {
    return { success: false, error: "That file doesn't look like a CodeTutor progress backup." };
  }

  const backup = parsed as ProgressBackup;
  const incomingState = backup.state;

  if (typeof incomingState.completed !== "object" || incomingState.completed === null) {
    return { success: false, error: "The backup is missing expected progress data." };
  }

  try {
    saveProgress(incomingState);
    return { success: true };
  } catch {
    return { success: false, error: "Your browser blocked saving this data. Storage may be full or disabled." };
  }
}
