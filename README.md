# World Heritage Explorer

A one-page React app to browse UNESCO World Heritage Sites.
Includes search, filters (type, country), sorting, favorites (localStorage),
and a detail modal with map link.

## Getting started

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
```

The static files will be in `dist/`.

## Deploy

### Vercel
- Import this folder as a project
- Framework: **Vite**
- Build command: `npm run build`
- Output directory: `dist`

### Netlify
- Drag & drop the `dist` folder on the web dashboard, or:
```bash
npm i -g netlify-cli
netlify deploy --build --prod
# publish directory: dist
```
