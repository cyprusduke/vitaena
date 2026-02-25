import { notFound } from "next/navigation"
import Link from "next/link"
import { topics, getTopicBySlug } from "../../../../../content"
import ExerciseWithSave from "@/components/exercises/ExerciseWithSave"
import ExerciseSidebar from "@/components/exercises/ExerciseSidebar"

interface Props {
  params: Promise<{ slug: string; id: string }>
}

export async function generateStaticParams() {
  return topics.flatMap((topic) =>
    topic.exercises.map((ex) => ({ slug: topic.slug, id: ex.id }))
  )
}

export async function generateMetadata({ params }: Props) {
  const { slug, id } = await params
  const topic = getTopicBySlug(slug)
  if (!topic) return {}
  const exercise = topic.exercises.find((e) => e.id === id)
  if (!exercise) return {}
  return { title: `Упражнение ${id} · ${topic.title} — Vitaena` }
}

function pluralExercises(n: number): string {
  const mod10 = n % 10
  const mod100 = n % 100
  if (mod10 === 1 && mod100 !== 11) return "упражнение"
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return "упражнения"
  return "упражнений"
}

const typeLabels: Record<string, string> = {
  "fill-in-the-blank": "Вставить букву",
  "multiple-choice": "Выбор ответа",
  audio: "На слух",
  "reading-comprehension": "Аудирование",
  "true-false": "Правда/Ложь",
  "word-fill": "Вставить слово",
}

export default async function ExercisePage({ params }: Props) {
  const { slug, id } = await params
  const topic = getTopicBySlug(slug)
  if (!topic) notFound()

  const exerciseIndex = topic.exercises.findIndex((e) => e.id === id)
  if (exerciseIndex === -1) notFound()

  const exercise = topic.exercises[exerciseIndex]
  const prevExercise = exerciseIndex > 0 ? topic.exercises[exerciseIndex - 1] : null
  const nextExercise =
    exerciseIndex < topic.exercises.length - 1 ? topic.exercises[exerciseIndex + 1] : null

  return (
    <>
      {/* ── Центральная область ── */}
      <div className="max-w-4xl mx-auto px-4">
        {/* Breadcrumb */}
        <div className="mb-3 flex items-center gap-2 text-sm text-stone-400">
          <Link href="/" className="hover:text-stone-600 transition">
            Темы
          </Link>
          <span>/</span>
          <Link href={`/topics/${slug}`} className="hover:text-stone-600 transition">
            {topic.title}
          </Link>
          <span>/</span>
          <span>Упражнение {exerciseIndex + 1}</span>
        </div>

        {/* Заголовок */}
        <div className="mb-5 flex items-center gap-3">
          <h1 className="text-2xl font-serif font-bold text-stone-800">
            Упражнение {exerciseIndex + 1}{" "}
            <span className="text-stone-400 font-normal">из {topic.exercises.length}</span>
          </h1>
          <span className="text-xs text-stone-400 font-medium px-2.5 py-1 bg-stone-100 rounded-full">
            {typeLabels[exercise.type]}
          </span>
        </div>

        {/* Прогресс-полоска (мобильные / < xl) */}
        <div className="flex items-center gap-1 mb-5 xl:hidden overflow-x-auto py-1">
          {topic.exercises.map((ex, i) => (
            <Link
              key={ex.id}
              href={`/topics/${slug}/${ex.id}`}
              title={`Упражнение ${i + 1}`}
              className={`flex-shrink-0 h-1.5 rounded-full transition-all duration-200
                ${ex.id === id ? "w-6 bg-amber-500" : "w-1.5 bg-stone-300 hover:bg-stone-400"}`}
            />
          ))}
          <span className="ml-2 text-xs text-stone-400 whitespace-nowrap">
            {exerciseIndex + 1} / {topic.exercises.length}
          </span>
        </div>

        {/* Карточка упражнения */}
        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6 sm:p-8">
          <ExerciseWithSave exercise={exercise} topicSlug={slug} exerciseId={id} />
        </div>

        {/* Навигация пред/след */}
        <div className="mt-6 flex justify-between">
          {prevExercise ? (
            <Link
              href={`/topics/${slug}/${prevExercise.id}`}
              className="flex items-center gap-2 text-sm text-stone-500 hover:text-stone-800 transition"
            >
              ← Предыдущее
            </Link>
          ) : (
            <Link
              href={`/topics/${slug}`}
              className="flex items-center gap-2 text-sm text-stone-500 hover:text-stone-800 transition"
            >
              ← К списку
            </Link>
          )}
          {nextExercise && (
            <Link
              href={`/topics/${slug}/${nextExercise.id}`}
              className="flex items-center gap-2 text-sm text-stone-500 hover:text-stone-800 transition"
            >
              Следующее →
            </Link>
          )}
        </div>
      </div>

      {/* ── Сайдбар — фиксирован у правого края viewport ── */}
      <aside className="hidden xl:flex flex-col fixed left-0 top-0 bottom-0 w-60 border-r border-stone-200 bg-white z-30">
        <div className="flex-shrink-0 flex items-center px-4 border-b border-stone-200" style={{ height: "var(--header-height, 65px)" }}>
          <div>
            <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
              {topic.title}
            </p>
            <p className="text-xs text-stone-400 mt-0.5">{topic.exercises.length} {pluralExercises(topic.exercises.length)}</p>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          <ExerciseSidebar exercises={topic.exercises} topicSlug={slug} currentId={id} />
        </div>
      </aside>
    </>
  )
}
