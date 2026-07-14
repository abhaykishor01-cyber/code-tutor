import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/ui/Nav";
import Footer from "@/components/ui/Footer";

export const metadata: Metadata = {
  title: "CodeTutor — Learn to Code, Properly",
  description: "A structured, locked-path programming tutor for HTML, C, C++, Python, JavaScript, and Java.",
};

// Runs before paint to avoid a flash of the wrong theme on load.
const THEME_INIT_SCRIPT = `
(function () {
  try {
    var stored = localStorage.getItem('coding-tutor:theme');
    var theme = stored || (matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
    if (theme === 'light') document.documentElement.classList.add('light');
    document.documentElement.setAttribute('data-theme', theme);
  } catch (e) {}
})();
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className="min-h-screen flex flex-col">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:top-2 focus:left-2 focus:bg-gold-500 focus:text-navy-950 focus:px-4 focus:py-2 focus:rounded-lg"
        >
          Skip to content
        </a>

        <Nav />

        <main
          id="main-content"
          className="mx-auto w-full max-w-6xl flex-1 px-6 py-10"
        >
          {children}
        </main>

        <Footer />
      </body>
    </html>
  );
}
