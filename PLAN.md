# Blog Site Improvement Plan

## Part 1: Unfinished/Unimplemented Work Audit

### Broken Navigation Links (header links to pages that don't exist)
- **`/topics`** - Header links here, but no route in Vue Router and no view component exists
- **`/my-reading-list`** - Header links here, but no route and no view component
- **`Random`** - Appears in the Figma mockups as a nav item, but isn't in the current header at all

### Stubbed/Empty Backend Routes
- `GET /api/blog-posts/random` - Empty handler, returns nothing
- `GET /api/blog-posts/philosophy` - Empty handler with comment about sort params
- `GET /api/blog-posts/teaching` - Empty handler
- `GET /api/blog-posts/religion` - Empty handler

### Incomplete Implementations
- **About Me page** - Exists and has real content, but Discord link is a placeholder (`href="#"`)
- **`BlogPostCard.vue`** - Component file exists but is completely empty (0 lines)
- **Boilerplate cruft** - `HelloWorld.vue`, `TheWelcome.vue`, `WelcomeItem.vue`, `counter.ts` store are all unused Vite starter template files still in the project

### Missing from Mockups vs. Reality
- Mockups show a **Topics dropdown** with: Misc, Education, Philosophy, Christianity/Faith - not implemented
- Mockups show **"Random"** as a nav item - not in header or router
- Mockups show a **"Back" button** in the header on sub-pages - current site doesn't have this

---

## Part 2: Better Substack-to-Blog Pipeline

### Current Pain Point
Right now, getting a post onto the blog requires:
1. Writing the post (presumably on Substack first)
2. Manually creating a `.md` file in the `mcradcliffe2490/blog-posts` GitHub repo under `/Posts/`
3. Manually updating `metadata.json` with title, summary, date, category, slug
4. The blog backend then fetches from that repo via GitHub API

This is tedious and error-prone - every post requires touching two files in a separate repo.

### Option A: Substack RSS Auto-Sync (Recommended)
**How it works:** Substack provides a public RSS feed at `https://yourname.substack.com/feed`. A scheduled backend job (or GitHub Action) polls the feed, converts new posts to markdown, and commits them to the blog-posts repo automatically.

**Implementation:**
- Add an RSS parser (e.g., `rss-parser` npm package) to the backend
- Create a `/api/sync` endpoint or a cron-based GitHub Action
- Parse RSS items → extract title, summary, date, content
- Convert HTML content to Markdown (using `turndown` or similar)
- Auto-commit new posts to the `blog-posts` repo via Octokit
- Auto-update `metadata.json`

**Pros:** Fully automatic once set up. Write on Substack, it appears on your blog.
**Cons:** Slight delay (depends on poll interval). RSS content may differ from full Substack post. Need to handle formatting edge cases.

### Option B: Substack API / Webhook Integration
**How it works:** Instead of polling RSS, use Substack's export or webhook capabilities to push content when published.

**Reality check:** Substack doesn't offer a public write API or webhooks for third-party integrations. This isn't currently viable.

### Option C: CLI/Script-Based Publishing Tool
**How it works:** A local CLI command that takes a Substack post URL, scrapes/fetches the content, converts it to markdown, and pushes it to the blog-posts repo.

**Implementation:**
- `npx publish-post https://yoursubstack.substack.com/p/post-slug`
- Fetches the post page, extracts article content
- Converts to markdown with frontmatter
- Pushes to GitHub repo via Octokit
- Updates metadata.json

**Pros:** Full control over when posts are published. Can review/edit before committing.
**Cons:** Manual trigger required. Depends on Substack's HTML structure.

### Option D: Simplify the GitHub Workflow (Quick Win)
**How it works:** Instead of maintaining a separate `metadata.json`, derive all metadata from markdown frontmatter in each post file. Eliminate the two-file-touch problem.

**Implementation:**
- Move metadata into each post's YAML frontmatter (`---` block at top of .md file)
- Update backend to parse frontmatter directly (already using `gray-matter`!)
- Drop the separate `metadata.json` file
- Optionally add a simple web form to the blog's admin that creates/commits a new post via the GitHub API

**Pros:** Simpler, fewer files to manage. Already have the tooling (`gray-matter`).
**Cons:** Still manual, just less annoying.

### Recommended Approach: Option A + Option D
1. **First**, simplify by moving metadata into frontmatter (Option D) - quick win, reduces friction immediately
2. **Then**, build the RSS auto-sync (Option A) so Substack posts flow automatically to the blog
3. Keep the ability to manually add posts for content that isn't on Substack

---

## Part 3: New Features Brainstorm

### 1. Comments System
**Options ranked by complexity:**

- **Giscus** (Recommended) - Uses GitHub Discussions as the backend. Free, no database needed, matches your GitHub-based architecture. Visitors comment via their GitHub account. Embed is a single `<script>` tag per post.

- **Utterances** - Similar to Giscus but uses GitHub Issues instead of Discussions. Slightly older approach but proven and simple.

- **Disqus** - Third-party hosted comments. Easy to add but includes ads on free tier, privacy concerns, and heavy JavaScript.

- **Custom-built** - Build your own with a database (SQLite/Postgres). Maximum control but significant engineering effort, plus you'd need user auth and moderation tooling.

**Recommendation:** Giscus. It fits perfectly with your GitHub-based blog architecture, is free, lightweight, and gives you moderation via GitHub Discussions.

### 2. "What I'm Reading" / Reading List Page
**Options:**

- **Manual curation via a JSON/Markdown file** in the blog-posts repo (e.g., `reading-list.json`). Simple to implement - the backend fetches it like it fetches posts. You update it when you start/finish a book. Could have sections like "Currently Reading", "Recently Finished", "Favorites".

- **Goodreads RSS integration** - Goodreads provides RSS feeds for your shelves. Could auto-sync your "currently reading" shelf. However, Goodreads' future is uncertain and their API was deprecated.

- **Open Library API** - Free API to fetch book cover images, descriptions, and metadata by ISBN or title. Combine with a manual list for rich book cards.

- **Literal.club or StoryGraph API** - Modern Goodreads alternatives with better API support.

**Recommendation:** Manual JSON file + Open Library API for book covers/metadata. Keep it simple, you control the data, and book covers make it visually appealing.

### 3. Topics/Category Page
The mockups already show this with categories: Misc, Education, Philosophy, Christianity/Faith.

**Implementation:**
- Single generic `/api/blog-posts/category/:category` endpoint replacing the individual stubs
- Frontend Topics view with category cards/filters
- Dropdown in header navigation (matching mockup)
- Posts tagged via their frontmatter `category` field

### 4. Random Post Feature
- Backend: Pick a random post from the list and return it (or return a random slug for client-side redirect)
- Frontend: "Random" nav link that hits the endpoint and navigates to the result
- Nice for discovery and matches the mockup design

### 5. Search
- **Simple approach:** Client-side filtering of post titles/summaries (already fetched from the API)
- **Better approach:** Full-text search with a lightweight library like `Fuse.js` on the frontend
- **Best approach:** Backend search indexing (overkill for current scale)

**Recommendation:** Fuse.js client-side search. Low effort, no backend changes, works well for dozens to hundreds of posts.

### 6. Newsletter Signup
Since you're on Substack, you could add a "Subscribe" link or embedded Substack signup form to the blog. Drives traffic back to Substack for newsletter subscribers.

### 7. Post Sharing
Simple share buttons (copy link, Twitter/X, email) on each post detail page. Lightweight to implement.

---

## Proposed Implementation Priority

### Phase 1: Foundation & Quick Wins
1. Clean up boilerplate files (HelloWorld, TheWelcome, etc.)
2. Move metadata from `metadata.json` into post frontmatter (Option D)
3. Fix the About Me Discord placeholder link
4. Add Giscus comments to post detail pages
5. Implement the Topics page with category filtering

### Phase 2: Content Pipeline
6. Build Substack RSS auto-sync (Option A)
7. Implement the Reading List page (manual JSON + Open Library covers)
8. Add the Random Post feature

### Phase 3: Discovery & Polish
9. Add Fuse.js client-side search
10. Add Topics dropdown to header navigation (matching mockup)
11. Newsletter/Subscribe link to Substack
12. Mobile responsiveness pass
13. Post sharing buttons
