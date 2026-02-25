# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # start development server
npm run build    # production build (also validates all static params)
npm run start    # serve production build
```

No test runner is configured.

## Architecture

Vitaena is a Greek language learning site. The UI language is Russian; content is in Greek. It is a fully statically-exported Next.js App Router site — no backend, no database.

### Content system

All learning content lives in `/content/` as plain TypeScript:

- `/content/topics/<slug>.ts` — exports a single `Topic` object
- `/content/index.ts` — aggregates all topics into `topics[]` and exports `getTopicBySlug()`

To add a new topic: create `/content/topics/<slug>.ts`, import and add it to the array in `/content/index.ts`. The `generateStaticParams()` calls in both dynamic route pages automatically pick it up.

### Routing

```
/                          → src/app/page.tsx          (topic grid)
/topics/[slug]             → src/app/topics/[slug]/page.tsx      (exercise list)
/topics/[slug]/[id]        → src/app/topics/[slug]/[id]/page.tsx (exercise page)
```

Both dynamic routes implement `generateStaticParams()` for full static export. `params` must be `await`ed (it is a `Promise` in Next.js 16+).

Content is imported from dynamic route pages using relative paths:
- From `[slug]/page.tsx`: `"../../../../content"`
- From `[slug]/[id]/page.tsx`: `"../../../../../content"`

### Exercise rendering pipeline

```
ExercisePage (server)
  └─ ExerciseWithSave (client) — wraps renderer, persists result to localStorage
       └─ ExerciseRenderer — switch(exercise.type) dispatcher
            └─ FillInTheBlank | MultipleChoice | AudioExercise |
               ReadingComprehension | TrueFalse | WordFill
```

All exercise leaf components are `"use client"`. `ExerciseRenderer` itself has no directive and acts as a pure dispatcher.

### State persistence

Exercise results are stored in `localStorage`:
- Key: `vitaena_result_${topicSlug}_${exerciseId}` → `"correct"` | `"incorrect"`
- Key: `vitaena_last_${topicSlug}` → last-visited exercise id

Cross-component sync uses the custom event `vitaena-result-changed` dispatched on `window`.

### Types (`src/lib/types.ts`)

Six exercise types: `fill-in-the-blank`, `multiple-choice`, `audio`, `reading-comprehension`, `true-false`, `word-fill`. Each has a discriminated union interface extending `BaseExercise`. Adding a new type requires: updating the union in `types.ts`, creating a component in `src/components/exercises/`, and adding a case to `ExerciseRenderer`.

### Layout details

- Font: Noto Serif (latin + greek subsets), loaded via `next/font/google`
- Header height is synced to a CSS variable `--header-height` via `HeaderHeightSync` (client component using `ResizeObserver`)
- The exercise page renders a fixed left sidebar (`xl:` breakpoint and above) with per-exercise progress indicators; a mobile progress bar renders inline

### Tailwind

Tailwind v4 — configured via `@import "tailwindcss"` in `globals.css`. No `tailwind.config.ts`. Design tokens use stone, amber, green, red palettes.

### Audio files

Place audio at `/public/audio/<topic-slug>/<filename>.mp3` and reference as `/audio/<topic-slug>/<filename>.mp3` in the `audioSrc` field.
