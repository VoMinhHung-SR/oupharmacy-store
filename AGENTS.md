# OUPharmacy Store — Agent & contributor map

Next.js **14** (App Router), TypeScript, Tailwind, **next-intl**, React Query, Firebase (auth). Storefront gọi **backend riêng** qua biến môi trường (không phải monolith trong repo này).

## Đọc trước khi sửa code

1. File này (`AGENTS.md`) — điểm vào theo loại việc.
2. [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — luồng dữ liệu và ranh giới lớp.
3. Khi refactor/tối ưu **React/Next/UI**: tham chiếu skill (không cần nạp full file mỗi lần):
   - `.agents/skills/vercel-react-best-practices/` — `AGENTS.md`, `SKILL.md`
   - `.agents/skills/web-design-guidelines/SKILL.md`

## Cấu trúc thư mục (`src/`)

| Khu vực | Vai trò |
|---------|---------|
| `src/app/` | Routes & pages (App Router). Đặt tên theo URL (vd. `don-hang`, `gio-hang`, `tai-khoan`). |
| `src/components/` | UI tái sử dụng; nhóm theo domain (`checkout/`, `catalog/`, …). |
| `src/layouts/` | Header, navigation, footer wrappers. |
| `src/contexts/` | Cart, Auth, Checkout, Wishlist, Login modal, **CommonCities** (danh sách tỉnh/TP từ SSR root layout). |
| `src/lib/services/` | Gọi API (axios/fetch) tới backend store / main API; **`location.server.ts`** fetch `common-cities` trên server. |
| `src/lib/api.ts` | Axios instance store API (`NEXT_PUBLIC_API_URL`). |
| `src/lib/hooks/` | Hooks dùng chung. |
| `src/lib/validations/` | Yup / form validation. |
| `src/i18n/` | next-intl (`request.ts`, `messages/`). |
| `src/middleware.ts` | Redirect legacy checkout, strip `/vi` `/en`, matcher bảo vệ route. |
| `config/theme/` | Theme tokens (nếu có). |

`src/app/api/` và `src/api/` hiện **trống** — API nghiệp vụ nằm trên server ngoài; client gọi qua `src/lib/`.

## Đi vào đâu theo tính năng

| Việc | Bắt đầu từ |
|------|------------|
| Trang / routing | `src/app/.../page.tsx`, `layout.tsx` |
| Đặt hàng / checkout | `src/app/don-hang/`, `src/components/checkout/` |
| Giỏ hàng | `src/app/gio-hang/`, `CartContext` |
| Tài khoản / đơn hàng user | `src/app/tai-khoan/` |
| Sản phẩm / danh mục | `src/app/[category-slug]/`, `src/components/catalog/` (xem bảng components bên dưới) |
| Auth / token | `src/lib/services/auth.ts`, `AuthContext`, cookie `token` |
| HTTP client & env | `src/lib/api.ts`, `src/lib/services/*.ts` |

## Components: `common` vs `catalog/`

| Layer | Path | Khi nào dùng |
|-------|------|----------------|
| App-wide UI | `src/components/common/` | Không biết domain Product (vd. `HtmlContent`, `ProductImageGallery`) |
| Catalog shared | `src/components/catalog/_shared/` | Listing + search + category (filters, sort, subcategories) |
| Category listing | `src/components/catalog/category-listing/` | Trang danh mục (`CategoryListingPageContent`) |
| Product detail | `src/components/catalog/product-detail/` | PDP (`ProductDetailPageContent`, `parts/`, `useProductDetailPage`) |
| Search | `src/components/catalog/search/` | `/tim-kiem` |

Public barrel [`src/components/catalog/index.ts`](src/components/catalog/index.ts) chỉ export bốn entry: `StorePage`, `CategoryListingPageContent`, `ProductDetailPageContent`, `SearchResultsContent`. Import nội bộ dùng path đầy đủ tới `_shared/` hoặc `parts/`.

Local-only tooling: `.agent/` (gitignored); `.cursor/` (gitignored). `.agents/skills/` vẫn có thể commit nếu team chia sẻ skill pack.

## Lệnh dự án

```bash
npm install
npm run dev      # Next dev server
npm run lint     # next lint
npm run build    # production build
npm run start    # chạy build
```

## Biến môi trường (gợi ý; không commit secret)

- `NEXT_PUBLIC_API_URL` — API store (prefix `/api/store`).
- `NEXT_PUBLIC_MAIN_API_URL` — API chính (user, OAuth, common-config, …).
- `NEXT_PUBLIC_FIREBASE_*` — Firebase (xem `src/lib/config/firebase.ts`).

Dùng `.env.local`; không đưa giá trị thật vào chat hoặc commit.

## Không làm (trừ khi task yêu cầu rõ)

- Refactor rộng hoặc đổi convention ngoài phạm vi issue/feat.
- Thay đổi breaking API public mà không có kế hoạch / version.
- Commit credential hoặc paste secret vào code.

## Plans & template

- Kế hoạch feat: `.cursor/plans/` trong repo này.
- Tên file plan: **`[UnDone] … .plan.md`** khi mở việc; đổi thành **`[Done] …`** khi đóng feat (chi tiết: `PersonalProject/.cursor/rules/planning-project-plans-folder.mdc`).
- Template mới: [`.cursor/plans/_template.plan.md`](.cursor/plans/_template.plan.md).
