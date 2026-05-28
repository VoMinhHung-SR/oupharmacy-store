# Store routing (category + product)

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
2. Category → list + `dynamic-filters` chỉ với `category_path`
3. Product → detail API + `?v=` (optional); PDP có selector quy cách nếu `variants.length > 1`

Code:

- `src/lib/store-path/` — resolve + href helpers
- `src/lib/hooks/useStorePage.ts` — orchestration
- `src/components/products/StorePage.tsx` — UI switch

## BE

- `storeApp/services/store_path_resolver.py` — resolve path
- `storeApp/services/variant_listing.py` — `one_variant_per_product()` cho search, category list, search suggest
- Search `meta.total` = số **product** distinct, không phải số variant
- List card key (FE): `getListProductKey()` = `product_entity_id ?? product.id`

## Commands (refactor / verify)

```bash
# Backend tests (Docker, từ repo BE)
cd Clinic-Oupharmacy-BE
docker compose exec -T backend python manage.py test storeApp.tests.test_search storeApp.tests.test_category_m2m_api -v1

# Rebuild backend sau khi đổi views/urls
docker compose build backend && docker compose up -d backend

# FE typecheck
cd oupharmacy-store && npx tsc --noEmit
```

## Ví dụ

- `/duoc-my-pham/cham-soc-da-mat/sua-rua-mat-kem-gel-sua` → danh mục
- `/duoc-my-pham/.../gel-rua-mat-svr-...-400-ml` → chi tiết (2 variant chọn trên PDP)
- `/duoc-my-pham/.../gel-rua-mat-svr-...-400-ml?v=14253` → mở đúng variant Chai
