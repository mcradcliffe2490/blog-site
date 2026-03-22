import { Octokit } from 'octokit';
import express from 'express';
import matter from 'gray-matter';
import dotenv from 'dotenv';
dotenv.config({ path: new URL('../.env', import.meta.url).pathname });

const routes = express.Router();

const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN
});

const REPO_OWNER = 'mcradcliffe2490';
const REPO_NAME = 'blog-posts';
const GITHUB_HEADERS = { 'X-GitHub-Api-Version': '2022-11-28' };

// Helper to fetch a file's content from the blog-posts repo
async function fetchFileContent(path) {
    const { data } = await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
        owner: REPO_OWNER,
        repo: REPO_NAME,
        path,
        headers: GITHUB_HEADERS
    });
    return Buffer.from(data.content, 'base64').toString('utf-8');
}

// Helper to get post metadata by parsing frontmatter from the markdown file
async function getPostMeta(file) {
    const slug = file.name.replace(/\.md$/, '');
    const raw = await fetchFileContent(file.path);
    const { data: frontmatter } = matter(raw);

    return {
        title: frontmatter.title || slug,
        summary: frontmatter.summary || '',
        date: frontmatter.date || '',
        category: frontmatter.category || '',
        slug,
        path: file.path
    };
}

// List all posts
routes.get('/', async (req, res) => {
    try {
        const repoInfo = await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
            owner: REPO_OWNER,
            repo: REPO_NAME,
            path: 'Posts',
            headers: GITHUB_HEADERS
        });
        const mdFiles = repoInfo.data.filter(f => f.name.endsWith('.md'));
        const posts = await Promise.all(mdFiles.map(getPostMeta));
        res.json(posts);
    } catch (error) {
        console.error('Error fetching posts:', error.message);
        res.status(error.status || 500).send(error.message);
    }
});

// Random post - redirects to a random post slug
routes.get('/random', async (req, res) => {
    try {
        const repoInfo = await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
            owner: REPO_OWNER,
            repo: REPO_NAME,
            path: 'Posts',
            headers: GITHUB_HEADERS
        });
        const mdFiles = repoInfo.data.filter(f => f.name.endsWith('.md'));
        if (mdFiles.length === 0) return res.status(404).json({ error: 'No posts found' });
        const randomFile = mdFiles[Math.floor(Math.random() * mdFiles.length)];
        const slug = randomFile.name.replace(/\.md$/, '');
        res.json({ slug });
    } catch (error) {
        res.status(error.status || 500).send(error.message);
    }
});

// Filter posts by category
routes.get('/category/:category', async (req, res) => {
    try {
        const category = req.params.category.toLowerCase();
        const repoInfo = await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
            owner: REPO_OWNER,
            repo: REPO_NAME,
            path: 'Posts',
            headers: GITHUB_HEADERS
        });
        const mdFiles = repoInfo.data.filter(f => f.name.endsWith('.md'));
        const allPosts = await Promise.all(mdFiles.map(getPostMeta));
        const filtered = allPosts.filter(p => p.category.toLowerCase() === category);
        res.json(filtered);
    } catch (error) {
        res.status(error.status || 500).send(error.message);
    }
});

// Get a single post by slug
routes.get('/:slug', async (req, res) => {
    try {
        const slug = req.params.slug;
        const raw = await fetchFileContent(`Posts/${slug}.md`);
        const { data: frontmatter, content: markdown } = matter(raw);

        res.json({
            title: frontmatter.title || slug,
            summary: frontmatter.summary || '',
            date: frontmatter.date || '',
            category: frontmatter.category || '',
            slug,
            markdown
        });
    } catch (error) {
        res.status(error.status || 500).send(error.message);
    }
});

export default routes;

