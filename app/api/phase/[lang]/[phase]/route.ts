import { NextResponse } from "next/server";
import { getLanguage } from "@/lib/courseManifest";
import { loadPhase } from "@/lib/loadPhase";

export async function GET(
  _req: Request,
  { params }: { params: { lang: string; phase: string } }
) {
  const lang = getLanguage(params.lang);
  if (!lang) return NextResponse.json({ error: "Unknown language" }, { status: 404 });

  const phaseNum = Number(params.phase);
  const data = loadPhase(lang.id, phaseNum);

  if (!data) {
    return NextResponse.json({ error: "Lesson not found yet — content coming soon." }, { status: 404 });
  }

  return NextResponse.json({ language: lang, lesson: data });
}
