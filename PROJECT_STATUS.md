# Crypto AI Central Project Status

Last updated: 2026-05-26

## Current Status

Crypto AI Central has moved from a thin preview into a stronger SEO/content platform structure. The repository now contains improved SEO metadata, Google AdSense support files, a GitHub Pages deployment workflow, evergreen article data, a combined article library, and a rebuilt Blog page that can display long-form guide content without depending only on backend data.

## Deployment Fix Applied

The previous Vite build failure was caused by `BlogPost.jsx` importing `getArticleBySlug` from `src/data/seoArticles.js` when that export was missing.

Resolved:

- `src/data/seoArticles.js` now exports `getArticleBySlug` as a compatibility helper.
- `src/pages/BlogPost.jsx` now imports and uses `getSeoArticle` directly.
- The missing-export blocker has been removed from the current main branch.

## Completed

- Cleaned browser title and SEO metadata in `index.html`.
- Added Google AdSense script reference in the document head.
- Added GitHub Pages base path in `vite.config.js`.
- Renamed package to `crypto-ai-central`.
- Added deploy scripts and `gh-pages` support in `package.json`.
- Added `public/ads.txt` for AdSense.
- Added `public/robots.txt`.
- Added `public/sitemap.xml` with initial guide URLs.
- Added GitHub Pages deployment workflow at `.github/workflows/deploy.yml`.
- Added evergreen guide articles in `src/data/seoArticles.js`.
- Added additional guide article seeds in `src/data/seoArticlesExtra.js` and `src/data/seoArticlesMore.js`.
- Added combined article export in `src/data/allSeoArticles.js`.
- Updated Blog page to use the combined article library.
- Updated Learn page into a real clickable learning hub.
- Added React Router basename for GitHub Pages in `src/pages/index.jsx`.
- Patched BlogPost import/export issue blocking deployment.

## Current Content Count

The content library contains SEO guide topics covering Bitcoin, DeFi, crypto wallets, stablecoins, AI crypto tools, exchanges, CBDCs, NFTs, airdrops, research, crypto tax, hardware wallets, AI agents, token creation, meme coins, regulation, blockchain basics, portfolio trackers, affiliate tools and research tools.

## Remaining Critical Tasks

### 1. GitHub Pages Deployment Verification

The code-level missing-export blocker has been fixed. The next step is verifying that the latest GitHub Actions run completes successfully and that GitHub Pages is enabled with Source set to GitHub Actions.

### 2. Sitemap Expansion

`public/sitemap.xml` should be checked against the final guide slug list so every article URL is included.

### 3. Live Site QA

After the new deployment run completes, verify:

- Home loads.
- Blog loads.
- Learn loads.
- Blog article pages open.
- Internal navigation works.
- `ads.txt` opens.
- `robots.txt` opens.
- `sitemap.xml` opens.

### 4. Monetisation Polish

- Replace placeholder ad slot IDs with live AdSense slots.
- Add affiliate disclosure text.
- Add comparison tables for wallets, exchanges, AI tools, portfolio trackers and tax software.
- Add newsletter capture blocks.
- Add sponsored listing page content.

## Next Work Order

1. Confirm fresh GitHub Actions deployment status.
2. Patch sitemap if required.
3. Test live preview.
4. Add comparison/affiliate money pages.
5. Expand guide content into deeper editorial pages where needed.

## Notes

Historical failed GitHub Actions runs may remain visible in the Actions tab. The professional state is achieved when the latest workflow run and latest deployment are green.
