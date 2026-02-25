"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import type { Exercise } from "@/lib/types"

const typeLabels: Record<Exercise["type"], string> = {
  "fill-in-the-blank": "Вставить",
  "multiple-choice": "Выбор",
  audio: "На слух",
  "reading-comprehension": "Аудирование",
}

type Result = "correct" | "incorrect"
type ResultMap = Record<string, Result>

function readResults(topicSlug: string, exercises: Exercise[]): ResultMap {
  const map: ResultMap = {}
  for (const ex of exercises) {
    const val = localStorage.getItem(`vitaena_result_${topicSlug}_${ex.id}`)
    if (val === "correct" || val === "incorrect") map[ex.id] = val
  }
  return map
}

interface Props {
  exercises: Exercise[]
  topicSlug: string
  currentId: string
}

export default function ExerciseSidebar({ exercises, topicSlug, currentId }: Props) {
  const [results, setResults] = useState<ResultMap>({})

  useEffect(() => {
    localStorage.setItem(`vitaena_last_${topicSlug}`, currentId)
  }, [topicSlug, currentId])

  useEffect(() => {
    const refresh = () => setResults(readResults(topicSlug, exercises))
    refresh()
    window.addEventListener("vitaena-result-changed", refresh)
    return () => window.removeEventListener("vitaena-result-changed", refresh)
  }, [topicSlug, exercises])

  return (
    <nav className="space-y-0.5">
      {exercises.map((exercise, i) => {
        const isActive = exercise.id === currentId
        const result = results[exercise.id]

        const containerClass = isActive
          ? "bg-amber-50 border border-amber-200 text-amber-900"
          : result === "correct"
          ? "bg-green-50 border border-green-200 text-green-900 hover:bg-green-100"
          : result === "incorrect"
          ? "bg-red-50 border border-red-200 text-red-900 hover:bg-red-100"
          : "border border-transparent text-stone-600 hover:bg-stone-50 hover:text-stone-800"

        const circleClass = isActive
          ? "bg-amber-500 text-white"
          : result === "correct"
          ? "bg-green-500 text-white"
          : result === "incorrect"
          ? "bg-red-400 text-white"
          : "bg-stone-100 text-stone-500 group-hover:bg-stone-200"

        const labelClass = isActive
          ? "text-amber-600"
          : result === "correct"
          ? "text-green-600"
          : result === "incorrect"
          ? "text-red-500"
          : "text-stone-400"

        const circleContent =
          !isActive && result === "correct"
            ? "✓"
            : !isActive && result === "incorrect"
            ? "✗"
            : i + 1

        return (
          <Link
            key={exercise.id}
            href={`/topics/${topicSlug}/${exercise.id}`}
            className={`group flex items-start gap-2.5 rounded-lg px-3 py-2.5 transition ${containerClass}`}
          >
            <span
              className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center ${circleClass}`}
            >
              {circleContent}
            </span>
            <div className="flex-1 min-w-0">
              <p className="line-clamp-2 leading-snug text-xs">{exercise.question}</p>
              <span className={`text-xs mt-1 inline-block font-medium ${labelClass}`}>
                {typeLabels[exercise.type]}
              </span>
            </div>
          </Link>
        )
      })}
    </nav>
  )
}
