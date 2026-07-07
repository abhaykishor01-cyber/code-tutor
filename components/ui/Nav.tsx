"use client";

import Link from "next/link";
import { useState } from "react";
import ThemeToggle from "./ThemeToggle";
import SearchBox from "./SearchBox";

const LINKS = [
  { href: "/", label: "Courses" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/certificate", label: "Certificate" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-navy-950/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg shrink-0">
          <span className="text-gold-400">&lt;/&gt;</span> CodeTutor
        </Link>

        <div className="hidden sm:flex items-center gap-6 flex-1 justify-center max-w-md mx-6">
          <nav className="flex items-center gap-6 text-sm text-white/70 shrink-0" aria-label="Primary">
            {LINKS.map((l) => (
              <Link key={l.href} href={l.href} className="hover:text-white transition">
                {l.label}
              </Link>
            ))}
          </nav>
          <SearchBox />
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <button
            className="sm:hidden w-9 h-9 rounded-lg border border-white/15 flex items-center justify-center"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((o) => !o)}
          >
            {open ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {open && (
        <nav
          id="mobile-nav"
          aria-label="Mobile"
          className="sm:hidden border-t border-white/10 px-6 py-4 flex flex-col gap-4 text-white/70"
        >
          <SearchBox onNavigate={() => setOpen(false)} />
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="hover:text-white transition" onClick={() => setOpen(false)}>
              {l.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
