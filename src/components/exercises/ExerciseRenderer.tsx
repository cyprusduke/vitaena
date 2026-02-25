import type { Exercise } from "@/lib/types"
import FillInTheBlank from "./FillInTheBlank"
import MultipleChoice from "./MultipleChoice"
import AudioExercise from "./AudioExercise"
import ReadingComprehension from "./ReadingComprehension"

interface Props {
  exercise: Exercise
  onResult?: (correct: boolean) => void
}

export default function ExerciseRenderer({ exercise, onResult }: Props) {
  switch (exercise.type) {
    case "fill-in-the-blank":
      return <FillInTheBlank exercise={exercise} onResult={onResult} />
    case "multiple-choice":
      return <MultipleChoice exercise={exercise} onResult={onResult} />
    case "audio":
      return <AudioExercise exercise={exercise} onResult={onResult} />
    case "reading-comprehension":
      return <ReadingComprehension exercise={exercise} onResult={onResult} />
  }
}
