import type { Topic } from "@/lib/types"

export const greetingsTopic: Topic = {
  slug: "greetings",
  title: "Приветствия",
  description: "Основные греческие приветствия и прощания на каждый день.",
  exercises: [
    {
      id: "1",
      type: "multiple-choice",
      question: "Как сказать «Привет» по-гречески?",
      options: ["Γεια σου", "Αντίο", "Καλημέρα", "Ευχαριστώ"],
      answer: "Γεια σου",
    },
    {
      id: "2",
      type: "multiple-choice",
      question: "Что означает «Καλημέρα»?",
      options: ["Доброе утро", "Добрый вечер", "Спокойной ночи", "До свидания"],
      answer: "Доброе утро",
    },
    {
      id: "3",
      type: "fill-in-the-blank",
      question: "Доброе утро: Καλη_έρα",
      blanks: [{ answer: "μ" }],
    },
    {
      id: "4",
      type: "fill-in-the-blank",
      question: "Добрый вечер: Καλη_πέρα",
      blanks: [{ answer: "σ" }],
    },
    {
      id: "5",
      type: "audio",
      audioSrc: "/audio/greetings/kalimera.mp3",
      question: "Что вы услышали?",
      options: ["Καλημέρα", "Καλησπέρα", "Γεια σου", "Αντίο"],
      answer: "Καλημέρα",
    },
    {
      id: "6",
      type: "multiple-choice",
      question: "Как сказать «До свидания»?",
      options: ["Αντίο", "Γεια σου", "Παρακαλώ", "Συγγνώμη"],
      answer: "Αντίο",
    },
    {
      id: "7",
      type: "multiple-choice",
      question: "«Ευχαριστώ» — это…",
      options: ["Спасибо", "Пожалуйста", "Извините", "Здравствуйте"],
      answer: "Спасибо",
    },
    {
      id: "8",
      type: "fill-in-the-blank",
      question: "Пожалуйста: Παρακα_ώ",
      blanks: [{ answer: "λ" }],
    },
  ],
}
