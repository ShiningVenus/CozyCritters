# Minimal CMS Backend

A lightweight Express server that stores editable site content in local JSON files. It manages moods, games, and general pages used by the frontend.

## Features
- File-based storage (`cms/data/*.json`)
- REST endpoints for public content retrieval
- Secured admin endpoints with HTTP Basic Auth
- Basic rate limiting to prevent abuse

## Setup

### Quick start
Run the helper script to install dependencies, create an `.env` file, and start the server:

```bash
cd cms
./install.sh
```

The script verifies Node (18 or newer) and `npm`, installs packages, copies `.env.example` to `.env`, prompts for `CMS_USER` and `CMS_PASS` (generating strong random values if left blank) and copies them to your clipboard, then builds and launches the server.

### Manual steps
1. Install dependencies
   ```bash
   cd cms
   npm install
   ```
2. Copy environment template and adjust credentials
   ```bash
   cp .env.example .env
   # edit .env as needed
   ```

**Security note:** Before deploying to production, set `CMS_USER` and `CMS_PASS` to secure values. The server throws an error on startup if these variables remain `admin`/`change-me` when `NODE_ENV` is `production`.

## Scripts
- `npm run dev` – start the server in watch mode
- `npm run build` – compile TypeScript to `dist/`
- `npm start` – run the compiled server

## API
| Method | Path | Description |
|--------|------|-------------|
| GET | `/moods` | Public list of moods |
| GET | `/games` | Public list of games |
| GET | `/pages` | Public list of pages |
| GET | `/admin/moods` | Authenticated list |
| POST | `/admin/moods` | Create mood |
| PUT | `/admin/moods/:id` | Update mood |
| DELETE | `/admin/moods/:id` | Remove mood |
| POST/PUT/DELETE | `/admin/games` and `/admin/pages` | Same pattern for other content |

All admin routes require HTTP Basic Auth using the credentials defined in `.env` (`CMS_USER` and `CMS_PASS`).

## Extending
Add more content types by creating another JSON file in `cms/data` and mounting an additional admin router in `src/index.ts` following the existing pattern.
