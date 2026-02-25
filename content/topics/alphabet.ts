import type { Topic } from "@/lib/types"

export const alphabetTopic: Topic = {
  slug: "alphabet",
  title: "Алфавит",
  description: "Изучите буквы греческого алфавита, их названия и произношение.",
  exercises: [
    {
      id: "1",
      type: "multiple-choice",
      question: "Как называется первая буква греческого алфавита?",
      options: ["αλφα", "βήτα", "γάμμα", "δέλτα"],
      answer: "αλφα",
    },
    {
      id: "2",
      type: "multiple-choice",
      question: "Какая буква следует за αλφα?",
      options: ["γάμμα", "βήτα", "δέλτα", "έψιλον"],
      answer: "βήτα",
    },
    {
      id: "3",
      type: "fill-in-the-blank",
      question: "Вставьте пропущенную букву: αλφά_ητο",
      blanks: [{ answer: "β" }],
    },
    {
      id: "4",
      type: "fill-in-the-blank",
      question: "Как пишется буква «гамма»? γ_μμα",
      blanks: [{ answer: "ά" }],
    },
    {
      id: "5",
      type: "audio",
      audioSrc: "/audio/alphabet/alpha.mp3",
      question: "Какую букву вы услышали?",
      options: ["α", "β", "γ", "δ"],
      answer: "α",
    },
    {
      id: "6",
      type: "multiple-choice",
      question: "Какая строчная форма у буквы Σ (сигма)?",
      options: ["σ / ς", "ξ", "ψ", "φ"],
      answer: "σ / ς",
    },
    {
      id: "7",
      type: "fill-in-the-blank",
      question: "Последняя буква греческого алфавита — ωμέ_α",
      blanks: [{ answer: "γ" }],
    },
    {
      id: "8",
      type: "multiple-choice",
      question: "Сколько букв в греческом алфавите?",
      options: ["24", "26", "22", "28"],
      answer: "24",
    },
  ],
}
