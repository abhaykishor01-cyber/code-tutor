"use client";

import { useState } from "react";

export default function Accordion({ items }: { items: { question: string; answer: string }[] }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="space-y-3">
      {items.map((item, i) => {
        const expanded = open === i;
        const buttonId = `accordion-button-${i}`;
        const panelId = `accordion-panel-${i}`;
        return (
          <div key={i} className="card overflow-hidden">
            <h3 className="m-0">
              <button
                id={buttonId}
                onClick={() => setOpen(expanded ? null : i)}
                aria-expanded={expanded}
                aria-controls={panelId}
                className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
              >
                <span className="font-medium">{item.question}</span>
                <span
                  className="text-gold-400 shrink-0 transition-transform duration-300"
                  style={{ transform: expanded ? "rotate(45deg)" : "rotate(0deg)" }}
                  aria-hidden="true"
                >
                  +
                </span>
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              aria-hidden={!expanded}
              className="grid transition-all duration-300 ease-out"
              style={{ gridTemplateRows: expanded ? "1fr" : "0fr" }}
            >
              <div className="overflow-hidden">
                <p className="px-5 pb-4 text-white/60 text-sm leading-relaxed">{item.answer}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
