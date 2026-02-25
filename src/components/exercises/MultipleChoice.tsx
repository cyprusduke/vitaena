"use client"

import { useState } from "react"
import type { MultipleChoiceExercise } from "@/lib/types"

interface Props {
  exercise: MultipleChoiceExercise
  onResult?: (correct: boolean) => void
}

export default function MultipleChoice({ exercise, onResult }: Props) {
  const [selected, setSelected] = useState<string | null>(null)
  const [checked, setChecked] = useState(false)

  const handleCheck = () => {
    if (selected !== null) {
      setChecked(true)
      onResult?.(selected === exercise.answer)
    }
  }
  const handleReset = () => {
    setSelected(null)
    setChecked(false)
  }

  const isCorrect = checked && selected === exercise.answer

  const getOptionClass = (option: string) => {
    const base =
      "w-full text-left px-4 py-3 rounded-xl border text-sm font-medium transition focus:outline-none"
    if (!checked) {
      return `${base} ${
        selected === option
          ? "border-amber-500 bg-amber-50 text-amber-800"
          : "border-stone-200 bg-white text-stone-700 hover:border-stone-300 hover:bg-stone-50"
      }`
    }
    if (option === exercise.answer) return `${base} border-green-500 bg-green-50 text-green-800`
    if (option === selected) return `${base} border-red-400 bg-red-50 text-red-700`
    return `${base} border-stone-200 bg-white text-stone-400`
  }

  return (
    <div className="space-y-6">
      <p className="text-stone-700 text-lg leading-relaxed">{exercise.question}</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {exercise.options.map((option) => (
          <button
            key={option}
            onClick={() => !checked && setSelected(option)}
            className={getOptionClass(option)}
            disabled={checked}
          >
            {option}
          </button>
        ))}
      </div>

      {checked && (
        <div
          className={`rounded-lg px-4 py-3 text-sm font-medium ${
            isCorrect ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
          }`}
        >
          {isCorrect ? "Верно!" : `Неверно. Правильный ответ: ${exercise.answer}`}
        </div>
      )}

      <div className="flex gap-3">
        {!checked ? (
          <button
            onClick={handleCheck}
            disabled={selected === null}
            className="px-5 py-2 rounded-lg bg-amber-500 text-white font-medium text-sm hover:bg-amber-600 transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Проверить
          </button>
        ) : (
          <button
            onClick={handleReset}
            className="px-5 py-2 rounded-lg bg-stone-200 text-stone-700 font-medium text-sm hover:bg-stone-300 transition"
          >
            Попробовать снова
          </button>
        )}
      </div>
    </div>
  )
}
