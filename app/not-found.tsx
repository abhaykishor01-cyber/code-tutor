import Link from "next/link";

export default function NotFound() {
  return (
    <div className="card p-8 text-center max-w-md mx-auto mt-16">
      <p className="text-4xl mb-3" aria-hidden="true">
        🧭
      </p>
      <h1 className="text-xl font-bold mb-2">Page not found</h1>
      <p className="text-white/50 mb-6">
        That link doesn&apos;t lead anywhere on CodeTutor. Let&apos;s get you back on the path.
      </p>
      <div className="flex items-center justify-center gap-3">
        <Link href="/" className="btn-primary">
          Back to Home
        </Link>
        <Link href="/dashboard" className="btn-secondary">
          View Dashboard
        </Link>
      </div>
    </div>
  );
}
