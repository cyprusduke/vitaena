"use client"

import { useState } from "react"
import type { FillInTheBlankExercise } from "@/lib/types"

interface Props {
  exercise: FillInTheBlankExercise
  onResult?: (correct: boolean) => void
}

export default function FillInTheBlank({ exercise, onResult }: Props) {
  const [inputs, setInputs] = useState<string[]>(exercise.blanks.map(() => ""))
  const [checked, setChecked] = useState(false)

  const handleCheck = () => {
    const allCorrect = exercise.blanks.every(
      (blank, i) => inputs[i].trim().toLowerCase() === blank.answer.toLowerCase()
    )
    setChecked(true)
    onResult?.(allCorrect)
  }
  const handleReset = () => {
    setInputs(exercise.blanks.map(() => ""))
    setChecked(false)
  }

  const allCorrect =
    checked &&
    exercise.blanks.every(
      (blank, i) => inputs[i].trim().toLowerCase() === blank.answer.toLowerCase()
    )

  return (
    <div className="space-y-6">
      <p className="text-stone-700 text-lg leading-relaxed">{exercise.question}</p>

      <div className="flex flex-wrap gap-3">
        {exercise.blanks.map((blank, i) => (
          <div key={i} className="flex flex-col gap-1">
            <input
              type="text"
              value={inputs[i]}
              onChange={(e) => {
                const next = [...inputs]
                next[i] = e.target.value
                setInputs(next)
              }}
              disabled={checked}
              placeholder="..."
              className={`w-24 border-b-2 bg-transparent text-center text-xl font-serif focus:outline-none py-1 transition
                ${
                  checked
                    ? inputs[i].trim().toLowerCase() === blank.answer.toLowerCase()
                      ? "border-green-500 text-green-700"
                      : "border-red-400 text-red-600"
                    : "border-stone-400 focus:border-amber-500 text-stone-800"
                }`}
            />
            {checked && inputs[i].trim().toLowerCase() !== blank.answer.toLowerCase() && (
              <span className="text-xs text-green-600 text-center">→ {blank.answer}</span>
            )}
          </div>
        ))}
      </div>

      {checked && (
        <div
          className={`rounded-lg px-4 py-3 text-sm font-medium ${
            allCorrect ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
          }`}
        >
          {allCorrect ? "Верно!" : "Не совсем. Правильный ответ выделен зелёным."}
        </div>
      )}

      <div className="flex gap-3">
        {!checked ? (
          <button
            onClick={handleCheck}
            disabled={inputs.some((v) => !v.trim())}
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
