# Cozy Critter Architecture Overview

## Summary

Cozy Critter is a privacy-first PWA (Progressive Web App) that runs fully client-side. No data is sent to any server.

## Key Features

- **Frontend only:** No backend, runs as static files.
- **PWA:** Works offline, installable.
- **Data storage:** All data in browser localStorage.
- **Tech stack:** Likely Vite + React (confirm in `package.json`), plain JS, or similar.
- **Accessibility:** Designed for neurodivergent users.

## Main Components

- `src/`
  - `App.*`: Main app logic and routes.
  - `components/`: UI elements (mood picker, calendar, etc).
  - `storage/` or similar: Handles localStorage.
  - `service-worker.js`: For offline/PWA support.

## Data Flow

- User interacts with UI.
- State is updated in memory and persisted to `localStorage`.
- No network requests for user data.

## Security & Privacy

- No analytics, no accounts, no tracking.
- Optional: Review [privacy-security.md](./privacy-security.md).

## Extending

- Add new moods or features by editing components.
- All logic is client-side—fork and modify as you like!