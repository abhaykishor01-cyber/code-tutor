import Link from "next/link";

const LINKS = [
  { href: "/", label: "Courses" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/certificate", label: "Certificate" },
];

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-white/10 bg-navy-950">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-10 md:grid-cols-3">
          {/* Brand */}
          <div>
            <h2 className="flex items-center gap-2 text-xl font-bold text-white">
              <span className="text-gold-400">&lt;/&gt;</span>
              CodeTutor
            </h2>

            <p className="mt-4 max-w-sm text-sm leading-6 text-white/70">
              Learn programming through structured courses, interactive lessons,
              quizzes, and progress tracking—all in one place.
            </p>
          </div>

          {/* Quick Links */}
          <nav aria-label="Footer Navigation">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-white">
              Quick Links
            </h3>

            <ul className="space-y-3">
              {LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/70 transition hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Tech Stack */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-white">
              Built With
            </h3>

            <ul className="space-y-3 text-white/70">
              <li>Next.js App Router</li>
              <li>React</li>
              <li>TypeScript</li>
              <li>Tailwind CSS</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6 text-center text-sm text-white/50">
          © {new Date().getFullYear()} CodeTutor. All rights reserved.
        </div>
      </div>
    </footer>
  );
}