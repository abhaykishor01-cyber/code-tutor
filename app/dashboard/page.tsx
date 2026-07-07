"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { getLanguage } from "@/lib/courseManifest";
import {
  Achievement,
  exportProgress,
  getAchievements,
  getAllCertificates,
  getCurrentStreak,
  getNextUnlockedPhase,
  getOverallStats,
  importProgress,
  loadProgress,
  LanguageCertificate,
} from "@/lib/progress";
import { TOPICS_PER_PHASE, totalTopicsInCourse } from "@/lib/courseManifest";

export default function DashboardPage() {
  const [stats, setStats] = useState<ReturnType<typeof getOverallStats> | null>(null);
  const [streak, setStreak] = useState(0);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [certificates, setCertificates] = useState<LanguageCertificate[]>([]);
  const [recentActivity, setRecentActivity] = useState<ReturnType<typeof loadProgress>["activity"]>([]);
  const [nextPhase, setNextPhase] = useState<{ lang: string; phase: number } | null>(null);
  const [backupMessage, setBackupMessage] = useState<{ text: string; isError: boolean } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const state = loadProgress();
    const s = getOverallStats();
    setStats(s);
    setStreak(getCurrentStreak(state));
    setAchievements(getAchievements(state));
    setCertificates(getAllCertificates());
    setRecentActivity([...(state.activity ?? [])].reverse().slice(0, 6));

    const inProgress = s.perLanguage.find((p) => p.done > 0 && p.percent < 100);
    if (inProgress) {
      setNextPhase({ lang: inProgress.lang.id, phase: getNextUnlockedPhase(inProgress.lang.id) });
    }
  }, []);

  function handleExport() {
    const json = exportProgress();
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `codetutor-progress-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setBackupMessage({ text: "Backup downloaded.", isError: false });
  }

  function handleImportClick() {
    fileInputRef.current?.click();
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const text = await file.text();
    const result = importProgress(text);

    if (result.success) {
      setBackupMessage({ text: "Progress restored. Reloading…", isError: false });
      setTimeout(() => window.location.reload(), 800);
    } else {
      setBackupMessage({ text: result.error ?? "Couldn't restore that file.", isError: true });
    }
    e.target.value = "";
  }

  if (!stats) return <p className="text-white/50">Loading…</p>;

  const totalTopics = totalTopicsInCourse();
  const completedTopics = stats.completedPhases * TOPICS_PER_PHASE;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <h1 className="text-3xl font-bold">Your Dashboard</h1>
        {nextPhase && (
          <Link href={`/${nextPhase.lang}/${nextPhase.phase}`} className="btn-primary self-start sm:self-auto">
            Resume Learning →
          </Link>
        )}
      </div>

      {/* Top stat row */}
      <div className="grid sm:grid-cols-3 gap-4 mb-6">
        <div className="card p-5">
          <p className="text-white/50 text-xs uppercase tracking-wide mb-1">Overall Progress</p>
          <p className="text-3xl font-bold text-gold-400">{stats.percent}%</p>
          <p className="text-white/40 text-xs mt-1">
            {stats.completedPhases} / {stats.totalPhases} phases
          </p>
        </div>
        <div className="card p-5">
          <p className="text-white/50 text-xs uppercase tracking-wide mb-1">Learning Streak</p>
          <p className="text-3xl font-bold text-gold-400">
            {streak} <span className="text-lg">{streak === 1 ? "day" : "days"}</span>
          </p>
          <p className="text-white/40 text-xs mt-1">Keep visiting daily to grow this</p>
        </div>
        <div className="card p-5">
          <p className="text-white/50 text-xs uppercase tracking-wide mb-1">Certificates Earned</p>
          <p className="text-3xl font-bold text-gold-400">{certificates.length}</p>
          <p className="text-white/40 text-xs mt-1">out of 6 possible</p>
        </div>
      </div>

      <div className="card p-6 mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="font-semibold">Course Progress</span>
          <span className="text-gold-400 font-bold">{stats.percent}%</span>
        </div>
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${stats.percent}%` }} />
        </div>
        <p className="text-white/50 text-sm mt-2">
          {stats.completedPhases} / {stats.totalPhases} Phases Completed &middot; {completedTopics} / {totalTopics}{" "}
          Topics Completed
        </p>
      </div>

      {/* Per-language progress */}
      <div className="grid sm:grid-cols-2 gap-4 mb-6">
        {stats.perLanguage.map(({ lang, done, total, percent }) => (
          <Link key={lang.id} href={`/${lang.id}`} className="card p-4 hover:border-gold-500/40 transition">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium flex items-center gap-2">
                {lang.icon} {lang.name}
              </span>
              <span className="text-sm text-white/50">
                {done}/{total}
              </span>
            </div>
            <div className="progress-track">
              <div className="progress-fill" style={{ width: `${percent}%` }} />
            </div>
            {percent === 100 && <p className="text-xs text-emerald-400 mt-2">✓ Certificate available</p>}
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        {/* Achievements */}
        <div className="card p-6">
          <h2 className="font-semibold mb-4">Achievements</h2>
          <div className="space-y-3">
            {achievements.map((a) => (
              <div
                key={a.id}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 ${
                  a.earned ? "bg-gold-500/10" : "bg-white/5 opacity-50"
                }`}
              >
                <span className="text-xl" aria-hidden="true">
                  {a.icon}
                </span>
                <div>
                  <p className="text-sm font-medium">{a.title}</p>
                  <p className="text-xs text-white/40">{a.description}</p>
                </div>
                {a.earned && <span className="ml-auto text-emerald-400 text-xs font-semibold">EARNED</span>}
              </div>
            ))}
          </div>
        </div>

        {/* Recent activity */}
        <div className="card p-6">
          <h2 className="font-semibold mb-4">Recent Activity</h2>
          {recentActivity && recentActivity.length > 0 ? (
            <div className="space-y-3">
              {recentActivity.map((a, i) => {
                const lang = getLanguage(a.lang);
                return (
                  <div key={i} className="flex items-center gap-3 text-sm">
                    <span aria-hidden="true">{lang?.icon}</span>
                    <span className="flex-1">
                      Completed Phase {a.phase} of {lang?.name}
                    </span>
                    <span className="text-white/40 text-xs">
                      {new Date(a.completedAt).toLocaleDateString()}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-white/40 text-sm">No completed phases yet — finish your first one to see it here.</p>
          )}
        </div>
      </div>

      {/* Certificates */}
      <div className="card p-6">
        <h2 className="font-semibold mb-2">🎓 Certificates</h2>
        {certificates.length > 0 ? (
          <>
            <p className="text-white/50 text-sm mb-4">
              Each language earns its own certificate as soon as it&apos;s fully completed.
            </p>
            <div className="flex flex-wrap gap-3">
              {certificates.map((c) => (
                <Link key={c.lang} href={`/certificate?lang=${c.lang}`} className="btn-secondary">
                  {getLanguage(c.lang)?.icon} {getLanguage(c.lang)?.name} Certificate
                </Link>
              ))}
            </div>
          </>
        ) : (
          <p className="text-white/50 text-sm">
            🔒 Complete every phase of any single language to unlock that language&apos;s certificate — you don&apos;t need to
            finish all six.
          </p>
        )}
      </div>
      {/* Backup & Restore */}
      <div className="card p-6 mt-6">
        <h2 className="font-semibold mb-2">Backup Your Progress</h2>
        <p className="text-white/50 text-sm mb-4">
          Everything above lives only in this browser. Download a backup before clearing your browser data or
          switching devices, and restore it here whenever you need to.
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <button className="btn-secondary" onClick={handleExport}>
            Download Backup
          </button>
          <button className="btn-secondary" onClick={handleImportClick}>
            Restore from Backup
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json"
            className="sr-only"
            onChange={handleFileChange}
            aria-label="Choose a progress backup file to restore"
          />
        </div>
        {backupMessage && (
          <p className={`text-sm mt-3 ${backupMessage.isError ? "text-red-400" : "text-emerald-400"}`} role="status">
            {backupMessage.text}
          </p>
        )}
      </div>
    </div>
  );
}
