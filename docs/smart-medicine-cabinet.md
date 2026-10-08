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
| Expiry notifications | Bell on banner opens settings modal (`reminder_enabled`, soon days). Inbox card on the medicines view lists alerts (mark read / dismiss / clear read). |
| Dose schedule | Tab **Lịch uống** (`?tab=lich-uong-thuoc`, aliases `doses` / `schedule`): per-item daily times (1–4 × `HH:MM`, VN time) + optional note; pause/resume keeps times. Entry via banner tab, notify modal, or item actions. Stored on `CabinetItem.dose_*`; no push yet |

**Views:** default medicines page + optional dose schedule view (not a banner tile). Legacy `?tab=reminders|alerts` and `?focus=alerts` land on medicines and scroll to `#cabinet-alerts`.

**Guest:** client login gate (modal); no cabinet API calls without auth.

**Legacy redirects:** `/tu-thuoc-thong-minh` → `/tai-khoan/tu-thuoc`; `/nhac-uong-thuoc` → `/tai-khoan/tu-thuoc?tab=lich-uong-thuoc`.

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
| `CabinetWorkspace.tsx` | Main workspace: hero + notify bell, cabinet switcher, filters, item list, inbox card |
| `CabinetAlertsPanel.tsx` | HSD inbox (`variant="embedded"`); dismiss / clear-read / show-more |
| `NotifySettingsSheet.tsx` | Bell modal: expiry + dose prefs |
| `CabinetDosePanel.tsx` | Dose view: active / paused schedules, empty states |
| `DoseScheduleSheet.tsx` | Create / edit dose times + note → `PATCH /cabinet-items/{id}/` |
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
| Dose schedule / pause | `PATCH /cabinet-items/{id}/` with `dose_enabled`, `dose_times`, `dose_label` |
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
8. Lịch uống (`?tab=lich-uong-thuoc`) → add schedule (pick item, 2 times, note) → listed with chips; pause → moves to “paused”; resume.
9. `?tab=reminders` / `?focus=alerts` → medicines view, scrolled to inbox; `/nhac-uong-thuoc` → dose view.
10. Bell → settings modal (expiry + dose prefs); dismiss / clear-read remove alerts from inbox without recreate on next scan.

---

## Out of scope (by design)

Dose logs (“mark taken”), timed push/Zalo notifications, family sharing, AI suggestions, auto-seed at checkout.
