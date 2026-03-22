# Blog Site Improvement Plan

## Part 1: Unfinished/Unimplemented Work Audit

### Broken Navigation Links (header links to pages that don't exist)
- **`/topics`** - Header links here, but no route in Vue Router and no view component exists
- **`/my-reading-list`** - Header links here, but no route and no view component
- **`Random`** - Appears in the Figma mockups as a nav item, but isn't in the current header at all

### Stubbed/Empty Backend Routes
- ~~`GET /api/blog-posts/random` - Empty handler~~ **DONE** - Now returns a random post slug
- ~~`GET /api/blog-posts/philosophy` - Empty handler~~ **REPLACED** by generic `/api/blog-posts/category/:category`
- ~~`GET /api/blog-posts/teaching` - Empty handler~~ **REPLACED** by generic `/api/blog-posts/category/:category`
- ~~`GET /api/blog-posts/religion` - Empty handler~~ **REPLACED** by generic `/api/blog-posts/category/:category`

### Incomplete Implementations
- **About Me page** - Exists and has real content, but Discord link is a placeholder (`href="#"`)
- **`BlogPostCard.vue`** - Component file exists but is completely empty (0 lines)
- **Boilerplate cruft** - `HelloWorld.vue`, `TheWelcome.vue`, `WelcomeItem.vue`, `counter.ts` store are all unused Vite starter template files still in the project

### Missing from Mockups vs. Reality
- Mockups show a **Topics dropdown** with: Misc, Education, Philosophy, Christianity/Faith - not implemented
- Mockups show **"Random"** as a nav item - not in header or router
- Mockups show a **"Back" button** in the header on sub-pages - current site doesn't have this

---

## Part 2: Substack-to-Blog Pipeline (DECIDED)

### Decisions Made
- **Option D (frontmatter):** IMPLEMENTED - Backend now reads metadata from YAML frontmatter in each post's `.md` file. The separate `metadata.json` is no longer needed.
- **Option A (RSS auto-sync):** IMPLEMENTED - GitHub Action runs every 3 days, fetches the Substack RSS feed (`https://mcradcliffe.substack.com/feed`), converts new posts to markdown with frontmatter, and commits them to the `blog-posts` repo.

### Setup Required
To activate the GitHub Action:
1. Create a GitHub personal access token with `repo` scope
2. Add it as a secret named `BLOG_POSTS_TOKEN` in the `blog-site` repo settings
3. Enable GitHub Discussions on the `blog-site` repo (for Giscus comments)
4. Migrate existing posts in `blog-posts` repo to use YAML frontmatter instead of `metadata.json`

### How the Sync Works
- **Schedule:** Every 3 days at 8am UTC (also manually triggerable)
- **Process:** Fetches RSS → converts HTML to Markdown via Turndown → writes `.md` files with frontmatter → commits to blog-posts repo
- **Deduplication:** Checks existing filenames by slug, skips already-synced posts
- **Frontmatter fields:** title, date, summary, category, source ("substack"), substack_url

---

## Part 3: New Features (DECIDED)

### Comments: Giscus (IMPLEMENTED)
- Uses GitHub Discussions as backend
- Embedded on each post detail page below the content
- Requires GitHub account to comment
- **TODO:** Fill in `data-repo-id` and `data-category-id` after enabling GitHub Discussions and creating a "Blog Comments" category

### Remaining Features (Not Yet Implemented)
1. **Topics/Category Page** - Frontend view + header dropdown (backend endpoint ready)
2. **Reading List Page** - Manual JSON file + Open Library API for book covers
3. **Random Post** - Backend ready, needs frontend nav link + redirect logic
4. **Search** - Fuse.js client-side search
5. **Newsletter/Subscribe** - Substack signup embed
6. **Post Sharing** - Copy link, Twitter/X, email buttons
7. **Cleanup** - Remove boilerplate files, fix Discord placeholder link
