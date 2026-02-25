"use client"

import type { Exercise } from "@/lib/types"
import ExerciseRenderer from "./ExerciseRenderer"

interface Props {
  exercise: Exercise
  topicSlug: string
  exerciseId: string
}

export default function ExerciseWithSave({ exercise, topicSlug, exerciseId }: Props) {
  const handleResult = (correct: boolean) => {
    localStorage.setItem(
      `vitaena_result_${topicSlug}_${exerciseId}`,
      correct ? "correct" : "incorrect"
    )
    window.dispatchEvent(new CustomEvent("vitaena-result-changed"))
  }

  const handleReset = () => {
    localStorage.removeItem(`vitaena_result_${topicSlug}_${exerciseId}`)
    window.dispatchEvent(new CustomEvent("vitaena-result-changed"))
  }

  return <ExerciseRenderer exercise={exercise} onResult={handleResult} onReset={handleReset} />
}
