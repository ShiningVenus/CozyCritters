# CMS Authentication

The Cozy Critters CMS no longer relies on GitHub OAuth. Access is controlled with simple HTTP Basic Authentication.

## Configuration

The Decap CMS config (`public/admin/config.yml`) uses the `file-system` backend so content edits write directly to the server's file system.

```yml
backend:
  name: file-system
  api_root: /api
  branch: main
```

## Creating accounts

1. Run `npm run cms:add-user -- <username> <password> [role]` to create a user. If `cms-users.json` doesn't exist it will be created. The role defaults to `admin`.
2. Alternatively, set the `CMS_USERS` environment variable to a JSON object mapping usernames to an object with `password` and `role` fields, for example:

   ```bash
   CMS_USERS='{"alice":{"password":"<salt>:<hash>","role":"admin"}}'
   ```

## Login flow

1. Open `/cms-login.html` in your browser.
2. Enter the provided username and password.
3. On success the CMS admin interface loads and all subsequent API requests include the necessary credentials.

Share the credentials with editors who need access. To revoke access, remove the user entry from `cms-users.json` or rotate the password.
