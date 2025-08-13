# CMS Authentication

GitHub manages access to the Decap CMS admin area.
For self‑hosted deployments, the server can also require HTTP Basic Auth
before the CMS assets or APIs are served.

### Configuration

In `public/admin/config.yml` the backend is configured to use GitHub:

```yml
backend:
  name: github
  repo: owner/CozyCritters
  branch: main
  auth_type: implicit
```

Only collaborators with write access to the repository can open the CMS.

## Basic Auth setup

1. **Create editor accounts**
   - Run `npm run cms:add-user -- <username> <password>` to hash a password and
     append it to `cms-users.json`.
   - Alternatively, set the `CMS_USERS` environment variable to a JSON object
     mapping usernames to `<salt>:<hash>` strings.
2. **Protect CMS routes**
   - The server automatically applies Basic Auth to `/admin`, `/api`, and
     `/content` routes when credentials are present.
3. **Log in**
   - Open `/admin/` in the browser and enter the username and password when
     prompted.

### Login flow

1. Deploy the app or run the development server.
2. Visit `/admin/` and choose **Log in with GitHub**.
3. Authorize the application in the GitHub OAuth screen.
4. After authentication, the CMS loads if your GitHub account has write access to the repository.

### Inviting new editors

1. In the GitHub repository, open **Settings → Collaborators and teams**.
2. Click **Add people** and enter the editor's username or email.
3. Grant the user write access and send the invitation.
4. The recipient accepts the invitation to gain CMS access.

### Account recovery

- **Forgot password:** Use GitHub's password reset process.
- **Lost or expired invite:** Send a new invitation from the repository settings on GitHub.
- **Other login issues:** Review your GitHub account status or contact the repository owner.

### Migrating from Netlify Identity

Netlify Identity has been deprecated. If your project previously used it:

1. In the Netlify dashboard, open the **Identity** tab.
2. Select **Export users** to download a CSV of existing accounts.
3. Notify users to authenticate with GitHub going forward.

