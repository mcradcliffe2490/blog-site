import { Octokit } from 'octokit';
import express from 'express';
import dotenv from 'dotenv';

dotenv.config();
const routes = express.Router();

const octokit = new Octokit({
    auth: process.env.GITHUB_API_KEY
});


routes.get('/', async (req, res) => {
    try {
        const repoInfo = await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
            owner: 'mcradcliffe2490',
            repo: 'blog-posts',
            path: "Posts",
            headers: {
                'X-GitHub-Api-Version': '2022-11-28',
                'Authorization': `Bearer ${process.env.GITHUB_API_KEY}`
            }
        });
        res.send(repoInfo);
    } catch (error) {
        console.log('Error details:', {
            status: error.status,
            message: error.message,
            token: process.env.GITHUB_API_KEY ? 'Token present' : 'Token missing'
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

export default routes;

