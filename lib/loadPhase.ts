import fs from "fs";
import path from "path";
import { normalizeLesson, NormalizedLesson } from "./normalize";
import { LanguageId } from "./courseManifest";

const DATA_DIR = path.join(process.cwd(), "data");

/**
 * Expected file naming convention: data/<language>/phase-<n>.json
 * e.g. data/cpp/phase-9.json, data/html/phase-1.json
 *
 * Drop your existing JSON files into these folders (renaming to this pattern,
 * or adjust the glob below to match your original filenames).
 */
export function loadPhase(lang: LanguageId, phase: number): NormalizedLesson | null {
  const dir = path.join(DATA_DIR, lang);
  if (!fs.existsSync(dir)) return null;

  const target = `phase-${phase}.json`;
  let filePath = path.join(dir, target);

  if (!fs.existsSync(filePath)) {
    // fallback: try to find any file in the folder whose name contains the phase number
    const files = fs.readdirSync(dir);
    const match = files.find((f) => {
      const numMatch = f.match(/phase[_\-]?(?:number[_\-]?|id[_\-]?)?(\d+)/i);
      return numMatch && Number(numMatch[1]) === phase;
    });
    if (!match) return null;
    filePath = path.join(dir, match);
  }

  try {
    const raw = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    return normalizeLesson(raw, phase);
  } catch (e) {
    console.error(`Failed to parse ${filePath}`, e);
    return null;
  }
}

export function listAvailablePhases(lang: LanguageId): number[] {
  const dir = path.join(DATA_DIR, lang);
  if (!fs.existsSync(dir)) return [];
  const files = fs.readdirSync(dir);
  const nums = files
    .map((f) => {
      const m = f.match(/phase[_\-]?(?:number[_\-]?|id[_\-]?)?(\d+)/i);
      return m ? Number(m[1]) : null;
    })
    .filter((n): n is number => n !== null);
  return Array.from(new Set(nums)).sort((a, b) => a - b);
}
