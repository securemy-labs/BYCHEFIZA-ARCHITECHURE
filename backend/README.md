# Backend

This file describes the expected backend structure and quick-start steps. Update to match the real backend runtime and tooling.

## Expected tech
- Runtime: Node.js / Python / Go / Java (replace accordingly)
- Package manager: npm / yarn / pip / go modules / maven

## Local dev
1. Install deps
   - `cd backend`
   - `npm install` (or equivalent)
2. Database
   - Ensure DB is running (see `/database/README.md`)
3. Run migrations
   - `npm run migrate` (or `alembic upgrade head`, `goose up`, etc.)
4. Start
   - `npm start` or `npm run dev`
5. Tests
   - `npm test`

## Environment variables
Common variables (match `.env.example`):
- PORT
- DATABASE_URL (or DB_HOST, DB_USER, DB_PASSWORD, DB_NAME)
- JWT_SECRET
- REDIS_URL

## Docker (example)
```
# Example Dockerfile usage
docker build -t bychefiza-backend ./backend
docker run -p 4000:4000 --env-file .env bychefiza-backend
```

## Migrations
- Migration scripts live in `/database/migrations` or `/backend/migrations` — run the project-specific migration command.

## Notes
- Update any scripts to match the project's framework, linting, and test commands.
