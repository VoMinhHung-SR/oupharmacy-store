# Routing Structure

## Product & Category Routes

- `/{category-slug}` - Category listing page (danh sách sản phẩm theo danh mục)
- `/{category-slug}/{medicine-slug}` - Product detail page (chi tiết sản phẩm)

## Backward Compatibility

- `/products/[id]` - Redirects to `/{category-slug}/{medicine-slug}` format

## Components

- `ProductDetailPageContent` - Component cho product detail
- `CategoryListingPageContent` - Component cho category listing

## Trang tiếp thị / placeholder (Sắp ra mắt)

- `/tu-van-duoc-si` — Tư vấn dược sĩ
- `/tim-nha-thuoc` — Tìm nhà thuốc
- `/tiem-vac-xin` — Tiêm vắc xin
- `/tra-cuu-thuoc-chinh-hang` — Tra cứu thuốc chính hãng
- `/tro-giup` — Trung tâm trợ giúp
- `/chinh-sach-doi-tra` — Chính sách đổi trả

## Checkout Routes

- `/don-hang` - Trang thanh toán
- `/don-hang/xac-nhan-don-hang` - Xác nhận đơn hàng (query: `order_number` ưu tiên, `order_id` fallback)
- `/tai-khoan/don-hang` - Danh sách đơn hàng (lọc trạng thái, sort ngày, phân trang; query: `page`, `page_size`, `status`, `ordering`)
- `/tai-khoan/don-hang/[orderNumber]` - Chi tiết đơn hàng (dùng `order_number` hoặc `id`). Roadmap (plan `order-workflow-advanced` trong `.cursor/plans/`): tìm mã đơn trên list, tracking, in/PDF.

## Examples

- `/thuc-pham-chuc-nang` → Danh sách sản phẩm thực phẩm chức năng
- `/thuc-pham-chuc-nang/vitamin-c-1000mg` → Chi tiết sản phẩm Vitamin C