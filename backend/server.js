import express from 'express';
import blogPostRoutes from './routes/blog-posts.js'

const app = express();

app.use('/api/blog-posts', blogPostRoutes)

app.get('/', (req,res) => {
    res.send('<h1>This is an Express server</h1>')
});

const port = process.env.PORT || 3000; 

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})