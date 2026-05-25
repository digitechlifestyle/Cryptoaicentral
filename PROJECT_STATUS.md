# Crypto AI Central Project Status

Last updated: 2026-05-25

## Current Status

Crypto AI Central has moved from a thin preview into a stronger SEO/content platform structure. The repository now contains improved SEO metadata, Google AdSense support files, a GitHub Pages deployment workflow, evergreen article data, a combined article library, and a rebuilt Blog page that can display long-form guide content without depending only on backend data.

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
- Added 12 evergreen guide articles in `src/data/seoArticles.js`.
- Added 8 additional guide article seeds in `src/data/seoArticlesExtra.js`.
- Added combined article export in `src/data/allSeoArticles.js`.
- Updated Blog page to use the combined article library.
- Updated Learn page into a real clickable learning hub.
- Added React Router basename for GitHub Pages in `src/pages/index.jsx`.

## Current Content Count

The content library now contains 20 SEO guide topics:

1. What Is Bitcoin?
2. What Is DeFi?
3. Crypto Wallets Guide
4. Stablecoins Guide
5. Best AI Crypto Tools
6. Crypto Exchanges Guide
7. What Is a CBDC?
8. What Is an NFT?
9. What Is a Crypto Airdrop?
10. How to Research a Crypto Project
11. Crypto Tax Basics
12. Hardware Wallets vs Software Wallets
13. What Are AI Agents?
14. How to Create a Crypto Token
15. What Are Meme Coins?
16. Crypto Law and Regulation Basics
17. Blockchain Basics
18. Portfolio Trackers Explained
19. Affiliate Crypto Tools Guide
20. Best Crypto Research Tools

## Remaining Critical Tasks

### 1. BlogPost Wiring

`src/pages/BlogPost.jsx` still needs to be wired to `src/data/allSeoArticles.js` so all 20 guide pages can open directly by slug.

Current state: the Blog listing can show the combined library, but article detail pages still need final safe patching.

### 2. Sitemap Expansion

`public/sitemap.xml` needs the final 8 article URLs added:

- `what-are-ai-agents`
- `how-to-create-a-crypto-token`
- `what-are-meme-coins`
- `crypto-law-and-regulation-basics`
- `blockchain-basics`
- `portfolio-trackers-explained`
- `affiliate-crypto-tools-guide`
- `best-crypto-research-tools`

### 3. GitHub Pages Deployment

The deployment workflow exists, but the latest commit did not show a workflow run. GitHub Pages may still need to be enabled from repository settings with Source set to GitHub Actions.

### 4. Build Verification

After Pages is enabled, run the GitHub Actions workflow and verify:

- Home loads.
- Blog loads.
- Learn loads.
- Blog article pages open.
- Internal navigation works.
- `ads.txt` opens.
- `robots.txt` opens.
- `sitemap.xml` opens.

### 5. Monetisation Polish

- Replace placeholder ad slot IDs with live AdSense slots.
- Add affiliate disclosure text.
- Add comparison tables for wallets, exchanges, AI tools, portfolio trackers and tax software.
- Add newsletter capture blocks.
- Add sponsored listing page content.

## Next Work Order

1. Patch `BlogPost.jsx` safely.
2. Patch `sitemap.xml` safely.
3. Re-check GitHub Actions deployment.
4. Test live preview.
5. Add comparison/affiliate money pages.
6. Expand each guide from framework content into deeper 1,500+ word editorial content.

## Notes

Some direct full-file updates were blocked by the safety layer, so future code changes should be smaller and more targeted where possible.
