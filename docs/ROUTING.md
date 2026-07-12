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

Code:

- `src/lib/store-path/` — resolve + href helpers
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
| `category`, `brand`, `price_range`, `in_stock`, `sort` | Category browse + sidebar filters |
| `q` | Global search `/tim-kiem`, header suggest |
| `include_facets=false` | Header dropdown (chỉ items) |

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
