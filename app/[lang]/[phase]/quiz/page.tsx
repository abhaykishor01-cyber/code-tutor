"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getLanguage, LanguageId } from "@/lib/courseManifest";
import { NormalizedLesson } from "@/lib/normalize";
import QuizMCQ from "@/components/QuizMCQ";
import QuizQA from "@/components/QuizQA";

export default function QuizPage() {
  const params = useParams();
  const langId = params.lang as LanguageId;
  const phase = Number(params.phase);
  const lang = getLanguage(langId);
  const [lesson, setLesson] = useState<NormalizedLesson | null>(null);
  const [tab, setTab] = useState<"mcq" | "qa">("mcq");

  useEffect(() => {
    fetch(`/api/phase/${langId}/${phase}`)
      .then((r) => r.json())
      .then((d) => setLesson(d.lesson));
  }, [langId, phase]);

  if (!lang || !lesson) return <p className="text-white/50">Loading…</p>;

  return (
    <div>
      <div className="mb-6">
        <Link href={`/${langId}/${phase}`} className="text-sm text-white/50 hover:text-white">
          ← Back to lesson
        </Link>
        <h1 className="text-2xl font-bold mt-2">
          Practice: {lesson.title}
        </h1>
      </div>

      <div className="flex gap-3 mb-6">
        <button
          onClick={() => setTab("mcq")}
          className={`px-4 py-2 rounded-lg text-sm ${tab === "mcq" ? "bg-gold-500 text-navy-950 font-semibold" : "bg-white/5 text-white/60"}`}
        >
          Multiple Choice ({lesson.mcqs.length})
        </button>
        <button
          onClick={() => setTab("qa")}
          className={`px-4 py-2 rounded-lg text-sm ${tab === "qa" ? "bg-gold-500 text-navy-950 font-semibold" : "bg-white/5 text-white/60"}`}
        >
          Q&amp;A Bank ({lesson.qaBank.length})
        </button>
      </div>

      {tab === "mcq" ? <QuizMCQ mcqs={lesson.mcqs} /> : <QuizQA items={lesson.qaBank} />}
    </div>
  );
}
