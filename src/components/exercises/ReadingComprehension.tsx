"use client"

import { useState, useRef } from "react"
import type { ReadingComprehensionExercise } from "@/lib/types"
import Collapsible from "./Collapsible"

interface Props {
  exercise: ReadingComprehensionExercise
  onResult?: (correct: boolean) => void
  onReset?: () => void
}

export default function ReadingComprehension({ exercise, onResult, onReset }: Props) {
  const [selected, setSelected] = useState<(string | null)[]>(
    exercise.questions.map(() => null)
  )
  const [checked, setChecked] = useState(false)
  const [playing, setPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

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

  const allAnswered = selected.every((s) => s !== null)

  const handleCheck = () => {
    if (!allAnswered) return
    setChecked(true)
    onResult?.(exercise.questions.every((q, i) => selected[i] === q.answer))
  }

  const handleReset = () => {
    setSelected(exercise.questions.map(() => null))
    setChecked(false)
    onReset?.()
  }

  const correctCount = checked
    ? exercise.questions.filter((q, i) => selected[i] === q.answer).length
    : 0

  return (
    <div className="space-y-6">
      {/* Аудиоплеер */}
      {exercise.audioSrc && (
        <div className="flex items-center gap-4">
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
          <span className="text-xs text-stone-400">Прослушайте аудио и ответьте на вопросы</span>
          <audio ref={audioRef} src={exercise.audioSrc} onEnded={() => setPlaying(false)} />
        </div>
      )}

      {/* Текст (скрыт по умолчанию) */}
      <Collapsible label="Текст">
        <p className="font-serif text-stone-800 leading-relaxed text-base">
          {exercise.text}
        </p>
      </Collapsible>

      {/* Перевод (скрыт по умолчанию) */}
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

      {/* Вопросы */}
      <div className="space-y-7">
        {exercise.questions.map((q, qi) => {
          const sel = selected[qi]
          return (
            <div key={qi}>
              <p className="text-sm font-semibold text-stone-700 mb-3">
                <span className="text-amber-500 mr-1.5">{qi + 1}.</span>
                {q.question}
              </p>
              <div className="space-y-2">
                {q.options.map((option) => {
                  let cls =
                    "w-full text-left px-4 py-2.5 rounded-lg border text-sm font-serif transition focus:outline-none"
                  if (!checked) {
                    cls +=
                      sel === option
                        ? " border-amber-400 bg-amber-50 text-amber-900"
                        : " border-stone-200 bg-white text-stone-700 hover:border-stone-300 hover:bg-stone-50"
                  } else if (option === q.answer) {
                    cls += " border-green-500 bg-green-50 text-green-800"
                  } else if (option === sel) {
                    cls += " border-red-400 bg-red-50 text-red-700"
                  } else {
                    cls += " border-stone-200 bg-white text-stone-400"
                  }
                  return (
                    <button
                      key={option}
                      disabled={checked}
                      onClick={() => {
                        if (checked) return
                        const next = [...selected]
                        next[qi] = option
                        setSelected(next)
                      }}
                      className={cls}
                    >
                      {option}
                    </button>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      {/* Результат */}
      {checked && (
        <div
          className={`rounded-lg px-4 py-3 text-sm font-medium ${
            correctCount === exercise.questions.length
              ? "bg-green-50 text-green-700"
              : "bg-amber-50 text-amber-700"
          }`}
        >
          {correctCount === exercise.questions.length
            ? "Отлично! Все ответы верны."
            : `Верно ${correctCount} из ${exercise.questions.length}. Правильные ответы выделены зелёным.`}
        </div>
      )}

      {/* Кнопки */}
      <div className="flex gap-3">
        {!checked ? (
          <button
            onClick={handleCheck}
            disabled={!allAnswered}
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
