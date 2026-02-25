import Link from "next/link"
import type { Exercise } from "@/lib/types"

const typeLabels: Record<Exercise["type"], string> = {
  "fill-in-the-blank": "Вставить букву",
  "multiple-choice": "Выбор ответа",
  audio: "На слух",
  "reading-comprehension": "Аудирование",
  "true-false": "Правда/Ложь",
  "word-fill": "Вставить слово",
  "select-fill": "Диалог",
  "open-questions": "Аудирование",
}

const typeBadgeColors: Record<Exercise["type"], string> = {
  "fill-in-the-blank": "bg-blue-100 text-blue-700",
  "multiple-choice": "bg-green-100 text-green-700",
  audio: "bg-purple-100 text-purple-700",
  "reading-comprehension": "bg-orange-100 text-orange-700",
  "true-false": "bg-teal-100 text-teal-700",
  "word-fill": "bg-rose-100 text-rose-700",
  "select-fill": "bg-amber-100 text-amber-700",
  "open-questions": "bg-sky-100 text-sky-700",
}

interface ExerciseCardProps {
  exercise: Exercise
  topicSlug: string
  index: number
}

export default function ExerciseCard({ exercise, topicSlug, index }: ExerciseCardProps) {
  return (
    <Link
      href={`/topics/${topicSlug}/${exercise.id}`}
      className="flex items-start gap-4 rounded-xl border border-stone-200 bg-white p-5 shadow-sm transition hover:shadow-md hover:border-amber-400"
    >
      <span className="flex-shrink-0 w-8 h-8 rounded-full bg-stone-100 text-stone-500 text-sm font-semibold flex items-center justify-center">
        {index + 1}
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-stone-800 text-sm leading-snug line-clamp-2">{exercise.question}</p>
      </div>
      <span className={`flex-shrink-0 text-xs font-medium px-2 py-1 rounded-full ${typeBadgeColors[exercise.type]}`}>
        {typeLabels[exercise.type]}
      </span>
    </Link>
  )
}
