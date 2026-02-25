"use client"

import { useState, useRef } from "react"
import type { OpenQuestionsExercise } from "@/lib/types"
import Collapsible from "./Collapsible"

interface Props {
  exercise: OpenQuestionsExercise
}

export default function OpenQuestions({ exercise }: Props) {
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

      {/* Текст диалога */}
      {exercise.text && (
        <Collapsible label="Текст">
          <div className="space-y-1.5">
            {exercise.text.split("\n").map((line, i) => {
              const colonIdx = line.indexOf(":")
              if (colonIdx === -1) return <p key={i} className="font-serif text-stone-800 leading-relaxed text-sm">{line}</p>
              const speaker = line.slice(0, colonIdx)
              const speech = line.slice(colonIdx + 1)
              return (
                <p key={i} className="font-serif text-stone-800 leading-relaxed text-sm">
                  <span className="font-semibold text-stone-600">{speaker}:</span>
                  {speech}
                </p>
              )
            })}
          </div>
        </Collapsible>
      )}

      {/* Вопросы */}
      <div className="space-y-4">
        {exercise.questions.map((q, i) => (
          <div key={i} className="flex gap-3">
            <span className="flex-shrink-0 mt-0.5 w-6 h-6 rounded-full bg-amber-100 text-amber-700 text-xs font-bold flex items-center justify-center">
              {i + 1}
            </span>
            <p className="text-stone-800 text-sm leading-relaxed pt-0.5">{q.question}</p>
          </div>
        ))}
      </div>

      {/* Ответы */}
      <Collapsible label="Ответы">
        <div className="space-y-3">
          {exercise.questions.map((q, i) => (
            <div key={i} className="flex gap-3">
              <span className="flex-shrink-0 mt-0.5 w-6 h-6 rounded-full bg-stone-100 text-stone-500 text-xs font-bold flex items-center justify-center">
                {i + 1}
              </span>
              <div>
                <p className="text-xs text-stone-400 mb-0.5">{q.question}</p>
                <p className="text-sm text-stone-700 font-serif leading-relaxed">{q.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </Collapsible>
    </div>
  )
}
