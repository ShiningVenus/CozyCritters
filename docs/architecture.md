# Cozy Critter Architecture Overview

## Summary
Cozy Critter is a TypeScript monorepo with a React PWA frontend, an Express API server, and a separate moderation backend. The client works offline, while the servers handle optional account and moderation features backed by a Postgres database via Supabase.

## Main Components

### Client (`client/`)
- **Stack:** React + TypeScript, Vite, Tailwind CSS, shadcn/ui and Radix primitives.
- **Routing:** [Wouter](https://github.com/molefrog/wouter).
- **Storage:** Browser `localStorage` for mood entries and settings.
- **PWA:** Service worker for offline access and installability.

### Server (`server/`)
- **Framework:** Express.js.
- **Purpose:** Serves the built client and exposes REST API routes under `/api`.
- **Dev tooling:** Integrates with Vite for hot‑module reload in development (`vite.ts`).
- **Security:** Uses Helmet, CORS, and express‑rate‑limit middleware (`middleware/`).
- **Storage layer:** `storage.ts` provides an in‑memory implementation but is designed to plug into Drizzle ORM and Supabase/Postgres.

### Backend (`backend/`)
- **Framework:** Express.js with TypeScript.
- **Role:** Handles moderator and admin operations (ban approval, thread control, htpasswd management).
- **Auth:** JWT bearer tokens verified by `authMiddleware` with role checks.
- **Database:** Connects to Supabase (managed PostgreSQL) and uses Drizzle for schema management.

### Shared (`shared/`)
- Zod schemas and types shared between client and servers (e.g., `User`, `MoodEntry`).

## Data Flow
1. The client reads and writes mood data locally; when account features are enabled it communicates with the server’s `/api` routes.
2. The server processes requests and persists data using the configured storage backend (in‑memory or Supabase/Postgres).
3. Moderation and administrative tools talk to the backend service, which performs privileged operations against the database and audits actions.

## Security & Privacy
- No analytics or tracking; default usage remains local‑only.
- Server endpoints are protected with Helmet, CORS, and rate limiting.
- Backend routes require signed JWTs with appropriate roles.
- See [privacy-security.md](./privacy-security.md) for detailed privacy assurances.

## Extending
- **Client:** Add UI elements under `client/src/components` and update routes in `client/src/router.tsx`.
- **Server:** Implement a new `IStorage` in `server/storage.ts` to persist data to your database.
- **Backend:** Add moderator or admin routes under `backend/src/routes` with corresponding role checks.
