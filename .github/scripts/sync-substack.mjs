import RSSParser from 'rss-parser';
import TurndownService from 'turndown';
import fs from 'fs';
import path from 'path';

const FEED_URL = process.env.SUBSTACK_FEED_URL || 'https://mcradcliffe.substack.com/feed';
const POSTS_DIR = path.join('blog-posts', 'Posts');

const parser = new RSSParser();
const turndown = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced',
});

// Convert a Substack post title to a filename-safe slug
function slugify(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Format a date string as YYYY-MM-DD
function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toISOString().split('T')[0];
}

async function main() {
  console.log(`Fetching RSS feed from ${FEED_URL}`);
  const feed = await parser.parseURL(FEED_URL);
  console.log(`Found ${feed.items.length} items in feed`);

  // Ensure Posts directory exists
  if (!fs.existsSync(POSTS_DIR)) {
    fs.mkdirSync(POSTS_DIR, { recursive: true });
  }

  // Get existing post slugs to avoid duplicates
  const existingFiles = fs.readdirSync(POSTS_DIR)
    .filter(f => f.endsWith('.md'))
    .map(f => f.replace(/\.md$/, ''));

  let newPosts = 0;

  for (const item of feed.items) {
    const slug = slugify(item.title);

    if (existingFiles.includes(slug)) {
      console.log(`Skipping "${item.title}" (already exists)`);
      continue;
    }

    // Convert HTML content to Markdown
    const htmlContent = item['content:encoded'] || item.content || item.description || '';
    const markdown = turndown.turndown(htmlContent);

    // Determine category from Substack categories/tags
    const category = item.categories?.[0] || '';

    // Extract summary - use Substack's description or first 200 chars
    const summaryText = item.contentSnippet || item.description || '';
    const summary = summaryText.slice(0, 200).replace(/\n/g, ' ').trim();

    // Build the markdown file with YAML frontmatter
    const fileContent = `---
title: "${item.title.replace(/"/g, '\\"')}"
date: "${formatDate(item.pubDate || item.isoDate)}"
summary: "${summary.replace(/"/g, '\\"')}"
category: "${category}"
source: "substack"
substack_url: "${item.link || ''}"
---

${markdown}
`;

    const filePath = path.join(POSTS_DIR, `${slug}.md`);
    fs.writeFileSync(filePath, fileContent, 'utf-8');
    console.log(`Created new post: ${slug}.md`);
    newPosts++;
  }

  console.log(`Sync complete. ${newPosts} new post(s) added.`);
}

main().catch(err => {
  console.error('Sync failed:', err);
  process.exit(1);
});
