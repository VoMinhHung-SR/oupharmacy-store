# Routing Structure

## Product & Category Routes

- `/{category-slug}` - Category listing page (danh sách sản phẩm theo danh mục)
- `/{category-slug}/{medicine-slug}` - Product detail page (chi tiết sản phẩm)

## Backward Compatibility

- `/products/[id]` - Redirects to `/{category-slug}/{medicine-slug}` format

## Components

- `ProductDetailPageContent` - Component cho product detail
- `CategoryListingPageContent` - Component cho category listing

## Checkout Routes

- `/don-hang` - Trang thanh toán
- `/don-hang/xac-nhan-don-hang` - Xác nhận đơn hàng (query: `order_number` ưu tiên, `order_id` fallback)
- `/tai-khoan/don-hang` - Danh sách đơn hàng
- `/tai-khoan/don-hang/[orderNumber]` - Chi tiết đơn hàng (dùng `order_number` hoặc `id`)

## Examples

- `/thuc-pham-chuc-nang` → Danh sách sản phẩm thực phẩm chức năng
- `/thuc-pham-chuc-nang/vitamin-c-1000mg` → Chi tiết sản phẩm Vitamin C

