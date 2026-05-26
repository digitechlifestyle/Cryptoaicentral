# Crypto AI Central Deployment Audit — Runs 35+

This file tracks deployment runs that must be checked before the site can be treated as live-ready.

## Key concern

Several GitHub Pages deployment runs were triggered after content and SEO fixes, but some runs were very short. A very short run can indicate early failure, cancellation, skipped build, permission issue, Pages configuration issue, or a build error before artifact upload.

## Runs to verify first

| Run | Commit | Commit message | Duration shown | Priority | Status to confirm |
| --- | --- | --- | --- | --- | --- |
| #61 | a0b4a5b | Trigger deploy after latest content updates | 4s | Critical | Check jobs/logs |
| #60 | a5e09fa | Make rewards page business-ready with funding and anti-abuse model | 32s | High | Check build + deploy succeeded |
| #59 | a83b5c6 | Add category fallback guide content | 27s | High | Check build + deploy succeeded |
| #58 | 373d500 | Add Featured fallback guide content | 34s | High | Check build + deploy succeeded |
| #57 | a617d80 | Add Browse fallback educational listings | 32s | High | Check build + deploy succeeded |
| #56 | fff8583 | Add content audit checklist for SEO quality enforcement | 27s | Medium | Check build + deploy succeeded |
| #55 | 133d360 | Trigger deploy after guide SEO image meta update | 29s | Medium | Check build + deploy succeeded |
| #52 | ae5cbf9 | Add article structured data to guide pages | 7s | Critical | Check jobs/logs |
| #51 | ca4be43 | Add SEO quality checklist for guide publishing standards | 7s | Critical | Check jobs/logs |

## What to inspect in each failed run

1. Open the run.
2. Check whether the build job started.
3. Check whether `npm install` completed.
4. Check whether `npm run build` completed.
5. Check whether `Upload Pages artifact` completed.
6. Check whether `Deploy to GitHub Pages` completed.
7. If a run failed, copy the first red build error into a fix note.

## Current site-quality fixes already committed

- Browse fallback educational listings.
- Featured fallback guide cards.
- Category fallback guide cards.
- Rewards funding model and anti-abuse rules.
- Blog card images and content.
- Learn Hub card images and content.
- Guide article images, captions and metadata.
- Long-form article enforcement.
- Sitemap guide URL updates.

## Next technical action

Do not keep blindly re-running. The next technical action is to inspect the failed or short runs and fix the first actual error shown in the logs.

## Live click-through testing after successful deploy

Test these pages after a confirmed successful deployment:

- Home
- Blog
- Learn
- Browse
- Featured
- Compare
- Rewards
- Category tabs
- Bitcoin guide
- Wallet guide
- Exchange guide
- AI tools guide
- DeFi guide
- Crypto tax guide

## Pass condition

A deployment only counts as successful if:

- Build job passes.
- Deploy job passes.
- GitHub Pages URL updates.
- Live site shows the latest content.
- Main nav and guide cards click through correctly.
