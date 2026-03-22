# Deployment Options

This project is a **decoupled Vue 3 SPA (frontend) + Express.js API (backend)**. The frontend builds to static files (`dist/`), while the backend requires a Node.js runtime. Below are deployment options suited to this architecture.

---

## Option 1: Render

Deploy both services from one repo with minimal config.

- **Frontend:** Static Site — build command `npm run build`, publish directory `frontend/dist`
- **Backend:** Web Service (Node.js) — start command `npm start` from `backend/`
- Set `GITHUB_TOKEN` as an environment variable on the backend service
- Free tier available for both service types

## Option 2: Railway

- Deploy frontend and backend as separate services from the same repo
- Each service gets its own environment variables and domain
- Supports automatic deploys from GitHub

## Option 3: Vercel (frontend) + Render/Railway (backend)

- **Frontend on Vercel:** Excellent Vite/SPA support with global CDN and auto-deploys
- **Backend on Render or Railway:** For the Express API
- Configure `VITE_API_URL` to point the frontend to the backend's URL

## Option 4: Netlify (frontend) + Fly.io (backend)

- **Frontend on Netlify:** Static site hosting with SPA redirect support
- **Backend on Fly.io:** Lightweight container-based hosting for Express

## Option 5: Single VPS (DigitalOcean, Linode, AWS EC2)

- Run both services on one machine behind **Nginx** as a reverse proxy
- Nginx serves static `dist/` files and proxies `/api` to the Express server
- Most flexible but requires server management (updates, SSL, etc.)

## Option 6: Docker + Container Host

- Containerize both services (or combine into one with Nginx + Node)
- Deploy to AWS ECS, Google Cloud Run, Azure Container Apps, or Fly.io

---

## Key Considerations

### Environment Variables
- The backend requires `GITHUB_TOKEN` to access the GitHub API via Octokit

### API URL in Production
The Vite dev proxy (`/api` → `localhost:3000`) only works in development. In production, either:
- Set `VITE_API_URL` at build time to point to the backend's public URL
- Deploy both behind the same domain with a reverse proxy routing `/api` to the backend

### SPA Routing
Vue Router uses client-side routing. Configure your host to serve `index.html` for all non-file requests:
- **Vercel:** Add a `vercel.json` with `"rewrites": [{"source": "/(.*)", "destination": "/index.html"}]`
- **Netlify:** Add a `public/_redirects` file with `/* /index.html 200`
- **Nginx:** Use `try_files $uri $uri/ /index.html`
