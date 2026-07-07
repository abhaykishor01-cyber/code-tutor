"use client";

import { useState } from "react";
import { QA } from "@/lib/normalize";

export default function QuizQA({ items }: { items: QA[] }) {
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});

  if (items.length === 0) return null;

  return (
    <div className="space-y-3">
      {items.map((qa, i) => (
        <div key={i} className="card p-4">
          <div className="flex items-center gap-2 mb-1">
            {qa.difficulty && (
              <span className="text-[10px] uppercase tracking-wide px-2 py-0.5 rounded-full bg-white/10 text-white/50">
                {qa.difficulty}
              </span>
            )}
            {qa.type && (
              <span className="text-[10px] uppercase tracking-wide px-2 py-0.5 rounded-full bg-gold-500/10 text-gold-400">
                {qa.type}
              </span>
            )}
          </div>
          <p className="font-medium">{qa.question}</p>
          {revealed[i] ? (
            <p className="text-white/70 text-sm mt-2 whitespace-pre-wrap">{qa.answer}</p>
          ) : (
            <button
              className="text-gold-400 text-sm mt-2 hover:underline"
              onClick={() => setRevealed((r) => ({ ...r, [i]: true }))}
            >
              Reveal answer
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
