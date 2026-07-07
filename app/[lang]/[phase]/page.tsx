"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getLanguage, LanguageId } from "@/lib/courseManifest";
import { isPhaseUnlocked, loadProgress } from "@/lib/progress";
import { NormalizedLesson } from "@/lib/normalize";
import LessonView from "@/components/LessonView";
import MarkCompleteButton from "@/components/MarkCompleteButton";

export default function PhasePage() {
  const params = useParams();
  const langId = params.lang as LanguageId;
  const phase = Number(params.phase);
  const lang = getLanguage(langId);

  const [lesson, setLesson] = useState<NormalizedLesson | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [unlocked, setUnlocked] = useState<boolean | null>(null);

  useEffect(() => {
    setUnlocked(isPhaseUnlocked(loadProgress(), langId, phase));
    fetch(`/api/phase/${langId}/${phase}`)
      .then((r) => {
        if (!r.ok) throw new Error("not found");
        return r.json();
      })
      .then((d) => setLesson(d.lesson))
      .catch(() => setNotFound(true));
  }, [langId, phase]);

  if (!lang) return <p>Unknown language.</p>;

  if (unlocked === false) {
    return (
      <div className="card p-8 text-center">
        <p className="text-4xl mb-3">🔒</p>
        <h1 className="text-xl font-bold mb-2">This lesson is locked</h1>
        <p className="text-white/50 mb-6">Complete the previous topic to unlock this lesson.</p>
        <Link href={`/${langId}`} className="btn-secondary">
          Back to Roadmap
        </Link>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="card p-8 text-center">
        <p className="text-4xl mb-3">📝</p>
        <h1 className="text-xl font-bold mb-2">Content coming soon</h1>
        <p className="text-white/50 mb-6">This phase hasn&apos;t been authored yet.</p>
        <Link href={`/${langId}`} className="btn-secondary">
          Back to Roadmap
        </Link>
      </div>
    );
  }

  if (!lesson) return <p className="text-white/50">Loading…</p>;

  return (
    <div>
      <LessonView lesson={lesson} language={langId} />

      <div className="flex items-center gap-4 mt-10 pt-6 border-t border-white/10">
        <MarkCompleteButton lang={langId} phase={phase} />
        {(lesson.mcqs.length > 0 || lesson.qaBank.length > 0) && (
          <Link href={`/${langId}/${phase}/quiz`} className="btn-secondary">
            Practice Quiz →
          </Link>
        )}
      </div>
    </div>
  );
}
