"use client"

import { useState, useRef } from "react"
import type { TableChoiceExercise } from "@/lib/types"
import Collapsible from "./Collapsible"

interface Props {
  exercise: TableChoiceExercise
  onResult?: (correct: boolean) => void
  onReset?: () => void
}

export default function TableChoice({ exercise, onResult, onReset }: Props) {
  const totalCells = exercise.rows.reduce((sum, r) => sum + r.cells.length, 0)

  const [selected, setSelected] = useState<(string | null)[][]>(
    exercise.rows.map((r) => r.cells.map(() => null))
  )
  const [checked, setChecked] = useState(false)
  const [playing, setPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  const allFilled = selected.every((row) => row.every((v) => v !== null))

  const handleSelect = (rowIdx: number, colIdx: number, value: string) => {
    if (checked) return
    setSelected((prev) => {
      const next = prev.map((r) => [...r])
      next[rowIdx][colIdx] = value || null
      return next
    })
  }

  const handleCheck = () => {
    if (!allFilled) return
    setChecked(true)
    const allCorrect = exercise.rows.every((row, ri) =>
      row.cells.every((cell, ci) => selected[ri][ci] === cell.answer)
    )
    onResult?.(allCorrect)
  }

  const handleReset = () => {
    setSelected(exercise.rows.map((r) => r.cells.map(() => null)))
    setChecked(false)
    onReset?.()
  }

  const handlePlay = () => {
    if (!audioRef.current) return
    if (playing) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      setPlaying(false)
    } else {
      audioRef.current.play()
      setPlaying(true)
    }
  }

  const correctCount = checked
    ? exercise.rows.reduce(
        (sum, row, ri) =>
          sum + row.cells.filter((cell, ci) => selected[ri][ci] === cell.answer).length,
        0
      )
    : 0

  return (
    <div className="space-y-6">
      {exercise.audioSrc && (
        <div className="flex items-center gap-4">
          <audio ref={audioRef} src={exercise.audioSrc} onEnded={() => setPlaying(false)} />
          <button
            onClick={handlePlay}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium transition
              ${playing
                ? "bg-amber-100 text-amber-700 hover:bg-amber-200"
                : "bg-stone-800 text-white hover:bg-stone-700"
              }`}
          >
            {playing ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                  <path fillRule="evenodd" d="M6.75 5.25a.75.75 0 01.75-.75H9a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H7.5a.75.75 0 01-.75-.75V5.25zm7.5 0A.75.75 0 0115 4.5h1.5a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H15a.75.75 0 01-.75-.75V5.25z" clipRule="evenodd" />
                </svg>
                Стоп
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                  <path d="M8 5v14l11-7z" />
                </svg>
                Слушать
              </>
            )}
          </button>
        </div>
      )}

      {exercise.text && (
        <Collapsible label="Текст">
          <p className="font-serif text-stone-800 text-sm leading-relaxed whitespace-pre-line">
            {exercise.text}
          </p>
        </Collapsible>
      )}

      {exercise.translation && (
        <Collapsible label="Перевод">
          <p className="text-stone-600 text-sm leading-relaxed whitespace-pre-line">
            {exercise.translation}
          </p>
        </Collapsible>
      )}

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr>
              <th className="text-left px-4 py-3 bg-stone-100 border border-stone-200 text-stone-500 font-medium w-[30%]" />
              {exercise.columnHeaders.map((header) => (
                <th
                  key={header}
                  className="px-4 py-3 bg-amber-50 border border-stone-200 text-amber-800 font-semibold text-center font-serif"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {exercise.rows.map((row, ri) => (
              <tr key={ri} className={ri % 2 === 0 ? "bg-white" : "bg-stone-50"}>
                <td className="px-4 py-3 border border-stone-200 font-serif text-stone-700 font-medium leading-snug">
                  {row.question}
                </td>
                {row.cells.map((cell, ci) => {
                  const val = selected[ri][ci]
                  const isCorrect = checked && val === cell.answer
                  const isWrong = checked && val !== cell.answer

                  const selectCls = [
                    "w-full px-2 py-1.5 rounded border text-sm transition-all cursor-pointer font-sans appearance-none",
                    !checked && !val
                      ? "border-dashed border-stone-300 bg-white text-stone-400"
                      : !checked && val
                      ? "border-amber-400 bg-amber-50 text-amber-800"
                      : isCorrect
                      ? "border-green-400 bg-green-50 text-green-800"
                      : isWrong
                      ? "border-red-400 bg-red-50 text-red-700"
                      : "",
                  ].join(" ")

                  return (
                    <td key={ci} className="px-3 py-2 border border-stone-200 text-center">
                      <select
                        value={val ?? ""}
                        onChange={(e) => handleSelect(ri, ci, e.target.value)}
                        disabled={checked}
                        className={selectCls}
                      >
                        <option value="">—</option>
                        {cell.options.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                      {checked && isWrong && (
                        <p className="text-xs text-green-700 mt-1 font-medium">{cell.answer}</p>
                      )}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {checked && (
        <div
          className={`rounded-lg px-4 py-3 text-sm font-medium ${
            correctCount === totalCells
              ? "bg-green-50 text-green-700"
              : "bg-amber-50 text-amber-700"
          }`}
        >
          {correctCount === totalCells
            ? "Отлично! Все ответы верны."
            : `Верно ${correctCount} из ${totalCells}. Правильные ответы показаны под ошибками.`}
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
