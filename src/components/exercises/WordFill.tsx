"use client"

import { useState, useEffect } from "react"
import type { WordFillExercise } from "@/lib/types"
import Collapsible from "./Collapsible"

interface Props {
  exercise: WordFillExercise
  onResult?: (correct: boolean) => void
  onReset?: () => void
}

type Segment = { type: "text"; content: string } | { type: "blank"; index: number }

function parseParagraph(para: string): Segment[] {
  const parts = para.split(/\[(\d+)\]/)
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

export default function WordFill({ exercise, onResult, onReset }: Props) {
  const [slots, setSlots] = useState<(string | null)[]>(exercise.answers.map(() => null))
  const [checked, setChecked] = useState(false)
  const [shuffledWords, setShuffledWords] = useState(exercise.words)

  useEffect(() => {
    setShuffledWords([...exercise.words].sort(() => Math.random() - 0.5))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Drag state
  const [dragOverSlot, setDragOverSlot] = useState<number | null>(null)
  const [dragOverBank, setDragOverBank] = useState(false)
  const [draggingFromSlot, setDraggingFromSlot] = useState<number | null>(null)
  const [draggingWord, setDraggingWord] = useState<string | null>(null)

  const usedWords = new Set(slots.filter(Boolean) as string[])
  const allFilled = slots.every((s) => s !== null)

  // ── Click ──────────────────────────────────────────────────────────────────

  const handleWordClick = (word: string) => {
    if (checked || usedWords.has(word)) return
    const firstEmpty = slots.findIndex((s) => s === null)
    if (firstEmpty === -1) return
    const next = [...slots]
    next[firstEmpty] = word
    setSlots(next)
  }

  const handleSlotClick = (index: number) => {
    if (checked || slots[index] === null) return
    const next = [...slots]
    next[index] = null
    setSlots(next)
  }

  // ── Drag from bank ─────────────────────────────────────────────────────────

  const handleBankDragStart = (e: React.DragEvent, word: string) => {
    e.dataTransfer.effectAllowed = "move"
    e.dataTransfer.setData("source", "bank")
    e.dataTransfer.setData("word", word)
    setDraggingWord(word)
    setDraggingFromSlot(null)
  }

  // ── Drag from slot ─────────────────────────────────────────────────────────

  const handleSlotDragStart = (e: React.DragEvent, idx: number) => {
    const word = slots[idx]
    if (!word) return
    e.dataTransfer.effectAllowed = "move"
    e.dataTransfer.setData("source", "slot")
    e.dataTransfer.setData("word", word)
    e.dataTransfer.setData("slotIndex", String(idx))
    setDraggingFromSlot(idx)
    setDraggingWord(word)
  }

  const handleDragEnd = () => {
    setDraggingWord(null)
    setDraggingFromSlot(null)
    setDragOverSlot(null)
    setDragOverBank(false)
  }

  // ── Drop on slot ───────────────────────────────────────────────────────────

  const handleSlotDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
    setDragOverSlot(idx)
    setDragOverBank(false)
  }

  const handleSlotDrop = (e: React.DragEvent, targetIdx: number) => {
    e.preventDefault()
    setDragOverSlot(null)

    const source = e.dataTransfer.getData("source")
    const word = e.dataTransfer.getData("word")
    const next = [...slots]

    if (source === "bank") {
      // If target already has a word, it just goes back to bank (auto via usedWords)
      next[targetIdx] = word
    } else if (source === "slot") {
      const fromIdx = parseInt(e.dataTransfer.getData("slotIndex"))
      if (fromIdx === targetIdx) return
      // Swap: put whatever was in target back into source slot
      next[fromIdx] = next[targetIdx]
      next[targetIdx] = word
    }

    setSlots(next)
    setDraggingWord(null)
    setDraggingFromSlot(null)
  }

  // ── Drop on bank area ──────────────────────────────────────────────────────

  const handleBankDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
    setDragOverBank(true)
  }

  const handleBankDragLeave = (e: React.DragEvent) => {
    // Only clear if leaving the bank container itself (not a child)
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setDragOverBank(false)
    }
  }

  const handleBankDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOverBank(false)

    const source = e.dataTransfer.getData("source")
    if (source === "slot") {
      const fromIdx = parseInt(e.dataTransfer.getData("slotIndex"))
      const next = [...slots]
      next[fromIdx] = null
      setSlots(next)
    }

    setDraggingWord(null)
    setDraggingFromSlot(null)
  }

  // ── Check / Reset ──────────────────────────────────────────────────────────

  const handleCheck = () => {
    if (!allFilled) return
    setChecked(true)
    onResult?.(exercise.answers.every((ans, i) => slots[i] === ans))
  }

  const handleReset = () => {
    setSlots(exercise.answers.map(() => null))
    setChecked(false)
    onReset?.()
  }

  const correctCount = checked
    ? exercise.answers.filter((ans, i) => slots[i] === ans).length
    : 0

  const sections = exercise.text.split("\n\n").map((section) =>
    section.split("\n").map(parseParagraph)
  )

  return (
    <div className="space-y-6">
      {/* Перевод */}
      {exercise.translation && (
        <Collapsible label="Перевод">
          <div className="space-y-3">
            {exercise.translation.split("\n\n").map((para, i) => (
              <p key={i} className="text-stone-600 leading-relaxed text-sm">{para}</p>
            ))}
          </div>
        </Collapsible>
      )}

      {/* Текст с пропусками */}
      <div className="space-y-4">
        {sections.map((lines, si) => (
          <div key={si}>
            {lines.map((segments, li) => (
          <p key={li} className="font-serif text-stone-800 leading-relaxed text-base">
            {segments.map((seg, segi) => {
              if (seg.type === "text") return <span key={segi}>{seg.content}</span>

              const idx = seg.index
              const filled = slots[idx]
              const isBeingDragged = draggingFromSlot === idx
              const isOver = dragOverSlot === idx
              const isCorrect = checked && filled === exercise.answers[idx]
              const isWrong = checked && filled !== exercise.answers[idx]

              let cls =
                "inline-flex items-center justify-center min-w-[90px] px-3 py-0.5 mx-0.5 rounded border text-sm font-sans font-medium transition-all"

              if (!checked) {
                if (isOver) {
                  cls += " border-amber-500 bg-amber-100 text-amber-800 scale-105"
                } else if (filled) {
                  cls += isBeingDragged
                    ? " border-amber-300 bg-amber-50 text-amber-600 opacity-50 cursor-grab"
                    : " border-amber-400 bg-amber-50 text-amber-800 cursor-grab hover:bg-amber-100"
                } else {
                  cls += " border-dashed border-stone-300 bg-stone-50 text-stone-300 cursor-default"
                }
              } else if (isCorrect) {
                cls += " border-green-300 bg-green-50 text-green-800"
              } else {
                cls += " border-red-300 bg-red-50 text-red-700"
              }

              return (
                <span
                  key={segi}
                  draggable={!checked && !!filled}
                  onDragStart={(e) => handleSlotDragStart(e, idx)}
                  onDragEnd={handleDragEnd}
                  onDragOver={(e) => !checked && handleSlotDragOver(e, idx)}
                  onDragLeave={() => setDragOverSlot(null)}
                  onDrop={(e) => !checked && handleSlotDrop(e, idx)}
                  onClick={() => handleSlotClick(idx)}
                  className={cls}
                >
                  {filled ?? <span className="text-stone-300 font-sans text-xs">{idx + 1}</span>}
                </span>
              )
            })}
          </p>
            ))}
          </div>
        ))}
      </div>

      {/* Банк слов — мобильные (скрыт на xl+) */}
      <div
        onDragOver={!checked ? handleBankDragOver : undefined}
        onDragLeave={!checked ? handleBankDragLeave : undefined}
        onDrop={!checked ? handleBankDrop : undefined}
        className={`xl:hidden rounded-xl p-3 transition-all ${
          dragOverBank
            ? "border-2 border-dashed border-amber-400 bg-amber-50"
            : "border-2 border-transparent"
        }`}
      >
        <p className="text-xs text-stone-400 uppercase tracking-wide font-medium mb-2">Слова</p>
        <div className="flex flex-wrap gap-2">
          {shuffledWords.map((word) => {
            const used = usedWords.has(word)
            const isBeingDragged = draggingWord === word && draggingFromSlot === null
            return (
              <span
                key={word}
                draggable={!used && !checked}
                onDragStart={(e) => !used && !checked && handleBankDragStart(e, word)}
                onDragEnd={handleDragEnd}
                onClick={() => handleWordClick(word)}
                className={`px-3 py-1.5 rounded-lg border text-sm font-medium transition select-none ${
                  used || checked
                    ? "border-stone-100 bg-stone-50 text-stone-300 cursor-default"
                    : isBeingDragged
                    ? "border-amber-300 bg-amber-50 text-amber-600 opacity-50 cursor-grab"
                    : "border-stone-200 bg-white text-stone-700 hover:border-amber-300 hover:bg-amber-50 hover:text-amber-800 cursor-grab"
                }`}
              >
                {word}
              </span>
            )
          })}
        </div>
      </div>

      {/* Правый сайдбар — банк слов (xl+) */}
      <aside className="hidden xl:flex flex-col fixed right-0 top-0 bottom-0 w-[360px] border-l border-stone-200 bg-white z-30">
        <div
          className="flex-shrink-0 flex items-center px-4 border-b border-stone-200"
          style={{ height: "var(--header-height, 65px)" }}
        >
          <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Слова</p>
        </div>
        <div
          onDragOver={!checked ? handleBankDragOver : undefined}
          onDragLeave={!checked ? handleBankDragLeave : undefined}
          onDrop={!checked ? handleBankDrop : undefined}
          className={`flex-1 overflow-y-auto p-3 transition-all ${
            dragOverBank ? "bg-amber-50" : ""
          }`}
        >
          <div className="flex flex-wrap gap-2">
            {shuffledWords.map((word) => {
              const used = usedWords.has(word)
              const isBeingDragged = draggingWord === word && draggingFromSlot === null
              return (
                <span
                  key={word}
                  draggable={!used && !checked}
                  onDragStart={(e) => !used && !checked && handleBankDragStart(e, word)}
                  onDragEnd={handleDragEnd}
                  onClick={() => handleWordClick(word)}
                  className={`px-3 py-1.5 rounded-lg border text-sm font-medium transition select-none ${
                    used || checked
                      ? "border-stone-100 bg-stone-50 text-stone-300 cursor-default"
                      : isBeingDragged
                      ? "border-amber-300 bg-amber-50 text-amber-600 opacity-50 cursor-grab"
                      : "border-stone-200 bg-white text-stone-700 hover:border-amber-300 hover:bg-amber-50 hover:text-amber-800 cursor-grab"
                  }`}
                >
                  {word}
                </span>
              )
            })}
          </div>
        </div>
      </aside>

      {/* Результат */}
      {checked && (
        <div
          className={`rounded-lg px-4 py-3 text-sm font-medium ${
            correctCount === exercise.answers.length
              ? "bg-green-50 text-green-700"
              : "bg-amber-50 text-amber-700"
          }`}
        >
          {correctCount === exercise.answers.length
            ? "Отлично! Все слова вставлены верно."
            : `Верно ${correctCount} из ${exercise.answers.length}. Правильные ответы выделены зелёным.`}
        </div>
      )}

      {/* Правильные ответы (при ошибках) */}
      {checked && correctCount < exercise.answers.length && (
        <div className="space-y-1">
          <p className="text-xs text-stone-400 uppercase tracking-wide font-medium">Правильные ответы:</p>
          {exercise.answers.map((ans, i) =>
            slots[i] !== ans ? (
              <p key={i} className="text-sm text-stone-600">
                <span className="text-stone-400 font-medium mr-1">{i + 1}.</span>
                {ans}
              </p>
            ) : null
          )}
        </div>
      )}

      {/* Кнопки */}
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
