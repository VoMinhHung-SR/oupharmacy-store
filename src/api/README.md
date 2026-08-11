# API mock fixtures

Fixtures mirror **response bodies**. Images use first-party `/mocks/*.svg` only.

## Taxonomy (home)

| Kind | Path | Role |
|------|------|------|
| **CMS / campaign placements** | `campaigns/placements.home.response.json` | Live BE shape for hero cluster |
| **Flash sale** (campaign-like) | `home/flash-sale.response.json` | Schedule windows + product rail — **not** price overwrite (D-01). BE endpoint TBD; FE uses fixture until then |
| **Hot sale** (fixed section) | `home/hot-sale.response.json` | Bestsellers rail → later `search?sort=bestselling` |
| **Featured categories** (fixed) | `home/featured-categories.response.json` | Category grid → later category API |
| **Favorite brands** (fixed) | `home/favorite-brands.response.json` | Brand rail → later brand API |

Import **one** JSON per section (plus `home/types.ts` if needed). Do not barrel all home fixtures into a single module.
