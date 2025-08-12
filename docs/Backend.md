# CozyCritters Mod/Admin Backend

## Features
- Express.js + TypeScript
- Supabase integration (Service Role Key server-only)
- JWT verification via Supabase JWKS
- Role-based auth for moderators and admins
- Audit logging for all mod/admin actions
- Soft delete + ban approval workflow
- API key authentication for mod and admin routes

## Setup
1. Copy `.env.example` → `.env` and fill with your Supabase project details.
2. Set `API_KEY` in `.env` to the value clients must send.
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the server:
   ```bash
   npm run dev:server
   ```

## Authentication

Requests to the `/mod` and `/admin` routes must include the API key via the `x-api-key` header. Supabase is not used for this authentication flow.

