import { topics } from "../../content"
import TopicCard from "@/components/TopicCard"

export default function HomePage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-10">
        <h1 className="text-3xl font-serif font-bold text-stone-800 mb-2">
          Изучайте греческий язык
        </h1>
        <p className="text-stone-500 text-base">
          Выберите тему, чтобы начать упражнения.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {topics.map((topic) => (
          <TopicCard key={topic.slug} topic={topic} />
        ))}
      </div>
    </div>
  )
}
