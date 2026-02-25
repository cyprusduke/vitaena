import type { Topic } from "@/lib/types"

export const numbersTopic: Topic = {
  slug: "numbers",
  title: "Числа",
  description: "Греческие числительные от 1 до 10 и основы счёта.",
  exercises: [
    {
      id: "1",
      type: "multiple-choice",
      question: "Как будет «один» по-гречески?",
      options: ["ένα", "δύο", "τρία", "τέσσερα"],
      answer: "ένα",
    },
    {
      id: "2",
      type: "multiple-choice",
      question: "Что означает «πέντε»?",
      options: ["5", "4", "6", "3"],
      answer: "5",
    },
    {
      id: "3",
      type: "fill-in-the-blank",
      question: "Три по-гречески: τρ_α",
      blanks: [{ answer: "ί" }],
    },
    {
      id: "4",
      type: "fill-in-the-blank",
      question: "Десять по-гречески: δέ_α",
      blanks: [{ answer: "κ" }],
    },
    {
      id: "5",
      type: "audio",
      audioSrc: "/audio/numbers/pente.mp3",
      question: "Какое число вы услышали?",
      options: ["πέντε", "εννέα", "τέσσερα", "εφτά"],
      answer: "πέντε",
    },
    {
      id: "6",
      type: "multiple-choice",
      question: "«εννέα» — это…",
      options: ["9", "8", "7", "6"],
      answer: "9",
    },
    {
      id: "7",
      type: "multiple-choice",
      question: "Как будет «восемь»?",
      options: ["οχτώ", "εφτά", "εξι", "δέκα"],
      answer: "οχτώ",
    },
    {
      id: "8",
      type: "fill-in-the-blank",
      question: "Два по-гречески: δ_ο",
      blanks: [{ answer: "ύ" }],
    },
  ],
}
