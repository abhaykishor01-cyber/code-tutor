"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { LANGUAGES, totalPhasesInCourse } from "@/lib/courseManifest";
import { getNextUnlockedPhase, getOverallStats, recordVisitToday } from "@/lib/progress";
import AnimatedCounter from "@/components/ui/AnimatedCounter";
import { SkeletonCard } from "@/components/ui/Skeleton";
import Accordion from "@/components/ui/Accordion";
import Certificate from "@/components/Certificate";

const FEATURES = [
  {
    icon: "🔒",
    title: "A locked, no-skip path",
    desc: "Every phase unlocks only after you finish the last one. No jumping ahead, no gaps in your foundation.",
  },
  {
    icon: "🧑‍💻",
    title: "Code-first practice",
    desc: "Most practice is writing and reading real code, not guessing multiple-choice answers.",
  },
  {
    icon: "🎓",
    title: "A real certificate per language",
    desc: "Finish a language, get a certificate immediately — no need to finish all six first.",
  },
  {
    icon: "📊",
    title: "Progress that persists",
    desc: "Your streak, completed phases, and quiz scores are saved automatically as you go.",
  },
];

const CURRICULUM_STATS = [
  { label: "Languages covered", getValue: () => LANGUAGES.length },
  { label: "Total phases across the course", getValue: () => totalPhasesInCourse() },
  { label: "Independent certificates available", getValue: () => LANGUAGES.length },
];

const METHODOLOGY = [
  {
    title: "Learn",
    desc: "Every phase opens with a plain-language explanation, real syntax, and worked examples — not just a wall of text.",
  },
  {
    title: "Practice",
    desc: "Common mistakes and best practices are called out explicitly, so you build the right habits from the first phase.",
  },
  {
    title: "Prove it",
    desc: "A short quiz confirms understanding before the next phase unlocks — no progressing on guesswork.",
  },
];

const FAQS = [
  {
    question: "Do I need to know programming already?",
    answer:
      "No. Every language starts from Phase 1 with no assumptions. If you already know some basics, you can move through early phases quickly once you complete them.",
  },
  {
    question: "Can I skip ahead to a topic I already know?",
    answer:
      "Not within a language — phases unlock strictly in order so nothing important gets missed. You can, however, choose which language to start with.",
  },
  {
    question: "Do I need to finish all six languages to get a certificate?",
    answer:
      "No. Each language has its own certificate, issued as soon as you complete every phase in that language.",
  },
  {
    question: "Is my progress saved if I close the browser?",
    answer:
      "Yes. Progress, quiz scores, streaks, and certificates are all saved in your browser's local storage automatically.",
  },
];

export default function HomePage() {
  const [stats, setStats] = useState<ReturnType<typeof getOverallStats> | null>(null);
  const [nextPhase, setNextPhase] = useState<{ lang: string; phase: number } | null>(null);

  useEffect(() => {
    recordVisitToday();
    const s = getOverallStats();
    setStats(s);

    // Only offer "Resume Learning" once the person has made real progress somewhere.
    const inProgress = s.perLanguage.find((p) => p.done > 0 && p.percent < 100);
    if (inProgress) {
      setNextPhase({ lang: inProgress.lang.id, phase: getNextUnlockedPhase(inProgress.lang.id) });
    }
  }, []);

  return (
    <div className="space-y-24">
      {/* HERO */}
      <section className="relative text-center pt-12 md:pt-20 pb-10 md:pb-16 animate-fade-up">
        <div className="inline-flex items-center gap-2 rounded-full border border-gold-500/20 bg-gold-500/10 px-4 py-1.5 text-xs font-semibold tracking-wide text-gold-300 shadow-sm backdrop-blur-sm mb-8">
          <span aria-hidden="true">✦</span> Six languages · One locked path · Zero skipped fundamentals
        </div>
        <h1 className="mx-auto max-w-5xl text-4xl font-extrabold tracking-tight leading-[1.05] sm:text-5xl md:text-6xl lg:text-7xl">
          Master programming,
          <br />
          <span className="text-gold-400">one locked step at a time.</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-white/70 sm:text-lg">
          A structured, no-skipping curriculum for HTML, C, C++, Python, JavaScript, and Java — with
          real code practice and a certificate waiting at the end of each one.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          {nextPhase ? (
            <Link href={`/${nextPhase.lang}/${nextPhase.phase}`} className="btn-primary text-base px-7 py-3 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl active:translate-y-0">
              Resume Learning →
            </Link>
          ) : (
            <Link href={`/${LANGUAGES[0].id}`} className="btn-primary text-base px-7 py-3 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl active:translate-y-0">
              Start Learning Free →
            </Link>
          )}
          <Link href="/dashboard" className="btn-secondary text-base px-7 py-3 transition-all duration-300 hover:-translate-y-1 hover:bg-white/10">
            View Dashboard
          </Link>
        </div>

<div className="mx-auto mt-16 max-w-5xl">
  <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-2xl backdrop-blur">
    <div className="flex items-center gap-2 border-b border-white/10 px-5 py-3">
      <span className="h-3 w-3 rounded-full bg-red-400" />
      <span className="h-3 w-3 rounded-full bg-yellow-400" />
      <span className="h-3 w-3 rounded-full bg-green-400" />
    </div>

    <div className="grid gap-6 p-6 md:grid-cols-[260px_1fr]">
      <aside className="rounded-2xl bg-white/5 p-4 text-left">
        <p className="text-sm font-semibold text-white">
          Learning Path
        </p>

        <div className="mt-4 space-y-3">
          <div className="rounded-lg bg-gold-500/20 px-3 py-2 text-gold-300">
            ✓ HTML & CSS
          </div>

          <div className="rounded-lg bg-white/5 px-3 py-2">
            C Programming
          </div>

          <div className="rounded-lg bg-white/5 px-3 py-2">
            Python
          </div>

          <div className="rounded-lg bg-white/5 px-3 py-2">
            JavaScript
          </div>
        </div>
      </aside>

      <div className="rounded-2xl bg-black/20 p-6 text-left">
        <p className="text-lg font-semibold">
          Phase 5 — Functions
        </p>

        <p className="mt-2 text-white/60">
          Complete lessons, practice coding questions, pass the quiz,
          unlock the next phase, and earn your certificate.
        </p>

        <div className="mt-6 h-3 overflow-hidden rounded-full bg-white/10">
          <div className="h-full w-2/3 rounded-full bg-gold-400" />
        </div>

        <p className="mt-3 text-sm text-white/60">
          Progress • 67%
        </p>
      </div>
    </div>
  </div>
</div>

</section>

      {/* OVERALL PROGRESS */}
      {stats ? (
        <div className="card p-6 -mt-10 animate-fade-up">
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold">Overall Course Progress</span>
            <span className="text-gold-400 font-bold">{stats.percent}%</span>
          </div>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${stats.percent}%` }} />
          </div>
          <p className="text-white/50 text-sm mt-2">
            {stats.completedPhases} / {stats.totalPhases} phases completed
          </p>
        </div>
      ) : (
        <div className="skeleton h-24 -mt-10" />
      )}

      {/* LANGUAGE CARDS */}
      <section>
        <div className="mb-8">
  <span className="text-sm font-semibold uppercase tracking-[0.2em] text-gold-400">
    Programming Languages
  </span>

  <h2 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
    Choose your learning path
  </h2>

  <p className="mt-3 max-w-2xl text-white/60">
    Every course follows the same structured roadmap. Learn concepts, solve coding exercises,
    complete quizzes, and unlock the next phase at your own pace.
  </p>
</div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {!stats
            ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
            : LANGUAGES.map((lang) => {
                const langStats = stats.perLanguage.find((p) => p.lang.id === lang.id);

                return (
                  <Link
                    key={lang.id}
                    href={`/${lang.id}`}
                    className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition-all duration-300 hover:-translate-y-2 hover:border-gold-400/40 hover:shadow-2xl"
                  >
                    <div
  className={`absolute inset-0 bg-gradient-to-br ${lang.color} opacity-0 transition-opacity duration-300 group-hover:opacity-15`}
/>
                    <div className="relative">
                      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5 text-3xl transition-colors duration-300 group-hover:bg-gold-500/10">
  {lang.icon}
</div>
                      <h3 className="font-bold text-lg">{lang.name}</h3>
                      <p className="text-white/50 text-sm mt-1">{lang.totalPhases} phases</p>
                      {langStats && (
                        <div className="mt-4">
                          <div className="progress-track">
                            <div className="progress-fill" style={{ width: `${langStats.percent}%` }} />
                          </div>
                          <p className="text-xs text-white/40 mt-1">{langStats.percent}% complete</p>
                        </div>
                      )}
                    </div>
                  </Link>
                );
              })}
        </div>
      </section>

      {/* ROADMAP */}
      <section>
        <div className="mb-8">
  <span className="text-sm font-semibold uppercase tracking-[0.2em] text-gold-400">
    Learning Journey
  </span>

  <h2 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
    Learn with a structured roadmap
  </h2>

  <p className="mt-3 max-w-2xl text-white/60">
    Every language follows the same proven workflow so you never skip
    fundamentals and always know what comes next.
  </p>
</div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { step: "Learn", desc: "Read the concept, syntax, examples, and common mistakes." },
            { step: "Practice", desc: "Work through code-writing exercises — mostly real code, not just MCQs." },
            { step: "Quiz", desc: "Confirm understanding with an instant-feedback quiz for the phase." },
            { step: "Unlock", desc: "Mark the phase complete to unlock the next one in the path." },
          ].map((s, i) => (
            <div
  key={s.step}
  className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition-all duration-300 hover:-translate-y-2 hover:border-gold-400/40 hover:shadow-2xl"
>
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-gold-500/10 font-bold text-gold-400">
  {i + 1}
</div>
              <h3 className="text-lg font-bold tracking-tight">
  {s.step}
</h3>
              <p className="mt-3 text-sm leading-7 text-white/60">
  {s.desc}
</p>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section>
       <div className="mb-8">
  <span className="text-sm font-semibold uppercase tracking-[0.2em] text-gold-400">
    Why Choose CodeTutor
  </span>

  <h2 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
    Learn smarter, not harder
  </h2>

  <p className="mt-3 max-w-2xl text-white/60">
    Every feature is designed to keep you focused on building real programming
    skills through structured learning, practice, and measurable progress.
  </p>
</div>
        <div className="grid gap-6 sm:grid-cols-2">
          {FEATURES.map((f) => (
            <div key={f.title} className="group rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition-all duration-300 hover:-translate-y-2 hover:border-gold-400/40 hover:shadow-2xl">
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gold-500/10 text-2xl transition-all duration-300 group-hover:bg-gold-500/20 group-hover:scale-110">
  {f.icon}
</div>
              <h3 className="text-lg font-bold tracking-tight">
  {f.title}
</h3>
              <p className="mt-3 text-sm leading-7 text-white/60">
  {f.desc}
</p>
            </div>
          ))}
        </div>
      </section>

      {/* CURRICULUM AT A GLANCE — real numbers only, no invented statistics */}
      <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] px-8 py-12 text-center shadow-xl backdrop-blur md:px-12 md:py-16">
        <div className="absolute inset-0 bg-gradient-to-br from-gold-500/10 via-transparent to-transparent" />
        <div className="relative">
          <div className="mb-10">
  <span className="text-sm font-semibold uppercase tracking-[0.2em] text-gold-400">
    Platform Overview
  </span>

  <h2 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
    Everything you need to master programming
  </h2>

  <p className="mx-auto mt-3 max-w-2xl text-white/60">
    Built around structured learning paths, practical coding exercises,
    quizzes, and measurable progress across every language.
  </p>
</div>
          <div className="grid gap-8 sm:grid-cols-3">
            {CURRICULUM_STATS.map((s) => (
              <div
  key={s.label}
  className="rounded-2xl border border-white/10 bg-black/20 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-gold-400/30"
>
                <p className="text-4xl md:text-5xl font-bold text-gold-400 tabular-nums">
                  <AnimatedCounter value={s.getValue()} />
                </p>
                <p className="mt-3 text-sm font-medium text-white/60">
  {s.label}
</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* METHODOLOGY */}
      <section>
        <h2 className="text-2xl font-bold mb-1">How the learning method works</h2>
        <p className="text-white/50 mb-6">The same three-step loop, applied consistently to every phase.</p>
        <div className="grid sm:grid-cols-3 gap-5">
          {METHODOLOGY.map((m) => (
            <div key={m.title} className="card p-6">
              <h3 className="font-bold text-gold-400">{m.title}</h3>
              <p className="text-white/60 text-sm mt-2 leading-relaxed">{m.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CERTIFICATE PREVIEW — clearly marked as sample/demo content, not a real issued certificate */}
      <section>
        <h2 className="text-2xl font-bold mb-1">Certificate Preview</h2>
        <p className="text-white/50 mb-6">
          A sample preview of what your certificate looks like once you complete a language — not a real,
          issued certificate.
        </p>
        <div className="grid md:grid-cols-2 gap-6">
          {[
            { name: "Sample Student", course: "Python Programming" },
            { name: "Sample Student", course: "HTML & CSS" },
          ].map((c, i) => (
            <div key={i} className="card p-4 overflow-hidden relative">
              <span className="absolute top-3 right-3 z-10 text-[10px] font-semibold uppercase tracking-wide text-white/40 bg-white/5 border border-white/10 rounded-full px-2 py-0.5">
                Sample
              </span>
              <div className="overflow-x-auto">
                <div style={{ transform: "scale(0.42)", transformOrigin: "top left", width: 1200 * 0.42, height: 850 * 0.42 }}>
                  <Certificate
                    studentName={c.name}
                    courseName={c.course}
                    date="Sample Date"
                    certificateId={`CT-SAMPLE-PREVIEW`}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="py-4">
        <div className="mb-8 text-center">
  <span className="text-sm font-semibold uppercase tracking-[0.2em] text-gold-400">
    Support
  </span>

  <h2 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
    Frequently Asked Questions
  </h2>

  <p className="mx-auto mt-3 max-w-2xl text-white/60">
    Everything you need to know before starting your programming journey with
    CodeTutor.
  </p>
</div>  
        <div className="mx-auto max-w-3xl">
          <Accordion items={FAQS} />
        </div>
      </section>

      {/* FINAL CTA */}
<section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.04] via-white/[0.03] to-gold-500/10 px-8 py-16 text-center shadow-2xl backdrop-blur md:px-16">

  {/* Background Glow */}
  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,215,0,0.12),transparent_60%)]" />

  <div className="relative">

    <span className="inline-flex items-center rounded-full border border-gold-500/20 bg-gold-500/10 px-4 py-1.5 text-sm font-semibold uppercase tracking-[0.2em] text-gold-300">
      Start Your Journey
    </span>

    <h2 className="mx-auto mt-6 max-w-4xl text-4xl font-extrabold tracking-tight leading-tight md:text-5xl">
      Build real programming skills,
      <br />
      <span className="text-gold-400">
        one unlocked phase at a time.
      </span>
    </h2>

    <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-white/65">
      Follow structured learning paths, practice real coding problems,
      complete quizzes, unlock every phase, and earn professional
      certificates as you master each programming language.
    </p>

    {/* Highlights */}

    <div className="mt-10 flex flex-wrap items-center justify-center gap-4 text-sm text-white/70">

      <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2">
        ✓ Structured Learning
      </div>

      <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2">
        ✓ Real Coding Practice
      </div>

      <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2">
        ✓ Progress Tracking
      </div>

      <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2">
        ✓ Course Certificates
      </div>

    </div>

    {/* Buttons */}

    <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">

      <Link
        href={`/${LANGUAGES[0].id}`}
        className="btn-primary px-8 py-3 text-base transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
      >
        Start Learning Free →
      </Link>

      <Link
        href="/dashboard"
        className="btn-secondary px-8 py-3 text-base transition-all duration-300 hover:-translate-y-1"
      >
        View Dashboard
      </Link>

    </div>

    <p className="mt-8 text-sm text-white/45">
      No subscriptions. No hidden costs. Learn at your own pace.
    </p>

  </div>

</section>

      {/* FOOTER */}
      <footer className="border-t border-white/10 pt-8 pb-4 text-sm text-white/40 flex flex-col sm:flex-row justify-between gap-4">
        <p>© {new Date().getFullYear()} CodeTutor. Built for learning by doing.</p>
        <div className="flex gap-6">
          <Link href="/" className="hover:text-white/70 transition">Courses</Link>
          <Link href="/dashboard" className="hover:text-white/70 transition">Dashboard</Link>
          <Link href="/certificate" className="hover:text-white/70 transition">Certificate</Link>
        </div>
      </footer>
    </div>
  );
}
