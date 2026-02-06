# Routing Structure

## Product & Category Routes

- `/{category-slug}` - Category listing page (danh sách sản phẩm theo danh mục)
- `/{category-slug}/{medicine-slug}` - Product detail page (chi tiết sản phẩm)

## Backward Compatibility

- `/products/[id]` - Redirects to `/{category-slug}/{medicine-slug}` format

## Components
hang
- `ProductDetailPageContent` - Component cho product detail
- `CategoryListingPageContent` - Component cho category listing

## Checkout Routes

- `/don-hang` - Trang index thanh toán
- `/don-hang/thong-tin` - Thông tin khách hàng
- `/don-hang/van-chuyen` - Chọn phương thức vận chuyển
- `/don-hang/thanh-toan` - Chọn phương thức thanh toán & đặt hàng
- `/don-hang/xac-nhan-don-hang` - Xác nhận đơn hàng (query: `order_id`)

## Examples

- `/thuc-pham-chuc-nang` → Danh sách sản phẩm thực phẩm chức năng
- `/thuc-pham-chuc-nang/vitamin-c-1000mg` → Chi tiết sản phẩm Vitamin C

