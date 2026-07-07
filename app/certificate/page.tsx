"use client";

import { useEffect, useRef, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { LANGUAGES, LanguageId, getLanguage } from "@/lib/courseManifest";
import {
  LanguageCertificate,
  ensureLanguageCertificate,
  getAllCertificates,
  getOverallStats,
  isLanguageCompleted,
  loadProgress,
} from "@/lib/progress";
import Certificate from "@/components/Certificate";
import EmptyState from "@/components/ui/EmptyState";

export default function CertificatePage() {
  return (
    <Suspense fallback={<p className="text-white/50">Loading…</p>}>
      <CertificatePageInner />
    </Suspense>
  );
}

function CertificatePageInner() {
  const searchParams = useSearchParams();
  const requestedLang = searchParams.get("lang") as LanguageId | null;
  const justCompleted = searchParams.get("justCompleted") === "1";

  const [stats, setStats] = useState<ReturnType<typeof getOverallStats> | null>(null);
  const [certs, setCerts] = useState<LanguageCertificate[]>([]);
  const [activeLang, setActiveLang] = useState<LanguageId | null>(requestedLang);
  const [name, setName] = useState("");
  const [qrDataUrl, setQrDataUrl] = useState<string>();
  const [showCelebration, setShowCelebration] = useState(justCompleted);
  const [copied, setCopied] = useState(false);
  const certRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const s = getOverallStats();
    setStats(s);
    setCerts(getAllCertificates());
    const existing = loadProgress();
    if (existing.studentName) setName(existing.studentName);
  }, []);

  useEffect(() => {
    if (justCompleted) {
      import("canvas-confetti").then(({ default: confetti }) => {
        confetti({ particleCount: 160, spread: 90, origin: { y: 0.6 } });
        setTimeout(() => confetti({ particleCount: 80, spread: 120, origin: { y: 0.4 } }), 400);
      });
    }
  }, [justCompleted]);

  const activeCert = activeLang ? certs.find((c) => c.lang === activeLang) : undefined;

  useEffect(() => {
    if (!activeCert) return setQrDataUrl(undefined);
    import("qrcode").then((QRCode) => {
      QRCode.toDataURL(`CodeTutor Certificate Verification: ${activeCert.certificateId}`, {
        margin: 1,
        color: { dark: "#0a0e1a", light: "#ffffff00" },
      }).then(setQrDataUrl);
    });
  }, [activeCert]);

  if (!stats) return <p className="text-white/50">Loading…</p>;

  const eligibleLangs = LANGUAGES.filter((l) => isLanguageCompleted(loadProgress(), l.id));

  function confirmName(langId: LanguageId) {
    if (!name.trim()) return;
    ensureLanguageCertificate(langId, name.trim());
    setCerts(getAllCertificates());
    setActiveLang(langId);
  }

  async function downloadPng() {
    if (!activeCert) return;
    const html2canvas = (await import("html2canvas")).default;
    if (!certRef.current) return;
    const canvas = await html2canvas(certRef.current, { scale: 2, backgroundColor: null });
    const link = document.createElement("a");
    link.download = `CodeTutor-Certificate-${activeCert.certificateId}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  }

  async function downloadPdf() {
    if (!activeCert) return;
    const html2canvas = (await import("html2canvas")).default;
    const { jsPDF } = await import("jspdf");
    if (!certRef.current) return;
    const canvas = await html2canvas(certRef.current, { scale: 2, backgroundColor: null });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({ orientation: "landscape", unit: "px", format: [1200, 850] });
    pdf.addImage(imgData, "PNG", 0, 0, 1200, 850);
    pdf.save(`CodeTutor-Certificate-${activeCert.certificateId}.pdf`);
  }

  function printCertificate() {
    window.print();
  }

  async function shareCertificate() {
    if (!activeCert || !activeLang) return;
    const lang = getLanguage(activeLang);
    const shareText = `I just completed the ${lang?.name} course on CodeTutor! Certificate ID: ${activeCert.certificateId}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: "My CodeTutor Certificate", text: shareText });
        return;
      } catch {
        // user cancelled — fall through to clipboard copy
      }
    }
    await navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  // --- No languages completed yet ---
  if (eligibleLangs.length === 0) {
    return (
      <EmptyState
        icon="🔒"
        title="No certificates yet"
        description="Complete every phase of any single language to unlock that language's certificate immediately — you don't need to finish all six."
        action={
          <Link href={`/${LANGUAGES[0].id}`} className="btn-primary">
            Start Learning
          </Link>
        }
      />
    );
  }

  return (
    <div>
      {showCelebration && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-6 print:hidden">
          <div className="card p-8 max-w-md text-center">
            <p className="text-5xl mb-3">🎉</p>
            <h2 className="text-2xl font-bold mb-2">Congratulations!</h2>
            <p className="text-white/60 mb-6">
              You&apos;ve completed {requestedLang ? getLanguage(requestedLang)?.name : "this language"}. Your
              certificate is ready — no need to finish any other language first.
            </p>
            <button className="btn-primary" onClick={() => setShowCelebration(false)}>
              View My Certificate
            </button>
          </div>
        </div>
      )}

      <h1 className="text-3xl font-bold mb-2">Your Certificates</h1>
      <p className="text-white/50 mb-8">
        One certificate per language, issued the moment you finish that language.
      </p>

      {/* Language picker */}
      <div className="flex flex-wrap gap-2 mb-8 print:hidden">
        {eligibleLangs.map((l) => (
          <button
            key={l.id}
            onClick={() => setActiveLang(l.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition ${
              activeLang === l.id ? "bg-gold-500 text-navy-950" : "bg-white/5 text-white/60 hover:bg-white/10"
            }`}
          >
            <span>{l.icon}</span> {l.name}
            {certs.find((c) => c.lang === l.id) && <span className="text-emerald-400">✓</span>}
          </button>
        ))}
      </div>

      {!activeLang ? (
        <p className="text-white/50">Choose a completed language above to view its certificate.</p>
      ) : !activeCert ? (
        <div className="card p-6 max-w-md">
          <p className="font-medium mb-3">
            Enter the full name to print on your {getLanguage(activeLang)?.name} certificate
          </p>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Abhay Kishor Malla"
            className="w-full bg-white/5 border border-white/15 rounded-lg px-4 py-2 mb-4 outline-none focus:border-gold-500"
          />
          <button className="btn-primary" onClick={() => confirmName(activeLang)}>
            Generate Certificate
          </button>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto mb-6">
            <div style={{ transform: "scale(0.6)", transformOrigin: "top left", width: 1200 * 0.6, height: 850 * 0.6 }}>
              <Certificate
                ref={certRef}
                studentName={activeCert.studentName}
                courseName={`${getLanguage(activeLang)?.name} Programming`}
                date={new Date(activeCert.issuedAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
                certificateId={activeCert.certificateId}
                qrDataUrl={qrDataUrl}
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-4 print:hidden">
            <button className="btn-primary" onClick={downloadPdf}>
              Download PDF
            </button>
            <button className="btn-secondary" onClick={downloadPng}>
              Download PNG
            </button>
            <button className="btn-secondary" onClick={printCertificate}>
              Print
            </button>
            <button className="btn-secondary" onClick={shareCertificate}>
              {copied ? "Copied!" : "Share"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
