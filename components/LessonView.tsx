"use client";

import { NormalizedLesson } from "@/lib/normalize";
import { LanguageId } from "@/lib/courseManifest";
import CodeBlock from "./CodeBlock";
import Section from "./Section";

export default function LessonView({ lesson, language }: { lesson: NormalizedLesson; language?: LanguageId }) {
  return (
    <article>
      {lesson.isFallback && (
        <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-300 text-sm">
          ⚠ This lesson currently contains placeholder content and needs to be authored properly.
        </div>
      )}

      <header className="mb-8">
        <p className="text-white/50 text-sm">
          Phase {lesson.phaseNumber} {lesson.estimatedTime ? `· ${lesson.estimatedTime}` : ""}
        </p>
        <h1 className="text-3xl font-bold mt-1">{lesson.title}</h1>
        {lesson.description && <p className="text-white/60 mt-2">{lesson.description}</p>}
      </header>

      {lesson.learningObjectives.length > 0 && (
        <Section title="Learning Objectives">
          <ul className="list-disc list-inside space-y-1">
            {lesson.learningObjectives.map((o, i) => (
              <li key={i}>{String(o)}</li>
            ))}
          </ul>
        </Section>
      )}

      {lesson.introduction && <Section title="Introduction">{lesson.introduction}</Section>}

      {lesson.conceptExplanation && (
        <Section title="Concept Explanation">
          <div className="whitespace-pre-wrap">{lesson.conceptExplanation}</div>
        </Section>
      )}

      {lesson.syntax && (
        <Section title="Syntax">
          <CodeBlock code={lesson.syntax} language={language} />
          {lesson.syntaxBreakdown && lesson.syntaxBreakdown.length > 0 && (
            <ul className="list-disc list-inside space-y-1 mt-2">
              {lesson.syntaxBreakdown.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          )}
        </Section>
      )}

      {lesson.rulesAndKeyPoints.length > 0 && (
        <Section title="Rules & Key Points">
          <ul className="list-disc list-inside space-y-1">
            {lesson.rulesAndKeyPoints.map((r, i) => (
              <li key={i}>{String(r)}</li>
            ))}
          </ul>
        </Section>
      )}

      {lesson.codeExamples.length > 0 && (
        <Section title="Code Examples">
          {lesson.codeExamples.map((ex, i) => (
            <div key={i} className="mb-6">
              {ex.title && <h3 className="font-semibold mb-1">{ex.title}</h3>}
              {ex.description && <p className="text-white/60 text-sm mb-2">{ex.description}</p>}
              <CodeBlock code={ex.code} language={language} />
              {ex.output && (
                <div className="text-sm text-white/60 mt-1">
                  <span className="text-white/40">Output: </span>
                  <code className="text-emerald-400">{ex.output}</code>
                </div>
              )}
            </div>
          ))}
        </Section>
      )}

      {lesson.memoryVisualization && (
        <Section title="Memory Visualization">
          <pre className="whitespace-pre-wrap text-sm bg-white/5 rounded-xl p-4 border border-white/10">
            {lesson.memoryVisualization}
          </pre>
        </Section>
      )}

      {lesson.realWorldUseCases.length > 0 && (
        <Section title="Real-World Use Cases">
          <ul className="list-disc list-inside space-y-1">
            {lesson.realWorldUseCases.map((u, i) => (
              <li key={i}>{String(u)}</li>
            ))}
          </ul>
        </Section>
      )}

      {lesson.commonMistakes.length > 0 && (
        <Section title="Common Mistakes">
          <ul className="list-disc list-inside space-y-1 text-red-300/90">
            {lesson.commonMistakes.map((m, i) => (
              <li key={i}>{String(m)}</li>
            ))}
          </ul>
        </Section>
      )}

      {lesson.bestPractices.length > 0 && (
        <Section title="Best Practices">
          <ul className="list-disc list-inside space-y-1 text-emerald-300/90">
            {lesson.bestPractices.map((b, i) => (
              <li key={i}>{String(b)}</li>
            ))}
          </ul>
        </Section>
      )}

      {lesson.faqs.length > 0 && (
        <Section title="FAQs">
          <div className="space-y-3">
            {lesson.faqs.map((f, i) => (
              <div key={i} className="card p-4">
                <p className="font-medium">{f.question}</p>
                <p className="text-white/60 text-sm mt-1">{f.answer}</p>
              </div>
            ))}
          </div>
        </Section>
      )}

      {lesson.summary && <Section title="Summary">{lesson.summary}</Section>}

      {lesson.keyTakeaways.length > 0 && (
        <Section title="Key Takeaways">
          <ul className="list-disc list-inside space-y-1">
            {lesson.keyTakeaways.map((k, i) => (
              <li key={i}>{String(k)}</li>
            ))}
          </ul>
        </Section>
      )}

      {lesson.previewNextTopic && (
        <div className="card p-4 mt-6 text-sm text-white/60">
          <span className="font-semibold text-white/80">Coming up next: </span>
          {lesson.previewNextTopic}
        </div>
      )}
    </article>
  );
}
