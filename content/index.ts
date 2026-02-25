import { travelTopic } from "./topics/travel"
import type { Topic } from "@/lib/types"

export const topics: Topic[] = [travelTopic]

export function getTopicBySlug(slug: string): Topic | undefined {
  return topics.find((t) => t.slug === slug)
}
