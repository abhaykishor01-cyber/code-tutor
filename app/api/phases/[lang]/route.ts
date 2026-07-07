import { NextResponse } from "next/server";
import { getLanguage } from "@/lib/courseManifest";
import { loadPhase } from "@/lib/loadPhase";

export async function GET(_req: Request, { params }: { params: { lang: string } }) {
  const lang = getLanguage(params.lang);
  if (!lang) return NextResponse.json({ error: "Unknown language" }, { status: 404 });

  const phases = [];
  for (let p = 1; p <= lang.totalPhases; p++) {
    const data = loadPhase(lang.id, p);
    phases.push({
      phase: p,
      title: data?.title ?? `Phase ${p}`,
      available: Boolean(data),
      isFallback: data?.isFallback ?? false,
      estimatedTime: data?.estimatedTime,
    });
  }

  return NextResponse.json({ language: lang, phases });
}
