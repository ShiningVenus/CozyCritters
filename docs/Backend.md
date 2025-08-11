# CozyCritters Mod/Admin Backend

## Features
- Express.js + TypeScript
- Supabase integration (Service Role Key server-only)
- JWT verification via Supabase JWKS
- Role-based auth for moderators and admins
- Audit logging for all mod/admin actions
- Soft delete + ban approval workflow

## Setup
1. Copy `.env.example` → `.env` and fill with your Supabase project details.
2. Install dependencies:
   ```bash
   npm install
