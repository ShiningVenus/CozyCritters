# CozyCritters Mod/Admin Backend

## Features
- Express.js + TypeScript
- Supabase integration (Service Role Key server-only)
- HMAC-signed JWT authentication using a shared secret
- Role-based auth for moderators and admins
- Audit logging for all mod/admin actions
- Soft delete + ban approval workflow
- JWT bearer authentication for mod and admin routes

## Setup
1. Copy `.env.example` → `.env` and fill with your project details. Set `JWT_SECRET` to the shared secret used to sign authentication tokens.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the server:
   ```bash
   npm run dev:server
   ```

## Authentication

Requests to the `/mod` and `/admin` routes must include an `Authorization` header with a bearer token signed using HMAC with `JWT_SECRET`. The token payload must include the appropriate `roles` claim.

## htaccess User Management

The admin router can manage an Apache-style `.htpasswd` file defined by `HTPASSWD_PATH`.

### `GET /htaccess/users`
Returns the list of usernames currently in the file.

### `POST /htaccess/users`
Adds a user. Body must contain `{ "username": string, "password": string }` and the password is stored as a bcrypt hash.

### `DELETE /htaccess/users/:username`
Removes the matching user from the file.

