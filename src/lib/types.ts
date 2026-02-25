export type ExerciseType = "fill-in-the-blank" | "multiple-choice" | "audio" | "reading-comprehension" | "true-false" | "word-fill" | "select-fill" | "open-questions"

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

export interface TrueFalseStatement {
  statement: string
  answer: boolean
}

export interface TrueFalseExercise extends BaseExercise {
  type: "true-false"
  text?: string
  showText?: boolean
  translation?: string
  audioSrc?: string
  statements: TrueFalseStatement[]
}

export interface WordFillExercise extends BaseExercise {
  type: "word-fill"
  text: string
  answers: string[]
  words: string[]
  translation?: string
}

export interface SelectFillBlank {
  answer: string
  options: string[]
}

export interface SelectFillExercise extends BaseExercise {
  type: "select-fill"
  text: string
  blanks: SelectFillBlank[]
  translation?: string
}

export interface OpenQuestion {
  question: string
  answer: string
}

export interface OpenQuestionsExercise extends BaseExercise {
  type: "open-questions"
  audioSrc?: string
  text?: string
  questions: OpenQuestion[]
}

export type Exercise = FillInTheBlankExercise | MultipleChoiceExercise | AudioExercise | ReadingComprehensionExercise | TrueFalseExercise | WordFillExercise | SelectFillExercise | OpenQuestionsExercise

export interface Topic {
  slug: string
  title: string
  description: string
  exercises: Exercise[]
}
