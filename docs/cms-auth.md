# CMS Authentication

Netlify Identity manages access to the Decap CMS admin area.

## Login flow

1. Deploy the app or run the development server.
2. Visit `/admin/` and select **Log in**.
3. Authenticate with Netlify Identity or a connected GitHub account.
4. After authentication, the CMS loads if your Identity role is `admin` or `editor`.

## Inviting new editors

1. In the Netlify dashboard, open the **Identity** tab.
2. Click **Invite users** and enter the editor's email.
3. Assign the `editor` role and send the invitation.
4. The recipient follows the email link to create a password and access the CMS.

## Account recovery

- **Forgot password:** Use the **Forgot your password?** link on the login screen. A reset link will be emailed.
- **Lost or expired invite:** An admin can resend the invitation from the Netlify Identity dashboard.
- **GitHub login issues:** Reset the password through GitHub's recovery process and retry logging in.
