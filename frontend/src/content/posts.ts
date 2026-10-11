import { parse } from 'yaml'
import overrides from '@content/overrides.json'
import { isCategory, pickCategory } from './categories'

export interface Post {
  slug: string
  title: string
  date: string
  summary: string
  category: string
  markdown: string
}

interface Override {
  category?: string
  date?: string
  summary?: string
  hidden?: boolean
  imageNotes?: Record<string, string>
  // Read by the sync script, not the site.
  images?: boolean
  sync?: boolean
}

const allOverrides: Record<string, Override> = overrides

const DATE_FORMAT = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  timeZone: 'America/New_York',
})

const files = import.meta.glob<string>('@content/posts/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
})

const escapeHtml = (text: string) =>
  text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

// Swaps each `{{image-N}}` marker for its note: the post's own text for that
// image, then the post's default, then the site-wide default under "*".
function withImageNotes(markdown: string, notes: Record<string, string> = {}): string {
  return markdown.replace(/\{\{image-(\d+)\}\}/g, (_, number: string) => {
    const note = notes[number] ?? notes.default ?? allOverrides['*']?.imageNotes?.default ?? ''
    return note ? `<p class="image-note">${escapeHtml(note)}</p>` : ''
  })
}

function toPost(path: string, raw: string): Post | null {
  const slug = path.replace(/^.*\/|\.md$/g, '')
  const [, frontmatter = '', markdown = raw] = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/) ?? []
  const meta = parse(frontmatter) ?? {}
  const override = allOverrides[slug] ?? {}
  if (override.hidden) return null

  const category = override.category ?? meta.category
  return {
    slug,
    title: meta.title ?? slug,
    date: String(override.date ?? meta.date ?? ''),
    summary: override.summary ?? meta.summary ?? '',
    category: isCategory(category) ? category : pickCategory(meta.tags ?? []),
    markdown: withImageNotes(markdown, override.imageNotes),
  }
}

const posts = Object.entries(files)
  .map(([path, raw]) => toPost(path, raw))
  .filter((post): post is Post => post !== null)
  .sort((a, b) => b.date.localeCompare(a.date))

export function getPosts(): Post[] {
  return posts
}

export function getPost(slug: string): Post | undefined {
  return posts.find((post) => post.slug === slug)
}

export function formatDate(date: string): string {
  // A bare date is midnight UTC, which is still the previous day in New York.
  const parsed = new Date(/^\d{4}-\d{2}-\d{2}$/.test(date) ? `${date}T12:00:00Z` : date)
  return Number.isNaN(parsed.getTime()) ? date : DATE_FORMAT.format(parsed)
}
