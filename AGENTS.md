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
| Search / facets sidebar | `useStorePage`, `useStoreSearch`, `SearchFacetsSidebar` — **chỉ** `GET /search/` (không `dynamic-filters`) |
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

## API catalog (store backend)

| UI | Endpoint |
|----|----------|
| Category browse + sidebar filters | `GET /resolve-path/{path}/` + `GET /search/?category=` |
| Global search `/tim-kiem` | `GET /search/?q=` |
| Header suggest | `GET /search/?q=&include_facets=false` |

Migration 2026-07-10 (xóa `dynamic-filters`): `Clinic-Oupharmacy-BE/storeApp/guidelines/search-facets-migration-2026-07-10.md` · FE routing: [`docs/ROUTING.md`](docs/ROUTING.md).

<!-- gitnexus:start -->
# GitNexus — Code Intelligence

This project is indexed by GitNexus as **oupharmacy-store** (2224 symbols, 3734 relationships, 135 execution flows). Use the GitNexus MCP tools to understand code, assess impact, and navigate safely.

> If any GitNexus tool warns the index is stale, run `npx gitnexus analyze` in terminal first.

## Always Do

- **MUST run impact analysis before editing any symbol.** Before modifying a function, class, or method, run `gitnexus_impact({target: "symbolName", direction: "upstream"})` and report the blast radius (direct callers, affected processes, risk level) to the user.
- **MUST run `gitnexus_detect_changes()` before committing** to verify your changes only affect expected symbols and execution flows.
- **MUST warn the user** if impact analysis returns HIGH or CRITICAL risk before proceeding with edits.
- When exploring unfamiliar code, use `gitnexus_query({query: "concept"})` to find execution flows instead of grepping. It returns process-grouped results ranked by relevance.
- When you need full context on a specific symbol — callers, callees, which execution flows it participates in — use `gitnexus_context({name: "symbolName"})`.

## Never Do

- NEVER edit a function, class, or method without first running `gitnexus_impact` on it.
- NEVER ignore HIGH or CRITICAL risk warnings from impact analysis.
- NEVER rename symbols with find-and-replace — use `gitnexus_rename` which understands the call graph.
- NEVER commit changes without running `gitnexus_detect_changes()` to check affected scope.

## Resources

| Resource | Use for |
|----------|---------|
| `gitnexus://repo/oupharmacy-store/context` | Codebase overview, check index freshness |
| `gitnexus://repo/oupharmacy-store/clusters` | All functional areas |
| `gitnexus://repo/oupharmacy-store/processes` | All execution flows |
| `gitnexus://repo/oupharmacy-store/process/{name}` | Step-by-step execution trace |

## CLI

| Task | Read this skill file |
|------|---------------------|
| Understand architecture / "How does X work?" | `.claude/skills/gitnexus/gitnexus-exploring/SKILL.md` |
| Blast radius / "What breaks if I change X?" | `.claude/skills/gitnexus/gitnexus-impact-analysis/SKILL.md` |
| Trace bugs / "Why is X failing?" | `.claude/skills/gitnexus/gitnexus-debugging/SKILL.md` |
| Rename / extract / split / refactor | `.claude/skills/gitnexus/gitnexus-refactoring/SKILL.md` |
| Tools, resources, schema reference | `.claude/skills/gitnexus/gitnexus-guide/SKILL.md` |
| Index, status, clean, wiki CLI commands | `.claude/skills/gitnexus/gitnexus-cli/SKILL.md` |

<!-- gitnexus:end -->
