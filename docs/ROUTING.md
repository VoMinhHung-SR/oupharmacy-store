# Store routing (category + product)

> **API 2026-07-10:** Facets sidebar lấy từ `GET /search/` (`facets` field). Endpoint `dynamic-filters` **đã xóa** ở BE.  
> Chi tiết migration: `Clinic-Oupharmacy-BE/storeApp/guidelines/search-facets-migration-2026-07-10.md`

## URL model

| URL | Page |
|-----|------|
| `/{category-path}` | Category listing (1 card = 1 **Product**) |
| `/{category-path}/{product-slug}` | Product detail (chọn **Variant** quy cách, rồi **Unit** đơn vị) |
| `/{category-path}/{product-slug}?v={variantId}` | Deep link tới variant (Túi / Chai) |

- **Product**: một mặt hàng logic (`store_product`), một `slug`, một canonical URL.
- **ProductVariant**: quy cách đóng gói (Túi 400ml, Chai 400ml).
- **ProductVariantUnit**: đơn vị bán trong variant (nếu có nhiều).

## FE flow

1. `pathname` → `GET /api/store/resolve-path/{path}/` → `category` | `product` | `not_found`
2. Category → `resolve-path` + `GET /search/?category=` (items + `facets` trong cùng response)
3. Product → detail API + `?v=` (optional); PDP có selector quy cách nếu `variants.length > 1`
4. Header suggest → `GET /search/?q=&page_size=8&include_facets=false` (không facet SQL)

**Route shell:** `app/[category-slug]/[[...slug]]/page.tsx` (optional catch-all) — parent và nested dùng cùng `StorePage` (không remount khi 1→2 segment).

**Loading UX:** không dùng full-screen `BackdropLoading` cho browse catalog.
- Click: `markStoreNavIntent` (product card / subcategory) → skeleton **đúng loại** trong lúc resolve
- Sau resolve: page đúng type; listing/detail dùng in-page skeleton hoặc `isRefreshing` (overlay nhẹ trên grid)
- Cold multi-segment không intent: ưu tiên list shell (tránh PDP→list trên nested category)

Code:

- `src/lib/store-path/` — resolve + href + `nav-intent` + `pendingShellWhileResolving`
- `src/lib/hooks/useStorePage.ts` — orchestration
- `src/components/catalog/StorePage.tsx` — UI switch (category | PDP | not_found)

### `src/components/catalog/` layout

```text
catalog/
├── StorePage.tsx
├── index.ts                    # public: StorePage, *PageContent only
├── _shared/
│   ├── listing/                # sort, list view, category skeleton
│   ├── filters/                # ActiveFilters, SearchFacetsSidebar
│   └── category/               # subcategories, OverLimitMessage
├── category-listing/           # CategoryListingPageContent + parts/
├── product-detail/             # ProductDetailPageContent + parts/ + useProductDetailPage
└── search/                     # SearchResultsContent
```

Import rules: feature folders import `_shared/*` or `common/`; PDP parts stay under `product-detail/parts/`. Avoid importing `product-detail` from `category-listing`.

## BE

- `storeApp/services/store_path_resolver.py` — resolve path
- `storeApp/services/search_facets_service.py` — facet SQL + cache (gọi từ `search_products`)
- `storeApp/services/variant_listing.py` — `one_variant_per_product()` cho search, category list, search suggest
- Search `meta.total` = số **product** distinct, không phải số variant
- List card key (FE): `getListProductKey()` = `product_entity_id ?? product.id`

### Query params `/search/` (FE)

| Param | Dùng khi |
|-------|----------|
| `category`, `brand`, `origin_country`, `attrs`, `price_range`, `in_stock`, `sort` | Category browse + sidebar filters (`brand` / `origin_country` CSV multi; `attrs=code:slug` repeatable) |
| `q` | Global search `/tim-kiem`, header suggest |
| `include_facets=false` | Header dropdown (chỉ items) |

### Attribute facets (FE)

- BE SoT: `Clinic-Oupharmacy-BE/storeApp/guidelines/catalog-attributes.md`
- `facets.attributes[]` → `mapSearchFacetsToFilterGroups` (`search.ts`) → sidebar groups động
- Query: `collectAttrFacetParams` / `pickFacetSearchParams` (`facetSearchParams.ts`) → repeatable `attrs`
- Entry: `useStorePage.ts`, `tim-kiem/page.tsx`
- Sidebar: chỉ hiện **label** option (không hiện `(count)`); không map facet `in_stock` (Tình trạng)
- Không hardcode audience/flavor lists trên FE

**Coverage note:** facet `attributes` chỉ aggregate SP đã có `ProductAttributeValue`. Listing ~trăm SP nhưng PAV coverage thấp → sidebar attr chỉ vài option — không phải bug đếm. `origin_country` lấy từ `Brand.country` (đầy hơn).

## Commands (refactor / verify)

```bash
# Backend tests (Docker, từ repo BE)
cd Clinic-Oupharmacy-BE
docker compose exec -T backend python manage.py test storeApp.tests.test_search storeApp.tests.test_category_m2m_api -v1

# Rebuild backend sau khi đổi views/urls / xóa dynamic-filters
docker compose build backend && docker compose up -d backend

# Facet tests (sau migration 2026-07-10)
docker compose exec -T backend python manage.py test storeApp.tests.test_search_facets -v1

# FE typecheck
cd oupharmacy-store && npx tsc --noEmit
```

## Ví dụ

- `/duoc-my-pham/cham-soc-da-mat/sua-rua-mat-kem-gel-sua` → danh mục
- `/duoc-my-pham/.../gel-rua-mat-svr-...-400-ml` → chi tiết (2 variant chọn trên PDP)
- `/duoc-my-pham/.../gel-rua-mat-svr-...-400-ml?v=14253` → mở đúng variant Chai
