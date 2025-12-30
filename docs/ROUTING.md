# Routing Structure

## Product & Category Routes

- `/{category-slug}` - Category listing page (danh sách sản phẩm theo danh mục)
- `/{category-slug}/{medicine-slug}` - Product detail page (chi tiết sản phẩm)

## Backward Compatibility

- `/products/[id]` - Redirects to `/{category-slug}/{medicine-slug}` format

## Components

- `ProductDetailPageContent` - Component cho product detail
- `CategoryListingPageContent` - Component cho category listing

## Examples

- `/thuc-pham-chuc-nang` → Danh sách sản phẩm thực phẩm chức năng
- `/thuc-pham-chuc-nang/vitamin-c-1000mg` → Chi tiết sản phẩm Vitamin C

