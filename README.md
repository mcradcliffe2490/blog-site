# blog-site

This is a blog. Posts are written on [Substack](https://mcradcliffe.substack.com) and copied here automatically.

## How posts get here

1. `.github/workflows/sync-content.yml` runs once a day, or on demand from the Actions tab ("Run workflow").
2. It runs `npm run sync`, which reads every public post from Substack and writes one markdown file per post into `content/posts/`.
3. It commits any new or changed files. The site in `frontend/` reads those files when it builds.

There is no server. If Substack or the sync breaks, the site keeps the posts it already has.

## Two folders, two installs

| Where | What | Commands |
|---|---|---|
| repo root | the sync script and its tests | `npm install`, `npm run sync`, `npm test` |
| `frontend/` | the site (Vue + Vite) | `npm install`, `npm run dev`, `npm run build` |

## The one rule

Files in `content/posts/` that say `source: substack` are generated. Anything edited in them is replaced on the next sync. To change a post, edit it on Substack, or use `content/overrides.json`.

## How to

**Publish or fix a post.** Do it on Substack. It shows up after the next sync.

**Change something about one post.** Add an entry to `content/overrides.json`, keyed by the post's file name without `.md`:

```json
{
  "some-post-slug": { "category": "faith", "summary": "A better one-liner." }
}
```

| Setting | Effect | Takes effect |
|---|---|---|
| `category` | One of the slugs in `content/categories.json` | next build |
| `summary` | Text for the hover panel on the post list | next build |
| `date` | Replaces the Substack publish date, e.g. `"2024-06-07"` | next build |
| `hidden: true` | Takes the post off the site | next build |
| `imageNotes` | Text shown where a picture used to be (see below) | next build |
| `images: true` | Keeps the post's real pictures | next sync |
| `sync: false` | Freezes the file so you can edit its text by hand | next sync |

**Say something where a picture was.** The site is text-only, so each picture in a synced post becomes a marker in its file: `{{image-1}}`, `{{image-2}}`, numbered from the top. The site shows a line of text there instead:

```json
{
  "*": { "imageNotes": { "default": "Once upon a time there was an image here." } },
  "some-post-slug": { "imageNotes": { "2": "Imagine in your mind what this image would have looked like." } }
}
```

For each picture it uses the post's text for that number, then the post's own `"default"`, then the one under `"*"`. An empty `""` shows nothing.

**Change how tags become categories.** Edit `tags` in `content/categories.json` (tag names in lower case). Each post gets one category: of the categories its Substack tags map to, the one earliest in `priority`. A post with no mapped tag gets `default`. An override always wins.

**Add a post that is not on Substack.** Put a markdown file in `content/posts/`. The sync never touches it.

```markdown
---
title: A post
date: 2024-01-01
summary: One line for the hover panel.
category: misc
---
The post.
```

**Take a post down.** Set `"hidden": true` in overrides. Unpublishing on Substack is not enough: the sync warns about it but never deletes a file.

## When the sync breaks

- Look at the failed run in the Actions tab. Each failing post is listed with the reason.
- Run `npm run sync` locally. If that works and the Action does not, Substack is probably blocking GitHub's servers; run it locally and commit the result.
- The script uses two unofficial Substack endpoints, `/api/v1/archive` and `/api/v1/posts/<slug>`. If Substack changes them, `scripts/sync-substack.mjs` is the only file that knows about them.
- "Less than half the size of the saved one" means Substack returned a much shorter post than before. The file was left alone. If the cut was intentional, delete the file and sync again.
- GitHub pauses scheduled workflows in repos with no activity for 60 days. If posts stop arriving, check that the workflow is still enabled.
- Before pushing your own changes, `git pull --rebase`, since the sync commits to the same branch.
