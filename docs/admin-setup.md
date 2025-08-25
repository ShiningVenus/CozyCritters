# Production Admin Setup Instructions

## Overview

The CozyCritters forum now includes a secure admin and moderator account system designed for production use. This system provides:

- **Secure Admin Setup Interface**: Protected by basic auth with default credentials
- **Environment-Based Protection**: Admin elevation features are disabled in production
- **Predefined Accounts**: Default admin/mod accounts with secure password hashing
- **Role-Based Access Control**: Different permissions for admin vs moderator users

## Default Credentials

⚠️ **IMPORTANT**: Change these default credentials immediately after first setup!

### Default Admin Account
- **Username**: `admin`
- **Password**: `ChangeMe123!`

### Default Moderator Account
- **Username**: `moderator`
- **Password**: `ChangeMeToo123!`

## Setup Instructions

### 1. First Time Setup

1. **Access Admin Setup**: Click the "Admin Setup" button in the forum interface
2. **Authenticate**: Use the default admin credentials above
3. **Change Default Passwords**: 
   - Click "Change My Password" to update the admin password
   - Create new moderator accounts or change existing ones
4. **Create Additional Accounts**: Use the interface to create new admin/mod accounts as needed

### 2. Production Deployment

In production mode:
- The demo "Admin Panel" for role elevation is automatically hidden
- Role elevation via the demo interface is blocked with console warnings
- Only the secure Admin Setup interface can be used to manage roles
- Default credentials are not displayed in the UI for security

### 3. Creating New Admin/Moderator Accounts

1. Login to Admin Setup with existing admin credentials
2. Fill out the "Create New Account" form:
   - **Username**: Choose a unique username (3-20 characters)
   - **Role**: Select Admin or Moderator (admins can create other admins)
   - **Password**: Minimum 8 characters
3. Confirm the password and click "Create Account"

### 4. Password Management

- **Change Own Password**: Use "Change My Password" in the Admin Setup
- **Security**: All passwords are hashed using SHA-256 before storage
- **Local Storage**: Admin accounts are stored in browser localStorage

## Security Features

### Development vs Production
- **Development Mode**: Shows default credentials, allows demo admin panel
- **Production Mode**: Hides sensitive info, blocks unsafe role elevation

### Authentication
- **Basic Auth**: Simple username/password authentication for admin setup
- **Password Hashing**: All passwords are securely hashed before storage
- **Session Management**: Secure session handling with role verification

### Access Controls
- **Admin**: Can create admin and moderator accounts, access all features
- **Moderator**: Can access moderation features, cannot create admin accounts
- **User**: Standard user permissions

## File Structure

```
client/src/
├── lib/
│   ├── admin-accounts.ts      # Admin account management
│   ├── environment.ts         # Environment detection
│   └── password-utils.ts      # Password hashing utilities
├── components/
│   ├── admin-setup.tsx        # Admin setup interface
│   └── community-forum.tsx    # Updated forum with admin controls
└── hooks/
    └── useUserSession.ts      # Updated session management
```

## API Reference

### Environment Detection
```typescript
import { isProduction, isDevelopment } from '../lib/environment';

if (isProduction()) {
  // Production-only code
}
```

### Admin Account Management
```typescript
import { 
  verifyAdminCredentials, 
  createAdminAccount, 
  changeAdminPassword 
} from '../lib/admin-accounts';

// Verify credentials
const role = await verifyAdminCredentials(username, password);

// Create new account
await createAdminAccount(username, password, 'moderator');

// Change password
await changeAdminPassword(username, oldPassword, newPassword);
```

## Troubleshooting

### Can't Access Admin Setup
- Ensure you're using the correct default credentials
- Check browser console for any errors
- Clear localStorage if needed: `localStorage.clear()`

### Forgot Admin Password
- If you have access to browser dev tools, you can reset admin accounts:
  ```javascript
  localStorage.removeItem('cozy-critter-admin-accounts');
  // Refresh page to regenerate default accounts
  ```

### Production Mode Issues
- The demo admin panel is intentionally hidden in production
- Use only the Admin Setup interface for role management
- Check browser console for environment detection logs

## Backup and Recovery

### Export Admin Accounts
```javascript
// In browser console
const accounts = localStorage.getItem('cozy-critter-admin-accounts');
console.log(accounts); // Copy this for backup
```

### Import Admin Accounts
```javascript
// In browser console
localStorage.setItem('cozy-critter-admin-accounts', '[your-backup-data]');
```

---

## Security Notes

1. **Change Default Passwords**: Always change default credentials in production
2. **Browser Security**: Data is stored in localStorage - ensure device security
3. **Backup Credentials**: Keep secure backups of admin credentials
4. **Regular Updates**: Periodically update passwords and review access
5. **Environment Variables**: Consider using environment variables for production credentials