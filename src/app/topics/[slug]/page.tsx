import { notFound } from "next/navigation"
import { topics, getTopicBySlug } from "../../../../content"
import TopicEntry from "@/components/TopicEntry"

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return topics.map((topic) => ({ slug: topic.slug }))
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const topic = getTopicBySlug(slug)
  if (!topic) return {}
  return { title: `${topic.title} — Vitaena` }
}

export default async function TopicPage({ params }: Props) {
  const { slug } = await params
  const topic = getTopicBySlug(slug)
  if (!topic) notFound()

  return <TopicEntry topic={topic} />
}
