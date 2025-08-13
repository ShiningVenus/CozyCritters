# Editing Content with Decap CMS

Cozy Critters uses [Decap CMS](https://decapcms.org/) to edit JSON files stored in the `content/` directory.

## Accessing the editor

1. Initialize the first admin account with `npm run cms:init [username]`. The script prints a strong password so you can copy it.
2. Open `/cms-login.html` and sign in with that username and password.
3. You'll be redirected to `/admin/` where the CMS UI loads.

## Editing content

- **Moods** – edit the list of available moods in `content/moods.json`.
- **Games** – manage game metadata in `content/games.json`.
- **Pages** – edit simple pages stored in `content/pages.json`.

Use the interface to add, update, or remove entries. Changes are written as commits to your Git repository.

## Publishing changes

When you publish, Decap CMS commits the updated JSON files. Redeploy your site so the new content is served.

## Editorial workflow

Decap CMS organizes unpublished content into three status columns:

- **Draft** – initial saves that are still being written.
- **In Review** – content submitted for approval.
- **Ready** – approved entries ready to publish.

Editors move entries through these columns so only reviewed content is merged and deployed.

## Local development

Run the development server and open `http://localhost:5000/cms-login.html` (adjust the port if needed) to sign in. After login the CMS at `/admin/` writes directly to your local Git repo.
