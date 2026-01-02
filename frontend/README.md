# Frontend

This file describes the expected frontend structure and quick-start steps. Update to match the real frontend framework (React, Vue, Angular, Svelte, etc.).

## Expected tech
- Framework: (e.g. React + Vite / CRA, Vue, Angular)
- Node.js >= 14
- Build system: npm / yarn / pnpm

## Local dev
1. Install deps
   - `cd frontend`
   - `npm install` (or `yarn` / `pnpm install`)
2. Run dev server
   - `npm start` (or `npm run dev`)
3. Build
   - `npm run build`
4. Serve static build (example)
   - `npx serve -s dist` (or containerize)

Adjust commands to match project tooling.

## Environment variables
Provide a `.env` file in `/frontend` or use the root `.env` entries. Typical vars:
- VITE_API_URL (or REACT_APP_API_URL)
- VITE_APP_ENV
- VITE_MAPS_API_KEY (if used)

## Docker (example)
Create `Dockerfile` and run:
```
docker build -t bychefiza-frontend .
docker run -p 3000:3000 bychefiza-frontend
```

## Ports
- Default dev port: 3000 (adjust in config)

## Notes
- Replace placeholder docs with actual framework-specific commands and examples.
