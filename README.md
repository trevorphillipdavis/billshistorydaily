# Bills History Daily

**billshistorydaily.com** — The Daily Archive of the Buffalo Bills

## Quick start

```bash
npm install
npm start        # dev server at localhost:3000
```

## Deploy to GitHub Pages (first time)

```bash
npm run deploy
```

## How the daily automation works

Every night at **2am ET**, GitHub Actions:
1. Runs `scripts/fetch-daily.js` — pulls the previous day's Bills news from configured RSS/JSON feeds
2. Saves the result as `public/pending/YYYY-MM-DD.json` for editorial review
3. Commits the pending file to the repo
4. Rebuilds the React app and redeploys to GitHub Pages

The daily fetch no longer requires an AI API key. The admin/editorial tools use the OpenAI proxy for headline, theme, writeup, and grouping generation.

## Setup checklist

### 1. Add your OpenAI API key to Vercel
- Add environment variable: `OPENAI_API_KEY`
- Vercel will deploy `api/openai.js` automatically

### 2. Custom domain
- In your domain registrar's DNS settings, add these A records pointing to GitHub Pages:
  - `185.199.108.153`
  - `185.199.109.153`
  - `185.199.110.153`
  - `185.199.111.153`
- Add CNAME: `www` → `YOUR-GITHUB-USERNAME.github.io`
- In GitHub repo → **Settings → Pages**, set custom domain to `billshistorydaily.com`

## Backfill a past date manually

```bash
node scripts/fetch-daily.js 2024-01-28
```

## Project structure

```
public/
  CNAME                     ← custom domain
  data/
    index.json              ← list of all available dates (newest first)
    2026-06-07.json         ← daily data files (auto-generated each morning)
    ...
api/
  openai.js                 ← Vercel serverless proxy for OpenAI generation
scripts/
  fetch-daily.js            ← daily news fetch script
src/
  App.jsx                   ← React app
  index.js
.github/
  workflows/
    daily.yml               ← runs every night at 2am ET
```
