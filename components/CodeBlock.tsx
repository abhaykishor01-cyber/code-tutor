"use client";

import { useEffect, useRef } from "react";
import Prism from "prismjs";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-c";
import "prismjs/components/prism-cpp";
import "prismjs/components/prism-python";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-markup";
import "prismjs/components/prism-css";
import { LanguageId } from "@/lib/courseManifest";

// Maps our course language ids to the Prism grammar that actually renders them.
const PRISM_LANGUAGE: Record<LanguageId, string> = {
  html: "markup",
  c: "c",
  cpp: "cpp",
  python: "python",
  js: "javascript",
  java: "java",
};

export default function CodeBlock({
  code,
  label,
  language,
}: {
  code?: string;
  label?: string;
  language?: LanguageId;
}) {
  const ref = useRef<HTMLElement>(null);
  const prismLang = language ? PRISM_LANGUAGE[language] ?? "clike" : "clike";

  useEffect(() => {
    if (ref.current) Prism.highlightElement(ref.current);
  }, [code, prismLang]);

  if (!code) return null;

  return (
    <div className="rounded-xl overflow-hidden border border-white/10 bg-[#0d1117] my-3">
      {label && (
        <div className="px-4 py-2 text-xs text-white/40 border-b border-white/10 bg-white/5">{label}</div>
      )}
      <pre className={`p-4 overflow-x-auto text-sm leading-relaxed language-${prismLang}`}>
        <code ref={ref} className={`language-${prismLang}`}>
          {code}
        </code>
      </pre>
    </div>
  );
}
