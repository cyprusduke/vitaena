import { travelTopic } from "./topics/travel"
import { environmentTopic } from "./topics/environment"
import type { Topic } from "@/lib/types"

export const topics: Topic[] = [travelTopic, environmentTopic]

export function getTopicBySlug(slug: string): Topic | undefined {
  return topics.find((t) => t.slug === slug)
}
