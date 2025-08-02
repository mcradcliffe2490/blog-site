import { Octokit } from 'octokit';
import express from 'express';
import matter from 'gray-matter';

const routes = express.Router();

const octokit = new Octokit();

// Helper to get post metadata from a markdown file in the repo
async function getPostMeta(file) {
    const { data: fileContent } = await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
        owner: 'mcradcliffe2490',
        repo: 'blog-posts',
        path: file.path,
        headers: {
            'X-GitHub-Api-Version': '2022-11-28'
        }
    });
    // fileContent.content is base64 encoded
    const content = Buffer.from(fileContent.content, 'base64').toString('utf-8');
    const { data: frontmatter } = matter(content);
    return {
        title: frontmatter.title || file.name.replace(/\.md$/, ''),
        summary: frontmatter.summary || '',
        date: frontmatter.date || '',
        slug: file.name.replace(/\.md$/, ''),
        path: file.path
    };
}

routes.get('/', async (req, res) => {
    try {
        // Get all files in Posts directory
        const repoInfo = await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
            owner: 'mcradcliffe2490',
            repo: 'blog-posts',
            path: 'Posts',
            headers: {
                'X-GitHub-Api-Version': '2022-11-28'
            }
        });
        // Only process markdown files
        const mdFiles = repoInfo.data.filter(f => f.name.endsWith('.md'));
        // Fetch and parse metadata for each file
        const posts = await Promise.all(mdFiles.map(getPostMeta));
        res.json(posts);
    } catch (error) {
        console.log('Error details:', {
            status: error.status,
            message: error.message
        });
        res.status(error.status || 500).send(error.message);
    }
});

routes.get('/random', (req, res) => {

});

routes.get('/philosophy', (req, res) => { 
    // params: sortBy, ascending
});

routes.get('/teaching', (req, res) => {
    // params: sortBy, ascending
});

routes.get('/religion', (req, res) => {
    // params: sortBy, ascending
});

routes.get('/:slug', async (req, res) => {
    try {
        const slug = req.params.slug;
        const filePath = `Posts/${slug}.md`;
        const { data: fileContent } = await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
            owner: 'mcradcliffe2490',
            repo: 'blog-posts',
            path: filePath,
            headers: {
                'X-GitHub-Api-Version': '2022-11-28'
            }
        });
        const content = Buffer.from(fileContent.content, 'base64').toString('utf-8');
        const { data: frontmatter, content: markdown } = matter(content);
        res.json({
            ...frontmatter,
            slug,
            markdown
        });
    } catch (error) {
        res.status(error.status || 500).send(error.message);
    }
});

export default routes;

