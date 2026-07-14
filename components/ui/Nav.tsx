"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import ThemeToggle from "./ThemeToggle";
import SearchBox from "./SearchBox";

const LINKS = [
  { href: "/", label: "Courses" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/certificate", label: "Certificate" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close mobile menu whenever the route changes
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-navy-950/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          aria-label="Go to CodeTutor Home"
          className="flex shrink-0 items-center gap-2 text-lg font-bold"
        >
          <span className="text-gold-400">&lt;/&gt;</span>
          CodeTutor
        </Link>

        <div className="mx-6 hidden max-w-md flex-1 items-center justify-center gap-6 sm:flex">
          <nav
            className="flex shrink-0 items-center gap-6 text-sm"
            aria-label="Primary Navigation"
          >
            {LINKS.map((link) => {
              const isActive = pathname === link.href;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`transition ${
                    isActive
                      ? "font-medium text-white"
                      : "text-white/70 hover:text-white"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <SearchBox />
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />

          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/15 sm:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((prev) => !prev)}
          >
            {open ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {open && (
        <nav
          id="mobile-nav"
          aria-label="Mobile Navigation"
          className="flex flex-col gap-4 border-t border-white/10 px-6 py-4 text-white/70 sm:hidden"
        >
          <SearchBox onNavigate={() => setOpen(false)} />

          {LINKS.map((link) => {
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive ? "page" : undefined}
                className={`transition ${
                  isActive
                    ? "font-medium text-white"
                    : "text-white/70 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      )}
    </header>
  );
}