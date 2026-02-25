"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import type { Topic } from "@/lib/types"

interface Props {
  topic: Topic
}

export default function TopicEntry({ topic }: Props) {
  const router = useRouter()

  useEffect(() => {
    if (topic.exercises.length === 0) return
    const saved = localStorage.getItem(`vitaena_last_${topic.slug}`)
    const validId =
      saved && topic.exercises.some((e) => e.id === saved)
        ? saved
        : topic.exercises[0].id
    router.replace(`/topics/${topic.slug}/${validId}`)
  }, [topic, router])

  if (topic.exercises.length === 0) {
    return (
      <div className="max-w-4xl mx-auto text-center py-24 text-stone-400">
        <p className="text-lg mb-2">Упражнений пока нет</p>
        <p className="text-sm">Эта тема в разработке.</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto flex items-center justify-center py-24 text-stone-400 text-sm animate-pulse">
      Загрузка упражнений…
    </div>
  )
}
