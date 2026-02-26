import type { Exercise } from "@/lib/types"
import FillInTheBlank from "./FillInTheBlank"
import MultipleChoice from "./MultipleChoice"
import AudioExercise from "./AudioExercise"
import ReadingComprehension from "./ReadingComprehension"
import TrueFalse from "./TrueFalse"
import WordFill from "./WordFill"
import SelectFill from "./SelectFill"
import TableChoice from "./TableChoice"
import OpenQuestions from "./OpenQuestions"

interface Props {
  exercise: Exercise
  onResult?: (correct: boolean) => void
  onReset?: () => void
}

export default function ExerciseRenderer({ exercise, onResult, onReset }: Props) {
  switch (exercise.type) {
    case "fill-in-the-blank":
      return <FillInTheBlank exercise={exercise} onResult={onResult} onReset={onReset} />
    case "multiple-choice":
      return <MultipleChoice exercise={exercise} onResult={onResult} onReset={onReset} />
    case "audio":
      return <AudioExercise exercise={exercise} onResult={onResult} onReset={onReset} />
    case "reading-comprehension":
      return <ReadingComprehension exercise={exercise} onResult={onResult} onReset={onReset} />
    case "true-false":
      return <TrueFalse exercise={exercise} onResult={onResult} onReset={onReset} />
    case "word-fill":
      return <WordFill exercise={exercise} onResult={onResult} onReset={onReset} />
    case "select-fill":
    case "grammar-fill":
      return <SelectFill exercise={exercise} onResult={onResult} onReset={onReset} />
    case "table-choice":
      return <TableChoice exercise={exercise} onResult={onResult} onReset={onReset} />
    case "open-questions":
      return <OpenQuestions exercise={exercise} />
  }
}
