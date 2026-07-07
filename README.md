# CodeTutor

A structured, locked-path programming learning platform built with Next.js, React, TypeScript, and Tailwind CSS. Learners work through six languages — HTML/CSS, C, C++, Python, JavaScript, and Java — one phase at a time, with no login required and no data leaving the browser.

## Overview

CodeTutor's core idea is simple: **a phase can't be skipped.** Phase 2 of a language stays locked until Phase 1 of that *same* language is completed. Each language progresses entirely independently — finishing (or not finishing) one has no effect on any other. The moment every phase of a single language is complete, that language's certificate is generated immediately, without needing to touch the other five.

There is no backend and no account system. All progress — completed phases, streaks, quiz history, bookmarks, notes, and certificates — lives in the browser's `localStorage`.

## Features

- **Locked, sequential progression** per language, independent across languages
- **Dashboard** — overall and per-language progress, learning streaks, achievements, recent activity, and a Resume Learning shortcut back to your next unlocked phase
- **Lesson pages** with syntax-highlighted code examples, common mistakes, best practices, and key takeaways
- **Quizzes** — multiple-choice with instant scoring, plus a Q&A flashcard mode
- **Certificates** — generated per language the instant it's completed, with PDF and PNG export, a QR code, and a native share/copy action
- **Global search** across all six languages, available from the navigation bar on every page
- **Progress backup & restore** — export your progress to a JSON file and restore it later, useful before clearing browser data or moving to a new device
- **Dark / light theme**, with no flash of the wrong theme on load
- **Keyboard-accessible** navigation, search, and FAQ sections

## Installation

```bash
npm install
npm run dev
```

Visit `http://localhost:3000`.

To produce a production build:

```bash
npm run build
npm start
```

## Folder Structure

```
app/                      Next.js App Router pages
  [lang]/                 Per-language roadmap and lesson pages
  api/                    Server-side routes serving lesson JSON
  dashboard/              Progress dashboard
  certificate/            Certificate generation and preview
components/               Reusable UI and feature components
  ui/                      Shared primitives (nav, search, accordion, skeletons, theme toggle)
lib/                       Core logic: progress engine, storage, search index, JSON normalization
data/                      Lesson content, organized as data/<language>/phase-<n>.json
```

## Adding Lesson Content

Lesson JSON files can use different key casing and nesting styles across languages — `lib/normalize.ts` reconciles this automatically, so the rest of the app never needs to special-case any particular format.

Drop files into `data/<language>/phase-<n>.json`, following the existing sample files as a schema reference. Files can also keep more descriptive original names (e.g. `cpp_phase_9_exception_handling.json`) — `lib/loadPhase.ts` auto-detects the phase number from the filename or metadata either way.

Any phase not yet authored shows a friendly "content coming soon" message rather than breaking the page, and stays correctly locked by the progression system regardless. A phase marked `"isFallback": true` is flagged with a visible warning banner on both the roadmap and the lesson page, so placeholder content is never mistaken for finished content.

If you add or remove phases for a language, update `LANGUAGES[].totalPhases` in `lib/courseManifest.ts` to match.

## Data & Privacy

All learner data is stored exclusively in the browser via `localStorage` — there is no server-side database and nothing is transmitted anywhere. This means:

- Progress does not sync across devices or browsers
- Clearing browser data resets progress
- Learners can back up their progress from the dashboard (export/import as a JSON file) before clearing data or switching devices

No usage statistics, visitor counts, or analytics are collected or displayed anywhere in the app. Any numbers shown (phase counts, language counts) are computed directly from the actual course structure — never fabricated or estimated.

## Deployment

This is a standard Next.js app with no backend dependency — it deploys directly to Vercel or any Node-compatible host with no additional services required.

## Future Roadmap

The following are deliberately **not** implemented, to keep the current zero-backend architecture simple and reliable. They're reasonable directions for a future version:

- User accounts and cross-device sync (would require a backend and database)
- Certificate verification via a public lookup page
- Progressive Web App / offline support
- Expanded lesson content across all six languages (currently a sample phase exists per language to demonstrate the full pipeline; most phases still need authoring)

## Contributors

Built and maintained by Abhay Kishor Malla (Frontend/UI-UX) and Buddy (Core Logic/Data). See `TEAM_GUIDE.md` for the collaboration workflow, `TASK_BOARD.md` for current work in progress, and `PROJECT_ROADMAP.md` for the longer-term product direction.

## License

This project does not currently specify a license. Add one (e.g. MIT) before distributing publicly if you intend for others to reuse the code.
