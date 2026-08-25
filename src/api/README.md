# API mock fixtures

Fixtures mirror **response bodies**. Prefer first-party `/mocks/*.svg`.

Generated homepage CMS PNGs live under `public/mocks/home-cms/` (gitignored) — keep locally for QA; seed via BE `seed_home_cms_demo`.

| Slot | File | Pixels | Ratio | CSS |
|------|------|--------|-------|-----|
| Hero | `hero-main-{1,2}.png` | 1920×516 | 3.7:1 | `aspect-[1920/516]` + `object-cover` |
| Campaign lớn | `secondary-{1,2,3}.png` | 1300×400 | 3.25:1 | `aspect-[13/4]` |
| Campaign nhỏ | `notice-{top,bottom}.png` | 1020×300 | 3.4:1 | `aspect-[17/5]` |

## Taxonomy (home)

| Kind | Path | Role |
|------|------|------|
| **CMS / campaign placements** | `campaigns/placements.home.response.json` | D-21/D-22: HERO/SECONDARY arrays; NOTICE singles |
| **Flash sale** (campaign-like) | `home/flash-sale.response.json` | D-23: `enabled` + windows + products — **not** price overwrite (D-01). Hide when disabled or empty |
| **Hot sale** (fixed section) | `home/hot-sale.response.json` | Offline shape reference. Live: `getHotSaleProductsSSG` — per-card discount badge, sort 30→25→20 |
| **Featured categories** (fixed) | `home/featured-categories.response.json` | Category grid → later category API |
| **Favorite brands** (fixed) | `home/favorite-brands.response.json` | Offline shape reference. Live: `getFavoriteBrandsSSG` — top 10 + campaign 10–35% → `/thuong-hieu/{slug}?bid=&promo=` |

Import **one** JSON per section (plus `home/types.ts` if needed). Do not barrel all home fixtures into a single module.
