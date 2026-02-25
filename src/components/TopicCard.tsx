import Link from "next/link"
import type { Topic } from "@/lib/types"

interface TopicCardProps {
  topic: Topic
}

export default function TopicCard({ topic }: TopicCardProps) {
  return (
    <Link
      href={`/topics/${topic.slug}`}
      className="block rounded-2xl border border-stone-200 bg-white p-6 shadow-sm transition hover:shadow-md hover:border-amber-400"
    >
      <h2 className="text-xl font-semibold text-stone-800 mb-2">{topic.title}</h2>
      <p className="text-stone-500 text-sm leading-relaxed mb-4">{topic.description}</p>
      <span className="text-xs text-amber-600 font-medium">
        {topic.exercises.length} упражнений →
      </span>
    </Link>
  )
}
