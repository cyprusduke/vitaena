export type ExerciseType = "fill-in-the-blank" | "multiple-choice" | "audio" | "reading-comprehension"

export interface BaseExercise {
  id: string
  type: ExerciseType
  question: string
}

export interface FillInTheBlankExercise extends BaseExercise {
  type: "fill-in-the-blank"
  blanks: { answer: string }[]
}

export interface MultipleChoiceExercise extends BaseExercise {
  type: "multiple-choice"
  options: string[]
  answer: string
}

export interface AudioExercise extends BaseExercise {
  type: "audio"
  audioSrc: string
  options: string[]
  answer: string
}

export interface ReadingQuestion {
  question: string
  options: string[]
  answer: string
}

export interface ReadingComprehensionExercise extends BaseExercise {
  type: "reading-comprehension"
  text: string
  translation?: string
  audioSrc?: string
  questions: ReadingQuestion[]
}

export type Exercise = FillInTheBlankExercise | MultipleChoiceExercise | AudioExercise | ReadingComprehensionExercise

export interface Topic {
  slug: string
  title: string
  description: string
  exercises: Exercise[]
}
