"use client"
import React, { useCallback, useEffect, useId, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { useCart } from "@/contexts/CartContext"
import { useCheckout } from "@/contexts/CheckoutContext"
import Link from "next/link"
import { Container } from "@/components/Container"
import { useApplyVoucher } from "@/lib/hooks/useCarts"
import { toastError, toastSuccess } from "@/lib/utils/toast"
import {
  CartIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  InfoIcon,
  PercentInCircleIcon,
  TrashIcon,
} from "@/components/icons"
import { CartLineThumb } from "@/components/cart/CartLineThumb"
import { CartPwaInstallBanner } from "@/components/cart/CartPwaInstallBanner"
import { CartQuantityStepper } from "@/components/cart/CartQuantityStepper"
import { CartReceiptCard } from "@/components/cart/CartReceiptCard"
import { CartUnitSelect } from "@/components/cart/CartUnitSelect"
import { OfferSheet, SingleVoucherSheetBody } from "@/components/sheets"
import { FREE_SHIPPING_THRESHOLD } from "@/lib/constant"

function formatMoney(n: number) {
  return `${Math.round(n).toLocaleString("vi-VN")}₫`
}

const CART_SELECT_CHECK_CLASS = "cart-select-check"

/** Shared xl table track — header + line items must use the same template. */
const CART_DESKTOP_GRID =
  "xl:grid xl:grid-cols-[2rem_4.75rem_minmax(0,1fr)_7.5rem_9.5rem_6.5rem_2.25rem] xl:items-center xl:gap-4"

export default function CartPage() {
  const router = useRouter()
  const { setCheckoutScopedLineIds } = useCheckout()
  const applyVoucherMutation = useApplyVoucher()
  const {
    items,
    remove,
    updateQuantity,
    updateItemUnit,
    discountAmount = 0,
    orderVoucherCode,
    shippingVoucherCode,
    version: cartVersion,
    setItemSelected,
    setAllItemsSelected,
    selectionTotals,
    isLoading: cartLoading,
  } = useCart()
  const [offerModalOpen, setOfferModalOpen] = useState(false)
  const [voucherCode, setVoucherCode] = useState("")
  const [updatingUnitByItemId, setUpdatingUnitByItemId] = useState<Record<string, boolean>>({})
  const [pendingUnitChoiceByItemId, setPendingUnitChoiceByItemId] = useState<Record<string, number>>({})
  const unitChangeTimersRef = useRef<Record<string, number>>({})
  const unitMutatingRef = useRef(false)
  const voucherInputRef = useRef<HTMLInputElement>(null)
  const selectAllRef = useRef<HTMLInputElement>(null)
  const offerModalTitleId = useId()

  const selectedCount = selectionTotals.selectedCount
  const allSelected = items.length > 0 && selectedCount === items.length
  const someSelected = selectedCount > 0 && !allSelected
  const isUnitMutating = Object.keys(updatingUnitByItemId).length > 0

  useEffect(() => {
    const el = selectAllRef.current
    if (el) el.indeterminate = someSelected
  }, [someSelected])

  const ratio = selectionTotals.selectionRatio
  const discount = Math.max(0, discountAmount) * ratio
  const hasVoucherApplied = Boolean(orderVoucherCode || shippingVoucherCode)
  const directDiscount = hasVoucherApplied ? 0 : discount
  const voucherDiscount = hasVoucherApplied ? discount : 0
  const hasSavings = discount > 0

  const goCheckout = () => {
    const chosen = items.filter((i) => i.selected)
    if (chosen.length === 0) {
      toastError("Vui lòng chọn ít nhất một sản phẩm để thanh toán.")
      return
    }
    if (chosen.length < items.length) {
      setCheckoutScopedLineIds(chosen.map((i) => i.id))
    } else {
      setCheckoutScopedLineIds(null)
    }
    router.push("/don-hang")
  }

  const toggleSelectAll = () => {
    setAllItemsSelected(!allSelected)
  }

  const handleQuantityChange = (id: string, newQty: number) => {
    if (newQty < 1 || unitMutatingRef.current) return
    updateQuantity(id, newQty)
  }

  const handleUnitChange = useCallback(
    async (id: string, nextUnitId: number) => {
      if (!Number.isFinite(nextUnitId) || nextUnitId <= 0) return
      try {
        await updateItemUnit(id, nextUnitId)
      } catch (e: unknown) {
        toastError(e instanceof Error ? e.message : "Không thể đổi đơn vị đóng gói.")
      } finally {
        unitMutatingRef.current = false
        setUpdatingUnitByItemId((prev) => {
          const next = { ...prev }
          delete next[id]
          return next
        })
        setPendingUnitChoiceByItemId((prev) => {
          const next = { ...prev }
          delete next[id]
          return next
        })
      }
    },
    [updateItemUnit]
  )

  const scheduleUnitChange = useCallback(
    (id: string, currentUnitId: number, nextUnitId: number) => {
      if (!Number.isFinite(nextUnitId) || nextUnitId <= 0 || nextUnitId === currentUnitId) return
      // One unit mutation at a time — avoids version conflicts / API spam
      if (unitMutatingRef.current) return
      unitMutatingRef.current = true
      setPendingUnitChoiceByItemId((prev) => ({ ...prev, [id]: nextUnitId }))
      setUpdatingUnitByItemId((prev) => ({ ...prev, [id]: true }))
      const existingTimer = unitChangeTimersRef.current[id]
      if (existingTimer) window.clearTimeout(existingTimer)
      unitChangeTimersRef.current[id] = window.setTimeout(() => {
        delete unitChangeTimersRef.current[id]
        void handleUnitChange(id, nextUnitId)
      }, 220)
    },
    [handleUnitChange]
  )

  useEffect(() => {
    return () => {
      for (const timer of Object.values(unitChangeTimersRef.current)) {
        window.clearTimeout(timer)
      }
      unitChangeTimersRef.current = {}
    }
  }, [])

  const submitCartVoucher = useCallback(async () => {
    const code = voucherCode.trim()
    if (!code) {
      toastError("Vui lòng nhập mã giảm giá.")
      return
    }
    if (cartVersion == null) {
      toastError("Giỏ hàng chưa sẵn sàng, vui lòng thử lại.")
      return
    }
    try {
      await applyVoucherMutation.mutateAsync({
        expected_version: cartVersion,
        order_voucher_code: code,
      })
      toastSuccess("Áp dụng mã giảm giá thành công.")
      setOfferModalOpen(false)
      setVoucherCode("")
    } catch (e: unknown) {
      toastError(e instanceof Error ? e.message : "Áp dụng mã giảm giá thất bại.")
    }
  }, [applyVoucherMutation, cartVersion, voucherCode])

  useEffect(() => {
    if (!offerModalOpen || cartVersion == null) return
    const t = window.setTimeout(() => voucherInputRef.current?.focus(), 50)
    return () => window.clearTimeout(t)
  }, [cartVersion, offerModalOpen])

  return (
    <div className="min-h-[60vh] bg-[#ededed]">
      <Container className="py-3 sm:py-4">
        <div className="space-y-3 sm:space-y-4">
          {cartLoading ? (
            <div className="space-y-3 sm:space-y-4" aria-busy="true" aria-label="Đang tải giỏ hàng">
              <div className="h-5 w-40 animate-pulse rounded bg-slate-200/80" />
              <div className="grid grid-cols-1 gap-3 xl:grid-cols-[minmax(0,1fr)_min(20rem,32%)] xl:gap-x-8">
                <div className="min-h-[16rem] animate-pulse rounded-xl border border-slate-200/60 bg-white shadow-sm" />
                <div className="space-y-3">
                  <div className="min-h-[14rem] animate-pulse rounded-t-xl border border-b-0 border-slate-200/60 bg-white shadow-sm" />
                  <div className="h-28 animate-pulse rounded-xl border border-slate-200/60 bg-white" />
                </div>
              </div>
            </div>
          ) : items.length === 0 ? (
            <>
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition-colors hover:text-primary-700"
              >
                <ChevronLeftIcon className="h-5 w-5 shrink-0" />
                Tiếp tục mua sắm
              </Link>
              <div className="rounded-xl border border-slate-200/80 bg-white px-6 py-10 text-center shadow-sm sm:p-12">
                <div className="mb-4 text-slate-300">
                  <CartIcon className="mx-auto h-16 w-16" strokeWidth={1.5} />
                </div>
                <p className="mb-4 text-slate-600">Chưa có sản phẩm nào trong giỏ hàng</p>
                <Link
                  href="/"
                  className="inline-block rounded-xl bg-primary-600 px-6 py-2.5 font-semibold text-white transition-colors hover:bg-primary-700"
                >
                  Tiếp tục mua sắm
                </Link>
              </div>
            </>
          ) : (
            <div className="grid grid-cols-1 gap-3 pb-24 xl:grid-cols-[minmax(0,1fr)_min(20rem,32%)] xl:items-start xl:gap-x-8 xl:gap-y-2 xl:pb-0">
              <div className="xl:col-start-1 xl:row-start-1">
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition-colors hover:text-primary-700"
                >
                  <ChevronLeftIcon className="h-5 w-5 shrink-0" />
                  Tiếp tục mua sắm
                </Link>
              </div>
              {/* Left: single card — banner + toolbar + lines */}
              <div className="relative min-w-0 overflow-hidden rounded-xl border border-slate-200/60 bg-white shadow-[0_2px_16px_rgba(15,23,42,0.06)] xl:col-start-1 xl:row-start-2">
                {isUnitMutating ? (
                  <div
                    className="absolute inset-0 z-30 flex items-center justify-center rounded-xl bg-white/65 backdrop-blur-[1px]"
                    aria-busy="true"
                    aria-live="polite"
                    aria-label="Đang cập nhật đơn vị"
                  >
                    <span
                      className="h-9 w-9 animate-spin rounded-full border-2 border-primary-200 border-t-primary-600"
                      aria-hidden
                    />
                  </div>
                ) : null}
                <div className="border-b border-primary-100/80 bg-gradient-to-r from-primary-50 to-sky-50 px-3 py-2.5 sm:px-4 sm:py-3 md:px-5">
                  <p className="text-center text-xs font-medium leading-snug text-slate-700 sm:text-sm">
                    <span className="font-semibold text-primary-600">Miễn phí vận chuyển</span> đối với đơn hàng từ{' '}
                    {formatMoney(FREE_SHIPPING_THRESHOLD)}.
                  </p>
                </div>
                <div className={`border-b border-slate-100 px-3 py-3 sm:px-4 md:px-5 ${CART_DESKTOP_GRID}`}>
                  <label className="flex cursor-pointer items-center gap-2.5 xl:col-span-3">
                    <input
                      ref={selectAllRef}
                      type="checkbox"
                      checked={allSelected}
                      onChange={toggleSelectAll}
                      className={CART_SELECT_CHECK_CLASS}
                    />
                    <span className="text-sm font-medium text-slate-800">
                      Chọn tất cả ({items.length})
                    </span>
                  </label>
                  <div className="hidden text-right text-[11px] font-medium uppercase tracking-wide text-slate-400 xl:block">
                    Giá thành
                  </div>
                  <div className="hidden text-center text-[11px] font-medium uppercase tracking-wide text-slate-400 xl:block">
                    Số lượng
                  </div>
                  <div className="hidden text-center text-[11px] font-medium uppercase tracking-wide text-slate-400 xl:block">
                    Đơn vị
                  </div>
                  <div className="hidden xl:block" aria-hidden />
                </div>

                <div className="divide-y divide-slate-100">
                  {items.map((item) => {
                    const isSelected = item.selected
                    const lineTotal = item.price * item.qty
                    const unitLabel = item.packaging?.trim() || "Gói"
                    const unitOptions =
                      item.unit_options && item.unit_options.length > 0
                        ? item.unit_options
                        : [{ id: item.product_variant_unit_id ?? 0, unit_name: unitLabel }]
                    const selectedUnitId =
                      pendingUnitChoiceByItemId[item.id] ?? item.product_variant_unit_id ?? unitOptions[0]?.id ?? 0
                    const isUpdatingUnit = Boolean(updatingUnitByItemId[item.id])

                    return (
                      <div key={item.id} className="px-3 py-3 sm:px-4 sm:py-3.5 md:px-5">
                        {/* Mobile + tablet: tick centered to image; price + CTAs on one row */}
                        <div className="flex gap-2.5 sm:gap-3 xl:hidden">
                          <label
                            className="flex h-16 w-5 shrink-0 cursor-pointer items-center justify-center sm:h-[4.25rem]"
                            aria-label={isSelected ? 'Bỏ chọn sản phẩm' : 'Chọn sản phẩm'}
                          >
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => setItemSelected(item.id, !isSelected)}
                              className={CART_SELECT_CHECK_CLASS}
                            />
                          </label>

                          <CartLineThumb src={item.image_url} alt={item.name} size="sm" />

                          <div className="flex min-w-0 flex-1 flex-col gap-2">
                            <div className="flex min-w-0 items-start gap-2">
                              <h3 className="min-w-0 flex-1 border-0 text-sm font-normal leading-snug text-slate-900 line-clamp-2 outline-none">
                                {item.name}
                              </h3>
                              <button
                                type="button"
                                onClick={() => remove(item.id)}
                                className="-mr-1 -mt-1 shrink-0 p-2 text-slate-400 transition-colors hover:text-red-600"
                                aria-label="Xóa sản phẩm"
                              >
                                <TrashIcon />
                              </button>
                            </div>

                            <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-2">
                              <p className="text-base font-bold leading-none text-primary-700">
                                {formatMoney(lineTotal)}
                              </p>
                              <div className="flex flex-wrap items-center justify-end gap-2">
                                <CartQuantityStepper
                                  qty={item.qty}
                                  onDec={() => handleQuantityChange(item.id, item.qty - 1)}
                                  onInc={() => handleQuantityChange(item.id, item.qty + 1)}
                                  disableDec={item.qty <= 1 || isUnitMutating}
                                  disabled={isUnitMutating}
                                />
                                <div className="min-w-[6.25rem] max-w-[8.5rem]">
                                  <CartUnitSelect
                                    value={selectedUnitId}
                                    options={unitOptions}
                                    disabled={unitOptions.length <= 1 || isUnitMutating}
                                    loading={isUpdatingUnit || isUnitMutating}
                                    onChange={(nextUnitId) =>
                                      scheduleUnitChange(item.id, selectedUnitId, nextUnitId)
                                    }
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Desktop — table row (xl+) */}
                        <div className={`hidden gap-3 ${CART_DESKTOP_GRID}`}>
                          <label className="flex h-[4.25rem] cursor-pointer items-center justify-center">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => setItemSelected(item.id, !isSelected)}
                              className={CART_SELECT_CHECK_CLASS}
                            />
                          </label>
                          <CartLineThumb src={item.image_url} alt={item.name} size="md" />
                          <div className="min-w-0 self-center">
                            <h3 className="border-0 text-sm font-normal leading-snug text-slate-900 line-clamp-2 outline-none">
                              {item.name}
                            </h3>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-bold text-primary-700">{formatMoney(lineTotal)}</p>
                            <p className="text-xs text-slate-400">
                              {item.qty} × {formatMoney(item.price)}
                            </p>
                          </div>
                          <div className="flex justify-center">
                            <CartQuantityStepper
                              qty={item.qty}
                              onDec={() => handleQuantityChange(item.id, item.qty - 1)}
                              onInc={() => handleQuantityChange(item.id, item.qty + 1)}
                              disableDec={item.qty <= 1 || isUnitMutating}
                              disabled={isUnitMutating}
                            />
                          </div>
                          <div className="flex justify-center">
                            <CartUnitSelect
                              value={selectedUnitId}
                              options={unitOptions}
                              disabled={unitOptions.length <= 1 || isUnitMutating}
                              loading={isUpdatingUnit || isUnitMutating}
                              onChange={(nextUnitId) => scheduleUnitChange(item.id, selectedUnitId, nextUnitId)}
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => remove(item.id)}
                            className="flex justify-center p-2 text-slate-400 transition-colors hover:text-red-600"
                            aria-label="Xóa sản phẩm"
                          >
                            <TrashIcon />
                          </button>
                        </div>

                      </div>
                    )
                  })}
                </div>

                <div className="flex items-start gap-3 border-t border-primary-100 bg-primary-50 px-3 py-3 sm:px-4 sm:py-3.5 md:px-5">
                  <span className="mt-0.5 shrink-0 text-primary-600" aria-hidden>
                    <PercentInCircleIcon />
                  </span>
                  <p className="text-xs leading-relaxed text-primary-900 sm:text-sm">
                    <span className="font-semibold">Ưu đãi sản phẩm:</span> giảm giá trực tiếp theo chương
                    trình (nếu có) đã được tính trong giá hiển thị và phần &quot;Giảm giá trực tiếp&quot; ở
                    cột phải.
                  </p>
                </div>
              </div>

              {/* Right: summary */}
              <aside className="flex flex-col gap-3 xl:col-start-2 xl:row-start-2 xl:sticky xl:top-24 xl:self-start xl:pb-2">
                <CartReceiptCard>
                  <button
                    type="button"
                    title="Áp dụng ưu đãi để được giảm giá"
                    onClick={() => setOfferModalOpen(true)}
                    className="mb-4 flex w-full min-w-0 items-center justify-between gap-1.5 overflow-hidden rounded-lg border border-primary-100 bg-primary-50 px-3 py-2.5 text-left text-xs font-medium leading-snug text-primary-800 transition-colors hover:bg-primary-100/80 sm:px-4 sm:py-3 sm:text-sm"
                  >
                    <span className="min-w-0 flex-1 truncate">Áp dụng ưu đãi để được giảm giá</span>
                    <ChevronRightIcon className="h-4 w-4 shrink-0 text-primary-600 sm:h-5 sm:w-5" />
                  </button>

                  {selectedCount > 0 && selectedCount < items.length && (
                    <p className="mb-4 text-xs text-slate-500">
                      Bạn đang chọn {selectedCount}/{items.length} dòng để thanh toán. Giảm giá hiển thị theo
                      tỷ lệ tạm tính; số tiền cuối được xác nhận khi đặt hàng.
                    </p>
                  )}

                  <dl className="space-y-2.5 text-sm">
                    <div className="flex justify-between gap-3">
                      <dt className="text-slate-600">Tổng tiền (đã chọn)</dt>
                      <dd className="font-semibold text-slate-900">
                        {formatMoney(selectionTotals.selectedSubtotal)}
                      </dd>
                    </div>
                    <div className="flex justify-between gap-3">
                      <dt className="text-slate-600">Giảm giá trực tiếp</dt>
                      <dd className="font-medium text-orange-600">
                        {directDiscount > 0 ? `-${formatMoney(directDiscount)}` : "0₫"}
                      </dd>
                    </div>
                    <div className="flex items-start justify-between gap-3">
                      <dt className="flex items-center gap-1 text-slate-600">
                        Giảm giá voucher
                        <span
                          className="inline-flex text-slate-400"
                          title="Nhập mã tại bước đặt hàng hoặc trong trang thanh toán."
                        >
                          <InfoIcon />
                        </span>
                      </dt>
                      <dd className="font-medium text-orange-600">
                        {voucherDiscount > 0 ? `-${formatMoney(voucherDiscount)}` : "0₫"}
                      </dd>
                    </div>
                    <div className="flex justify-between gap-3 border-t border-dashed border-slate-200 pt-3">
                      <dt className="font-medium text-slate-700">Tiết kiệm được</dt>
                      <dd className="font-semibold text-orange-600">
                        {hasSavings ? formatMoney(discount) : "0₫"}
                      </dd>
                    </div>
                  </dl>

                  <div className="mt-4 border-t border-slate-200 pt-4">
                    <div className="mb-4 flex items-end justify-between gap-3">
                      <span className="text-base font-bold text-slate-900">Thành tiền</span>
                      <div className="text-right">
                        {hasSavings && (
                          <p className="text-sm text-slate-400 line-through">
                            {formatMoney(selectionTotals.selectedSubtotal)}
                          </p>
                        )}
                        <p className="text-2xl font-bold leading-tight text-primary-700">
                          {formatMoney(selectionTotals.estimatedTotal)}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={goCheckout}
                      className="hidden w-full rounded-full bg-primary-600 py-3 text-center text-base font-semibold text-white shadow-sm transition-colors hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50 xl:block"
                      disabled={selectedCount === 0}
                    >
                      Mua hàng
                    </button>

                    <p className="mt-2.5 text-center text-[11px] leading-snug text-slate-500">
                      Bằng việc tiếp tục, bạn đồng ý với{" "}
                      <Link
                        href="/tai-khoan/quyen-rieng-tu"
                        className="font-medium text-primary-600 underline-offset-2 hover:underline"
                      >
                        Điều khoản dịch vụ
                      </Link>{" "}
                      của chúng tôi.
                    </p>
                  </div>
                </CartReceiptCard>

                <CartPwaInstallBanner />
              </aside>

              {/* Mobile / tablet sticky checkout */}
              <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200/80 bg-white/95 px-4 py-3 shadow-[0_-8px_24px_rgba(15,23,42,0.08)] backdrop-blur xl:hidden">
                <div className="mx-auto flex max-w-7xl items-center gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] text-slate-500">Thành tiền</p>
                    <p className="truncate text-lg font-bold leading-tight text-primary-700">
                      {formatMoney(selectionTotals.estimatedTotal)}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={goCheckout}
                    className="shrink-0 rounded-full bg-primary-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={selectedCount === 0}
                  >
                    Mua hàng{selectedCount > 0 ? ` (${selectedCount})` : ""}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </Container>

      <OfferSheet
        open={offerModalOpen}
        onClose={() => setOfferModalOpen(false)}
        titleId={offerModalTitleId}
        title="Ưu đãi dành cho bạn"
        footer={
          cartVersion != null ? (
            <div className="border-t border-slate-100 p-4">
              <button
                type="button"
                onClick={() => void submitCartVoucher()}
                disabled={applyVoucherMutation.isPending}
                className="w-full rounded-xl bg-primary-600 py-3.5 text-center text-base font-semibold text-white shadow-sm transition-colors hover:bg-primary-700 disabled:opacity-60"
              >
                {applyVoucherMutation.isPending ? "Đang áp dụng…" : "Áp dụng"}
              </button>
            </div>
          ) : undefined
        }
      >
        {cartVersion == null ? (
          <div className="space-y-4 px-5 py-6 text-center text-sm text-slate-600">
            <p>Đang tải giỏ hàng… Vui lòng thử lại sau giây lát.</p>
          </div>
        ) : (
          <SingleVoucherSheetBody
            code={voucherCode}
            onCodeChange={setVoucherCode}
            inputRef={voucherInputRef}
            isApplying={applyVoucherMutation.isPending}
            onSubmit={() => void submitCartVoucher()}
          />
        )}
      </OfferSheet>
    </div>
  )
}

