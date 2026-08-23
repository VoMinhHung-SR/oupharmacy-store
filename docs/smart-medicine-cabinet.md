# Smart Medicine Cabinet — storefront

**Status:** Shipped (PRs #50, #51 → `dev`; pending `dev` → `main`)  
**Route:** `/tai-khoan/tu-thuoc`  
**Plans:** `PersonalProject/plans/[Done] smart-medicine-cabinet.plan.md`, `[Done] smart-cabinet-adjacent-domains.plan.md`, `[Done] cabinet-page-ui-redesign.plan.md`

---

## User-facing scope

| Feature | Description |
|---------|-------------|
| Multi-cabinet | Create, rename, switch tabs; cannot delete last cabinet |
| Item inventory | Add via search, SKU scan, seed from order, seed from prescription |
| Expiry UX | Manual HSD; badges/filters (`EXPIRED`, `EXPIRING_SOON`, …) |
| Low stock / OOS | Threshold per item or default; mark used up → OOS |
| Refill list | Flag items; overview section |
| Buy again | Adds to store cart via `/carts/items/` — **does not** decrement cabinet qty |
| HSD inbox | Panel on cabinet page; mark read / mark all read |
| Settings | Per-cabinet reminder toggle, custom “expiring soon” window |

**Guest:** client login gate (modal); no cabinet API calls without auth.

**Legacy redirect:** `/tu-thuoc-thong-minh` → `/tai-khoan/tu-thuoc`.

---

## Route & layout

| File | Role |
|------|------|
| `src/app/tai-khoan/tu-thuoc/page.tsx` | Page shell; renders `CabinetWorkspace` |
| `src/app/tai-khoan/tu-thuoc/layout.tsx` | Account sub-layout |

---

## Components (`src/components/cabinet/`)

| Component | Role |
|-----------|------|
| `CabinetWorkspace.tsx` | Main workspace: cabinet tabs, filters, item list, manage panel |
| `CabinetAlertsPanel.tsx` | HSD inbox (compact when empty) |
| `AddMedicineSheet.tsx` | Search catalog + add with HSD/qty |
| `SkuScanControl.tsx` | Barcode / SKU lookup → add flow |
| `SeedFromOrderSheet.tsx` | Pick lines from delivered orders |
| `SeedFromPrescriptionSheet.tsx` | Pick lines from clinic prescriptions |
| `ItemActionsSheet.tsx` | Edit qty/HSD/lot/threshold, refill, delete, mark OOS |
| `ExpiryBadge.tsx` / `InventoryBadge.tsx` | Status chips |

---

## Data layer

### Services (`src/lib/services/`)

| File | Backend |
|------|---------|
| `cabinet.ts` | `/cabinets/`, `/cabinet-items/`, `overview/` |
| `cabinetAlerts.ts` | `/cabinet-alerts/`, mark-read actions |
| `cabinetPrescriptions.ts` | `/cabinet-prescription-lines/` |

**Note:** `cabinet.ts` `unwrap()` treats **2xx with empty body** as success (DELETE returns 204).

### Hooks (`src/lib/hooks/`)

| Hook | Purpose |
|------|---------|
| `useCabinet.ts` | React Query: cabinets, items, overview, mutations + invalidation |
| `useCabinetAlerts.ts` | Inbox list, unread filter, mark read |
| `useCabinetBuyAgain.ts` | Add variant to cart for refill |

All cabinet store API calls use **`NEXT_PUBLIC_API_URL`** (store axios / fetch), not main API.

---

## API quick reference

See BE doc: `Clinic-Oupharmacy-BE/docs/smart-medicine-cabinet-api.md`.

| UI action | Endpoint |
|-----------|----------|
| Load cabinets | `GET /cabinets/` |
| Cabinet overview | `GET /cabinets/{id}/overview/` |
| List / filter items | `GET /cabinet-items/?cabinet=&expiration_status=` |
| Add / edit / delete item | POST / PATCH / DELETE `/cabinet-items/` |
| Inbox | `GET /cabinet-alerts/?unread=1` |
| Seed from Rx | `GET /cabinet-prescription-lines/` → POST `/cabinet-items/` |
| Buy again | `POST /carts/items/` (existing cart service) |

---

## Manual verify checklist

1. Login → `/tai-khoan/tu-thuoc` → default cabinet appears.
2. Add medicine (search) with HSD → item shows correct expiry badge.
3. Filters: expired / OOS; delete item → list updates without reload.
4. Create second cabinet, switch, rename; delete non-last cabinet.
5. Inbox: run BE scan (staging) → alerts appear; mark read.
6. Buy again → item in cart; cabinet qty unchanged.
7. Guest visit → login modal, no data leak.

---

## Out of scope (by design)

Medication adherence schedule, family sharing, push/Zalo notifications, AI suggestions, auto-seed at checkout.
