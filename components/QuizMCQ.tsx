"use client";

import { useState } from "react";
import { MCQ } from "@/lib/normalize";

function optionEntries(options: MCQ["options"]): { key: string; text: string }[] {
  if (Array.isArray(options)) return options;
  return Object.entries(options).map(([key, text]) => ({ key, text: String(text) }));
}

export default function QuizMCQ({ mcqs }: { mcqs: MCQ[] }) {
  const [selected, setSelected] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);

  if (mcqs.length === 0) {
    return <p className="text-white/50">No quiz questions available for this phase yet.</p>;
  }

  const score = mcqs.reduce((s, q, i) => (selected[i] === q.answer ? s + 1 : s), 0);

  return (
    <div>
      <div className="space-y-6">
        {mcqs.map((q, i) => {
          const opts = optionEntries(q.options);
          const chosen = selected[i];
          return (
            <div key={i} className="card p-5">
              <p className="font-medium mb-3">
                {i + 1}. {q.question}
              </p>
              <div className="space-y-2">
                {opts.map((opt) => {
                  const isChosen = chosen === opt.key;
                  const isCorrect = opt.key === q.answer;
                  let style = "border-white/10 hover:border-white/30";
                  if (submitted && isChosen && isCorrect) style = "border-emerald-500 bg-emerald-500/10";
                  else if (submitted && isChosen && !isCorrect) style = "border-red-500 bg-red-500/10";
                  else if (submitted && isCorrect) style = "border-emerald-500/50";
                  else if (isChosen) style = "border-gold-500 bg-gold-500/10";

                  return (
                    <button
                      key={opt.key}
                      disabled={submitted}
                      onClick={() => setSelected((s) => ({ ...s, [i]: opt.key }))}
                      className={`w-full text-left px-4 py-2 rounded-lg border ${style} transition text-sm`}
                    >
                      <span className="font-semibold mr-2">{opt.key}.</span>
                      {opt.text}
                    </button>
                  );
                })}
              </div>
              {submitted && q.explanation && (
                <p className="text-xs text-white/50 mt-3">💡 {q.explanation}</p>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-6 flex items-center gap-4">
        {!submitted ? (
          <button className="btn-primary" onClick={() => setSubmitted(true)}>
            Submit Quiz
          </button>
        ) : (
          <div className="card px-5 py-3">
            Score: <span className="text-gold-400 font-bold">{score}</span> / {mcqs.length}
          </div>
        )}
      </div>
    </div>
  );
}
