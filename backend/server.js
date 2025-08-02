import express from 'express';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import blogPostRoutes from './routes/blog-posts.js'

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '.env') });

const app = express();

app.use('/api/blog-posts', blogPostRoutes)

app.get('/', (_, res) => {
    res.send('<h1>This is an Express server</h1>')
});

const port = process.env.PORT || 3000; 

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})