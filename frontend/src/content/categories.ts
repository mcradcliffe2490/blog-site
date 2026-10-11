import config from '@content/categories.json'

export const categories = config.categories

const tagCategories: Record<string, string> = config.tags

export function isCategory(slug: unknown): slug is string {
  return categories.some((category) => category.slug === slug)
}

// One category per post: of the categories a post's tags map to, take the one
// that ranks highest in `priority`.
export function pickCategory(tags: string[]): string {
  const mapped = tags.map((tag) => tagCategories[tag.toLowerCase()])
  return config.priority.find((slug) => mapped.includes(slug)) ?? config.default
}
