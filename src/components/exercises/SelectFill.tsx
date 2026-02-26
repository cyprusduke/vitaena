"use client"

import { useState } from "react"
import type { SelectFillExercise, GrammarFillExercise } from "@/lib/types"
import Collapsible from "./Collapsible"

interface Props {
  exercise: SelectFillExercise | GrammarFillExercise
  onResult?: (correct: boolean) => void
  onReset?: () => void
}

type Segment = { type: "text"; content: string } | { type: "blank"; index: number }

function parseLine(line: string): Segment[] {
  const parts = line.split(/\[(\d+)\]/)
  const result: Segment[] = []
  for (let i = 0; i < parts.length; i++) {
    if (i % 2 === 0) {
      if (parts[i]) result.push({ type: "text", content: parts[i] })
    } else {
      result.push({ type: "blank", index: parseInt(parts[i]) - 1 })
    }
  }
  return result
}

export default function SelectFill({ exercise, onResult, onReset }: Props) {
  const [selected, setSelected] = useState<(string | null)[]>(
    exercise.blanks.map(() => null)
  )
  const [checked, setChecked] = useState(false)
  const [shuffledOptions] = useState(() =>
    exercise.blanks.map((b) => [...b.options].sort(() => Math.random() - 0.5))
  )

  const allFilled = selected.every((s) => s !== null)

  const handleChange = (index: number, value: string) => {
    if (checked) return
    const next = [...selected]
    next[index] = value || null
    setSelected(next)
  }

  const handleCheck = () => {
    if (!allFilled) return
    setChecked(true)
    onResult?.(exercise.blanks.every((b, i) => selected[i] === b.answer))
  }

  const handleReset = () => {
    setSelected(exercise.blanks.map(() => null))
    setChecked(false)
    onReset?.()
  }

  const correctCount = checked
    ? exercise.blanks.filter((b, i) => selected[i] === b.answer).length
    : 0

  const dialogs = exercise.text.split("\n\n")

  return (
    <div className="space-y-6">
      {exercise.translation && (
        <Collapsible label="Перевод">
          <div className="space-y-3">
            {exercise.translation.split("\n\n").map((para, i) => (
              <p key={i} className="text-stone-600 leading-relaxed text-sm">
                {para}
              </p>
            ))}
          </div>
        </Collapsible>
      )}

      <div className="space-y-3">
        {dialogs.map((dialog, di) => {
          const lines = dialog.split("\n")
          return (
            <div key={di} className="rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 space-y-2">
              {lines.map((line, li) => {
                const segments = parseLine(line)
                return (
                  <p key={li} className="font-serif text-stone-800 leading-relaxed text-base">
                    {segments.map((seg, si) => {
                      if (seg.type === "text") return <span key={si}>{seg.content}</span>

                      const idx = seg.index
                      const val = selected[idx]
                      const isCorrect = checked && val === exercise.blanks[idx].answer
                      const isWrong = checked && val !== exercise.blanks[idx].answer

                      const selectCls = [
                        "inline-block mx-1 px-2 py-0.5 rounded border text-sm font-sans font-medium transition-all cursor-pointer",
                        !checked && !val
                          ? "border-dashed border-stone-300 bg-white text-stone-400"
                          : !checked && val
                          ? "border-amber-400 bg-amber-50 text-amber-800"
                          : isCorrect
                          ? "border-green-300 bg-green-50 text-green-800"
                          : isWrong
                          ? "border-red-300 bg-red-50 text-red-700"
                          : "",
                      ].join(" ")

                      return (
                        <select
                          key={si}
                          value={val ?? ""}
                          onChange={(e) => handleChange(idx, e.target.value)}
                          disabled={checked}
                          className={selectCls}
                        >
                          <option value="">...</option>
                          {shuffledOptions[idx].map((opt) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                      )
                    })}
                  </p>
                )
              })}
            </div>
          )
        })}
      </div>

      {checked && (
        <div
          className={`rounded-lg px-4 py-3 text-sm font-medium ${
            correctCount === exercise.blanks.length
              ? "bg-green-50 text-green-700"
              : "bg-amber-50 text-amber-700"
          }`}
        >
          {correctCount === exercise.blanks.length
            ? "Отлично! Все формы выбраны верно."
            : `Верно ${correctCount} из ${exercise.blanks.length}. Правильные ответы выделены зелёным.`}
        </div>
      )}

      {checked && correctCount < exercise.blanks.length && (
        <div className="space-y-1">
          <p className="text-xs text-stone-400 uppercase tracking-wide font-medium">
            Правильные ответы:
          </p>
          {exercise.blanks.map((b, i) =>
            selected[i] !== b.answer ? (
              <p key={i} className="text-sm text-stone-600">
                <span className="text-stone-400 font-medium mr-1">{i + 1}.</span>
                {b.answer}
              </p>
            ) : null
          )}
        </div>
      )}

      <div className="flex gap-3">
        {!checked ? (
          <button
            onClick={handleCheck}
            disabled={!allFilled}
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
