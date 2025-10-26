# Abhiram’s To‑Do (Next.js App Router)

Small to‑do app that runs entirely on the client with `localStorage` (no database). Perfect for Vercel serverless.

## Run locally
```bash
npm i
npm run dev
```

## Deploy on Vercel
- Push this folder to a Git repo (GitHub/GitLab/Bitbucket).
- Import the repo in Vercel (no env vars needed). Build command: `next build`. Output: default.
- Or use CLI:
  ```bash
  npm i -g vercel
  vercel
  ```

## Notes
- App Router only (no /pages). No placeholders. Author: Abhiram.
- Data persists per browser via `localStorage`.
- Works with serverless/static hosting since there's no server state.
