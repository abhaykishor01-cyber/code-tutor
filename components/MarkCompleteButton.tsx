"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { LanguageId } from "@/lib/courseManifest";
import { isLanguageCompleted, isPhaseCompleted, loadProgress, markPhaseCompleted } from "@/lib/progress";

export default function MarkCompleteButton({
  lang,
  phase,
  onCompleted,
}: {
  lang: LanguageId;
  phase: number;
  onCompleted?: () => void;
}) {
  const router = useRouter();
  const [justCompleted, setJustCompleted] = useState(false);
  const already = isPhaseCompleted(loadProgress(), lang, phase);

  function handleClick() {
    const state = markPhaseCompleted(lang, phase);
    setJustCompleted(true);
    onCompleted?.();
    const languageDone = isLanguageCompleted(state, lang);
    setTimeout(() => {
      if (languageDone) {
        // This single language is fully complete — its certificate is available right away,
        // independent of progress in any other language.
        router.push(`/certificate?lang=${lang}&justCompleted=1`);
      } else {
        router.push(`/${lang}`);
      }
      router.refresh();
    }, 900);
  }

  if (already) {
    return (
      <div className="btn-secondary cursor-default">
        <span>✓</span> Already Completed
      </div>
    );
  }

  return (
    <button onClick={handleClick} className="btn-primary relative overflow-hidden">
      {justCompleted ? (
        <span className="animate-pulse">✓ Saved! Unlocking next topic…</span>
      ) : (
        <>Mark as Completed</>
      )}
    </button>
  );
}
