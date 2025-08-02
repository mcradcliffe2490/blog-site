import { Octokit } from 'octokit';
import express from 'express';
import matter from 'gray-matter';
import dotenv from 'dotenv';
dotenv.config({ path: new URL('../.env', import.meta.url).pathname });

const routes = express.Router();

const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN
});

// Cache for metadata
let metadataCache = null;

// Helper to get metadata from metadata.json
async function getMetadata() {
    if (metadataCache) return metadataCache;
    
    try {
        const { data: fileContent } = await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
            owner: 'mcradcliffe2490',
            repo: 'blog-posts',
            path: 'metadata.json',
            headers: {
                'X-GitHub-Api-Version': '2022-11-28'
            }
        });
        const content = Buffer.from(fileContent.content, 'base64').toString('utf-8');
        metadataCache = JSON.parse(content);
        return metadataCache;
    } catch (error) {
        console.error('Error fetching metadata.json:', error);
        return {};
    }
}

// Helper to get post metadata from a markdown file in the repo
async function getPostMeta(file) {
    const slug = file.name.replace(/\.md$/, '');
    const metadata = await getMetadata();
    const postMeta = metadata[slug] || {};
    
    console.log(`Post: ${slug}`);
    console.log(`  - postMeta.title: "${postMeta.title}"`);
    console.log(`  - final title: "${postMeta.title || slug}"`);
    console.log(`  - metadata keys:`, Object.keys(metadata));
    
    return {
        title: postMeta.title || slug,
        summary: postMeta.summary || '',
        date: postMeta.date || '',
        category: postMeta.category || '',
        slug: slug,
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
        
        // Get the markdown content
        const { data: fileContent } = await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
            owner: 'mcradcliffe2490',
            repo: 'blog-posts',
            path: filePath,
            headers: {
                'X-GitHub-Api-Version': '2022-11-28'
            }
        });
        const content = Buffer.from(fileContent.content, 'base64').toString('utf-8');
        const { content: markdown } = matter(content);
        
        // Get metadata from metadata.json
        const metadata = await getMetadata();
        const postMeta = metadata[slug] || {};
        
        res.json({
            title: postMeta.title || slug,
            summary: postMeta.summary || '',
            date: postMeta.date || '',
            category: postMeta.category || '',
            slug,
            markdown
        });
    } catch (error) {
        res.status(error.status || 500).send(error.message);
    }
});

export default routes;

