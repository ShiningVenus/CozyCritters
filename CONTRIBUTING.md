# Contributing

Thanks for helping make Cozy Critter better!

## Quick Start

1. Install dependencies
   ```bash
   npm install
   ```
2. Start the development server
   ```bash
   npm run dev
   ```

## NPM Scripts

- `npm run dev` – start development server
- `npm run build` – build for production
- `npm run preview` – preview the production build
- `npm start` – run the built server
- `npm run check` – TypeScript checks
- `npm test` – run tests

## Editorial workflow

Content edited in Decap CMS uses an editorial workflow with three stages:

1. **Draft** – save unfinished work.
2. **In Review** – submit for maintainer review.
3. **Ready** – approved content that can be merged and published.

Once changes reach the Ready stage and are merged into `main`, a Netlify build hook deploys the updated site.

## Pull Request Checklist

- [ ] Tests pass (`npm test`)
- [ ] Type checks pass (`npm run check`)
- [ ] Clear, short labels
- [ ] Content warnings added if needed
- [ ] No secrets or keys committed

