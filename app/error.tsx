"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // Logged for local debugging only — no details are shown to the learner below.
    console.error(error);
  }, [error]);

  return (
    <div className="card p-8 text-center max-w-md mx-auto mt-16">
      <p className="text-4xl mb-3" aria-hidden="true">
        ⚠️
      </p>
      <h1 className="text-xl font-bold mb-2">Something went wrong</h1>
      <p className="text-white/50 mb-6">
        That wasn&apos;t supposed to happen. Your saved progress is safe — it lives in your browser, not on this page.
      </p>
      <div className="flex items-center justify-center gap-3">
        <button onClick={reset} className="btn-primary">
          Try again
        </button>
        <Link href="/" className="btn-secondary">
          Back to Home
        </Link>
      </div>
    </div>
  );
}
