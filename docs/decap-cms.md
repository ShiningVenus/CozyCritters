# Editing Content with Decap CMS

Cozy Critters uses [Decap CMS](https://decapcms.org/) to edit JSON files stored in the `content/` directory.

## Accessing the editor

1. Deploy the app and visit `/admin/`.
2. Log in with your Git provider when prompted.
3. After authentication the CMS UI will load.

## Editing content

- **Moods** – edit the list of available moods in `content/moods.json`.
- **Games** – manage game metadata in `content/games.json`.
- **Pages** – edit simple pages stored in `content/pages.json`.

Use the interface to add, update, or remove entries. Changes are written as commits to your Git repository.

## Publishing changes

When you publish, Decap CMS commits the updated JSON files. Redeploy your site so the new content is served.

## Local development

Run the development server and open `http://localhost:5000/admin/` (adjust the port if needed). The CMS will write directly to your local Git repo.
