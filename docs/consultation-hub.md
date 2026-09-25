# Consultation Hub — Storefront (oupharmacy-store)

Shipped MVP: one FAB chat widget that routes three deterministic intents (no NLP/LLM).

## Product

```text
ConsultChatbox (FAB + panel)
 ├─ (1) Pharmacist → ConsultationSession + Firestore ↔ Clinic pharmacist
 ├─ (2) Doctor     → BookingActionBubble → MAIN_API examinations/schedules
 └─ (3) Medicine   → searchStoreProducts ≤5 → CartContext.add
                      └─ price_display CONSULT → escalate pharmacist + context_json
```

Open: FAB, home quick link `openConsult`, deep-link `/?consult=open` → `useConsultUi().open()`.

## Intelligence lock

Menu / buttons / fixed FSM only. Free text in pharmacist thread is human chat, not intent parsing.

## Anti-spam (open session reuse)

`POST /consultation-sessions/` is idempotent while the customer still has `WAITING_FOR_PROFESSIONAL` or `IN_PROGRESS`: BE returns that session (merge `need_text` / `context_json` when escalate). Store reuses `firestore_conversation_id` instead of creating a new Firestore thread each open.

## Key files

| Area | Path |
|------|------|
| FAB + panel | `src/components/consultation/ConsultChatbox.tsx` |
| FSM | `src/components/consultation/useConsultStateMachine.ts` |
| Menu 1/2/3 | `src/components/consultation/IntentMenuBubble.tsx` |
| Pharmacist | `PharmacistThreadPanel.tsx`, `usePharmacistThread.ts`, `src/lib/consultation/firestore.ts`, `src/lib/services/consultation.ts` |
| Doctor | `BookingActionBubble.tsx`, `src/lib/services/booking.ts` |
| Medicine | `ProductSuggestBubble.tsx` → `searchStoreProducts` + `useCart().add` |
| UI chrome | `ConsultMessageList.tsx`, `ConsultMiniBox.tsx` (header + inner surface + right CTA), `ConsultIconButtons.tsx` (Tabler `arrow-left` / `send`), `ConsultTypingIndicator.tsx` |
| Open popup | `src/contexts/ConsultUiContext.tsx` |

## Env

| Var | Role |
|-----|------|
| `NEXT_PUBLIC_API_URL` | Store API (`/consultation-sessions/`, `/search/`) |
| `NEXT_PUBLIC_MAIN_API_URL` | Doctor booking (schedules, time-slots, patients, examinations) |
| `NEXT_PUBLIC_CLINIC_SITE_URL` | Fallback booking link `/booking` |
| `NEXT_PUBLIC_APP_ENV` | Must match Clinic `VITE_APP_ENV` for Firestore collection prefix (`${env}_conversations`, `_messages`, `_users`) |
| `NEXT_PUBLIC_FIREBASE_*` | Firestore |

## UX notes

- Chat roles: **Bạn** (right) / **OUPharmacy** or **Dược sĩ** (left).
- Loading copy names the role: “Đang kết nối với Dược sĩ… / Bác sĩ…”.
- Panel scrolls to bottom on step / message / loading changes.
- Back / send = icon buttons + tooltip (“Quay lại”, “Gửi”).
- Branch mini-boxes (`ConsultMiniBox`): title + back only (no hint); inner `slate-50` surface; primary CTAs align right.

## Plans

- Workspace: `PersonalProject/plans/[Done] consultation-hub-mvp.plan.md`
- BE plan copy: `Clinic-Oupharmacy-BE/docs/planning/consultation.plan.md`
