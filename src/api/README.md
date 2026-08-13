# API mock fixtures

Fixtures mirror **response bodies**. Prefer first-party `/mocks/*.svg`.

Generated homepage CMS PNGs live under `public/mocks/home-cms/` (gitignored) — keep locally for QA; seed via BE `seed_home_cms_demo`.

## Taxonomy (home)

| Kind | Path | Role |
|------|------|------|
| **CMS / campaign placements** | `campaigns/placements.home.response.json` | D-21/D-22: HERO/SECONDARY arrays; NOTICE singles |
| **Flash sale** (campaign-like) | `home/flash-sale.response.json` | D-23: `enabled` + windows + products — **not** price overwrite (D-01). Hide when disabled or empty |
| **Hot sale** (fixed section) | `home/hot-sale.response.json` | Bestsellers rail → later `search?sort=bestselling` |
| **Featured categories** (fixed) | `home/featured-categories.response.json` | Category grid → later category API |
| **Favorite brands** (fixed) | `home/favorite-brands.response.json` | Brand rail → later brand API |

Import **one** JSON per section (plus `home/types.ts` if needed). Do not barrel all home fixtures into a single module.
