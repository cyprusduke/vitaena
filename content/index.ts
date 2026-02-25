import { alphabetTopic } from "./topics/alphabet"
import { greetingsTopic } from "./topics/greetings"
import { numbersTopic } from "./topics/numbers"
import { travelTopic } from "./topics/travel"
import type { Topic } from "@/lib/types"

export const topics: Topic[] = [alphabetTopic, greetingsTopic, numbersTopic, travelTopic]

export function getTopicBySlug(slug: string): Topic | undefined {
  return topics.find((t) => t.slug === slug)
}
