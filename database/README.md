# Database

This document describes the database expectations, migrations, and local Docker setup.

## Supported DBs
- Primary: PostgreSQL (recommended)
- Alternatives: MySQL, MongoDB (adjust config accordingly)

## Migrations
- Migrations live at `/database/migrations` (or `/backend/migrations`)
- Example migration command:
  - Node: `npm run migrate`
  - Python: `alembic upgrade head`
  - Use the project's migration tool

## Local DB (docker-compose snippet)
Add or use a service named `database` in `docker-compose.yml`:
services:
  database:
    image: postgres:15
    environment:
      POSTGRES_DB: bychefiza_db
      POSTGRES_USER: dbuser
      POSTGRES_PASSWORD: dbpassword
    ports:
      - "5432:5432"
    volumes:
      - db-data:/var/lib/postgresql/data
volumes:
  db-data:

## Backups &amp; Migrations
- Document backup procedures, restore steps, and migration rollbacks in `/docs` or operational runbooks.

## Notes
- Replace placeholders (user/password/db) with secure values or use secrets in production.
