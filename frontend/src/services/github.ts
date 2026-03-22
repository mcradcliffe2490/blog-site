const REPO_OWNER = 'mcradcliffe2490'
const REPO_NAME = 'blog-posts'
const API_BASE = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents`

interface PostMeta {
  title: string
  summary: string
  date: string
  category: string
  slug: string
  path: string
}

interface PostDetail extends PostMeta {
  markdown: string
}

function parseFrontmatter(raw: string): { data: Record<string, string>; content: string } {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/)
  if (!match) return { data: {}, content: raw }

  const data: Record<string, string> = {}
  for (const line of match[1].split('\n')) {
    const idx = line.indexOf(':')
    if (idx === -1) continue
    const key = line.slice(0, idx).trim()
    let value = line.slice(idx + 1).trim()
    // Remove surrounding quotes
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1)
    }
    data[key] = value
  }

  return { data, content: match[2] }
}

async function fetchGitHubFile(path: string): Promise<string> {
  const res = await fetch(`${API_BASE}/${path}`, {
    headers: { Accept: 'application/vnd.github.v3+json' },
  })
  if (!res.ok) throw new Error(`GitHub API error: ${res.status}`)
  const json = await res.json()
  return atob(json.content)
}

export async function fetchAllPosts(): Promise<PostMeta[]> {
  const res = await fetch(`${API_BASE}/Posts`, {
    headers: { Accept: 'application/vnd.github.v3+json' },
  })
  if (!res.ok) throw new Error(`GitHub API error: ${res.status}`)
  const files = await res.json()
  const mdFiles = files.filter((f: { name: string }) => f.name.endsWith('.md'))

  const posts = await Promise.all(
    mdFiles.map(async (file: { name: string; path: string }) => {
      const slug = file.name.replace(/\.md$/, '')
      const raw = await fetchGitHubFile(file.path)
      const { data } = parseFrontmatter(raw)
      return {
        title: data.title || slug,
        summary: data.summary || '',
        date: data.date || '',
        category: data.category || '',
        slug,
        path: file.path,
      } as PostMeta
    }),
  )

  return posts
}

export async function fetchPost(slug: string): Promise<PostDetail> {
  const raw = await fetchGitHubFile(`Posts/${slug}.md`)
  const { data, content } = parseFrontmatter(raw)

  return {
    title: data.title || slug,
    summary: data.summary || '',
    date: data.date || '',
    category: data.category || '',
    slug,
    path: `Posts/${slug}.md`,
    markdown: content,
  }
}

export async function fetchRandomPostSlug(): Promise<string> {
  const res = await fetch(`${API_BASE}/Posts`, {
    headers: { Accept: 'application/vnd.github.v3+json' },
  })
  if (!res.ok) throw new Error(`GitHub API error: ${res.status}`)
  const files = await res.json()
  const mdFiles = files.filter((f: { name: string }) => f.name.endsWith('.md'))
  if (mdFiles.length === 0) throw new Error('No posts found')
  const randomFile = mdFiles[Math.floor(Math.random() * mdFiles.length)]
  return randomFile.name.replace(/\.md$/, '')
}
