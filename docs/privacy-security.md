# Privacy & Security Verification

Cozy Critter is built with privacy by default.

## Data Handling

- All user data is saved in the browser’s `localStorage`.
- No data leaves your device—ever.
- No analytics, telemetry, ads, or trackers.

## Auditing

- All code is open source.
- You can verify data handling by searching for `localStorage` and network requests in the codebase.

## Offline & PWA

- All features work offline.
- Service Worker caches assets for offline use.

## Security Best Practices

- Use a strong device password; anyone with device access can read your data.
- If you use a shared device, consider using a private browser profile.

## Export/Backup

- You can export your data (see [backup-export.md](./backup-export.md)).
- Backups are plain JSON—keep them secure.

## User Data Management (Supabase)

For self-hosted deployments that include the Supabase backend, two RPCs help users manage their data:

- `export_user_data` – returns a JSON document containing the user’s profile, posts, reactions, and nest memberships.
- `delete_user_account` – removes the authenticated user and cascades deletes to related rows.

Example usage with the provided TypeScript helpers:

```ts
import { exportUserData, deleteUserAccount } from '../backend/ts/user_privacy';

const { data } = await exportUserData(supabase);
await deleteUserAccount(supabase);
```

## Reporting Issues

- Privacy or security concern? Please open an issue or email the maintainer.
