"use client"
import React, { useCallback, useEffect, useId, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { useCart } from "@/contexts/CartContext"
import { useAuth } from "@/contexts/AuthContext"
import { useCheckout } from "@/contexts/CheckoutContext"
import { useLoginModal } from "@/contexts/LoginModalContext"
import { Button } from "@/components/Button"
import Link from "next/link"
import Image from "next/image"
import { Container } from "@/components/Container"
import { useApplyVoucher } from "@/lib/hooks/useCarts"
import { toastError, toastSuccess } from "@/lib/utils/toast"
import {
  CartIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  EmptyOfferIllustration,
  ImagePlaceholderIcon,
  InfoIcon,
  MinusIcon,
  PercentInCircleIcon,
  PlusIcon,
  TrashIcon,
} from "@/components/icons"
import { OfferSheet } from "@/components/sheets"
import { FREE_SHIPPING_THRESHOLD } from "@/lib/constant"

function formatMoney(n: number) {
  return `${Math.round(n).toLocaleString("vi-VN")}₫`
}

export default function CartPage() {
  const router = useRouter()
  const { isAuthenticated } = useAuth()
  const { openModal: openLoginModal } = useLoginModal()
  const { setCheckoutScopedLineIds } = useCheckout()
  const applyVoucherMutation = useApplyVoucher()
  const {
    items,
    remove,
    clear,
    updateQuantity,
    updateItemUnit,
    discountAmount = 0,
    orderVoucherCode,
    version: cartVersion,
    setItemSelected,
    setAllItemsSelected,
    selectionTotals,
  } = useCart()
  const [offerModalOpen, setOfferModalOpen] = useState(false)
  const [voucherCode, setVoucherCode] = useState("")
  const [updatingUnitByItemId, setUpdatingUnitByItemId] = useState<Record<string, boolean>>({})
  const [pendingUnitChoiceByItemId, setPendingUnitChoiceByItemId] = useState<Record<string, number>>({})
  const unitChangeTimersRef = useRef<Record<string, ReturnType<typeof window.setTimeout>>>({})
  const voucherInputRef = useRef<HTMLInputElement>(null)
  const selectAllRef = useRef<HTMLInputElement>(null)
  const offerModalTitleId = useId()

  const selectedCount = selectionTotals.selectedCount
  const allSelected = items.length > 0 && selectedCount === items.length
  const someSelected = selectedCount > 0 && !allSelected

  useEffect(() => {
    const el = selectAllRef.current
    if (el) el.indeterminate = someSelected
  }, [someSelected])

  const ratio = selectionTotals.selectionRatio
  const discount = Math.max(0, discountAmount) * ratio
  const directDiscount = orderVoucherCode ? 0 : discount
  const voucherDiscount = orderVoucherCode ? discount : 0
  const hasSavings = discount > 0

  const goCheckout = () => {
    const chosen = items.filter((i) => i.selected)
    if (chosen.length === 0) {
      toastError("Vui lòng chọn ít nhất một sản phẩm để thanh toán.")
      return
    }
    if (isAuthenticated && chosen.length < items.length) {
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
    if (newQty < 1) return
    updateQuantity(id, newQty)
  }

  const handleUnitChange = useCallback(
    async (id: string, nextUnitId: number) => {
      if (!Number.isFinite(nextUnitId) || nextUnitId <= 0) return
      setUpdatingUnitByItemId((prev) => ({ ...prev, [id]: true }))
      try {
        await updateItemUnit(id, nextUnitId)
      } catch (e: unknown) {
        toastError(e instanceof Error ? e.message : "Không thể đổi đơn vị đóng gói.")
      } finally {
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
      setPendingUnitChoiceByItemId((prev) => ({ ...prev, [id]: nextUnitId }))
      const existingTimer = unitChangeTimersRef.current[id]
      if (existingTimer) {
        window.clearTimeout(existingTimer)
      }
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
    if (!offerModalOpen || !isAuthenticated) return
    const t = window.setTimeout(() => voucherInputRef.current?.focus(), 50)
    return () => window.clearTimeout(t)
  }, [offerModalOpen, isAuthenticated])

  return (
    <div className="min-h-[60vh] bg-slate-50/80">
      <Container className="py-6 md:py-8">
        <div className="space-y-5 md:space-y-6">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition-colors hover:text-primary-700"
            >
              <ChevronLeftIcon className="h-5 w-5 shrink-0" />
              Tiếp tục mua sắm
            </Link>
          </div>

          {items.length === 0 ? (
            <div className="rounded-xl border border-slate-200/80 bg-white p-12 text-center shadow-sm">
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
          ) : (
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_min(20rem,32%)] lg:items-start lg:gap-8">
              {/* Left: single card — banner + toolbar + lines */}
              <div className="overflow-hidden rounded-xl border border-slate-200/60 bg-white shadow-[0_2px_16px_rgba(15,23,42,0.06)]">
                <div className="border-b border-primary-100/80 bg-primary-50 px-4 py-3 md:px-5">
                  <p className="text-sm text-primary-900">
                    <span className="font-semibold">Miễn phí vận chuyển</span> đối với đơn hàng trên 
                    { formatMoney(FREE_SHIPPING_THRESHOLD)}
                  </p>
                </div>

                <div className="border-b border-slate-100 px-4 py-3 md:px-5 lg:grid lg:grid-cols-[2rem_5.5rem_minmax(0,1fr)_7.5rem_9.5rem_6.5rem_2.25rem] lg:items-center lg:gap-4">
                  <label className="flex cursor-pointer items-center gap-2 lg:col-span-3">
                    <input
                      ref={selectAllRef}
                      type="checkbox"
                      checked={allSelected}
                      onChange={toggleSelectAll}
                      className="h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm font-medium text-slate-800">
                      Chọn tất cả ({items.length})
                    </span>
                  </label>
                  <div className="hidden text-xs font-medium uppercase tracking-wide text-slate-400 lg:col-span-3 lg:grid lg:grid-cols-[7.5rem_9.5rem_6.5rem] lg:justify-items-end lg:text-[11px]">
                    <span>Giá thành</span>
                    <span className="justify-self-center">Số lượng</span>
                    <span className="justify-self-end">Đơn vị</span>
                  </div>
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
                      <div key={item.id} className="px-4 py-4 md:px-5">
                        {/* Mobile */}
                        <div className="grid grid-cols-[auto_auto_1fr] gap-x-3 gap-y-2 lg:hidden">
                          <label className="flex items-start pt-1">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => setItemSelected(item.id, !isSelected)}
                              className="mt-0.5 h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                            />
                          </label>
                          <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                            {item.image_url ? (
                              <Image
                                src={item.image_url}
                                alt={item.name}
                                width={80}
                                height={80}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-slate-400">
                                <ImagePlaceholderIcon className="h-8 w-8" />
                              </div>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() => remove(item.id)}
                            className="justify-self-end p-2 text-slate-400 transition-colors hover:text-red-600"
                            aria-label="Xóa sản phẩm"
                          >
                            <TrashIcon />
                          </button>
                          <h3 className="col-span-3 text-sm font-semibold leading-snug text-slate-900 line-clamp-2">
                            {item.name}
                          </h3>
                          <div className="col-span-3 flex flex-wrap items-center gap-3">
                            <span className="text-base font-bold text-primary-700">
                              {formatMoney(lineTotal)}
                            </span>
                            <QuantityStepper
                              qty={item.qty}
                              onDec={() => handleQuantityChange(item.id, item.qty - 1)}
                              onInc={() => handleQuantityChange(item.id, item.qty + 1)}
                              disableDec={item.qty <= 1}
                            />
                            <UnitSelect
                              value={selectedUnitId}
                              options={unitOptions}
                              disabled={isUpdatingUnit || unitOptions.length <= 1}
                              onChange={(nextUnitId) => scheduleUnitChange(item.id, selectedUnitId, nextUnitId)}
                            />
                          </div>
                        </div>

                        {/* Desktop — table row */}
                        <div className="hidden gap-3 lg:grid lg:grid-cols-[2rem_5.5rem_minmax(0,1fr)_7.5rem_9.5rem_6.5rem_2.25rem] lg:items-center lg:gap-4">
                          <label className="flex cursor-pointer items-center justify-center">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => setItemSelected(item.id, !isSelected)}
                              className="h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                            />
                          </label>
                          <div className="h-[4.5rem] w-[4.5rem] shrink-0 overflow-hidden rounded-lg bg-slate-100">
                            {item.image_url ? (
                              <Image
                                src={item.image_url}
                                alt={item.name}
                                width={72}
                                height={72}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-slate-400">
                                <ImagePlaceholderIcon className="h-7 w-7" />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0 self-center">
                            <h3 className="text-sm font-semibold leading-snug text-slate-900 line-clamp-2">
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
                            <QuantityStepper
                              qty={item.qty}
                              onDec={() => handleQuantityChange(item.id, item.qty - 1)}
                              onInc={() => handleQuantityChange(item.id, item.qty + 1)}
                              disableDec={item.qty <= 1}
                            />
                          </div>
                          <div className="flex justify-end">
                            <UnitSelect
                              value={selectedUnitId}
                              options={unitOptions}
                              disabled={isUpdatingUnit || unitOptions.length <= 1}
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

                <div className="flex items-start gap-3 border-t border-primary-100 bg-primary-50 px-4 py-3.5 md:px-5">
                  <span className="mt-0.5 shrink-0 text-primary-600" aria-hidden>
                    <PercentInCircleIcon />
                  </span>
                  <p className="text-sm leading-relaxed text-primary-900">
                    <span className="font-semibold">Ưu đãi sản phẩm:</span> giảm giá trực tiếp theo chương
                    trình (nếu có) đã được tính trong giá hiển thị và phần &quot;Giảm giá trực tiếp&quot; ở
                    cột phải.
                  </p>
                </div>
              </div>

              {/* Right: summary */}
              <aside className="flex flex-col gap-4 lg:sticky lg:top-24">
                <div className="relative overflow-hidden rounded-xl border border-slate-200/60 bg-white shadow-[0_2px_16px_rgba(15,23,42,0.06)]">
                  <div className="p-5 pb-6">
                    <button
                      type="button"
                      onClick={() => setOfferModalOpen(true)}
                      className="mb-5 flex w-full items-center justify-between gap-2 rounded-lg border border-primary-100 bg-primary-50 px-4 py-3 text-left text-sm font-medium text-primary-800 transition-colors hover:bg-primary-100/80"
                    >
                      <span>Áp dụng ưu đãi để được giảm giá</span>
                      <ChevronRightIcon className="h-5 w-5 shrink-0 text-primary-600" />
                    </button>

                    {isAuthenticated && selectedCount > 0 && selectedCount < items.length && (
                      <p className="mb-4 text-xs text-slate-500">
                        Bạn đang chọn {selectedCount}/{items.length} dòng. Giảm giá đơn hàng hiển thị theo tỷ
                        lệ tạm tính; số tiền cuối được xác nhận khi đặt hàng.
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

                    <div className="mt-5 border-t border-slate-200 pt-5">
                      <div className="mb-5 flex items-end justify-between gap-3">
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

                      <div className="space-y-3">
                        <button
                          type="button"
                          onClick={goCheckout}
                          className="block w-full rounded-xl bg-primary-600 py-3.5 text-center text-base font-semibold text-white shadow-sm transition-colors hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50"
                          disabled={selectedCount === 0}
                        >
                          Mua hàng
                        </button>
                      </div>

                      <p className="mt-4 text-center text-[11px] leading-relaxed text-slate-500">
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
                  </div>

                  {/* Decorative “ticket” edge */}
                  <div
                    className="pointer-events-none h-3 w-full bg-slate-50/80"
                    style={{
                      backgroundImage:
                        "radial-gradient(circle at 9px 0, transparent 7px, rgb(255 255 255) 7.5px)",
                      backgroundSize: "18px 12px",
                      backgroundRepeat: "repeat-x",
                      backgroundPosition: "center top",
                    }}
                    aria-hidden
                  />
                </div>

                <div className="rounded-xl border border-slate-200/60 bg-white p-4 shadow-sm">
                  <p className="text-center text-sm font-semibold text-slate-800">Mua trên app</p>
                  <p className="mt-1 text-center text-xs leading-relaxed text-slate-500">
                    Theo dõi đơn hàng và nhận thông báo ưu đãi nhanh hơn.
                  </p>
                  <div className="mt-3 flex justify-center rounded-lg border border-dashed border-slate-200 bg-slate-50 py-6 text-xs text-slate-400">
                    QR tải app (sắp có)
                  </div>
                </div>
              </aside>
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
          isAuthenticated ? (
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
        {!isAuthenticated ? (
          <div className="space-y-4 px-5 py-6 text-center text-sm text-slate-600">
            <p>
              Mã giảm giá áp dụng cho giỏ hàng đồng bộ trên tài khoản. Vui lòng đăng nhập, hoặc tiếp tục thanh
              toán để nhập mã ở bước đặt hàng.
            </p>
            <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
              <Button
                type="button"
                className="w-full sm:w-auto"
                onClick={() => {
                  setOfferModalOpen(false)
                  openLoginModal("/gio-hang")
                }}
              >
                Đăng nhập
              </Button>
              <Link
                href="/don-hang"
                onClick={() => setOfferModalOpen(false)}
                className="inline-flex w-full items-center justify-center rounded-lg border border-primary-600 px-4 py-2 text-base font-semibold text-primary-600 transition-colors hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 sm:w-auto"
              >
                Thanh toán
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-4 overflow-y-auto px-5 py-4">
            <div className="flex overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm focus-within:border-primary-300 focus-within:ring-2 focus-within:ring-primary-100">
              <input
                ref={voucherInputRef}
                value={voucherCode}
                onChange={(e) => setVoucherCode(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") void submitCartVoucher()
                }}
                placeholder="Nhập mã giảm giá"
                className="min-w-0 flex-1 border-0 bg-transparent px-4 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400"
                autoComplete="off"
              />
              <button
                type="button"
                onClick={() => void submitCartVoucher()}
                disabled={applyVoucherMutation.isPending}
                className="shrink-0 border-l border-slate-200 bg-primary-50 px-4 text-sm font-semibold text-primary-800 transition-colors hover:bg-primary-100 disabled:opacity-50"
              >
                Xác nhận
              </button>
            </div>

            <div className="flex flex-col items-center rounded-xl bg-slate-50 py-8 text-center">
              <EmptyOfferIllustration className="mb-4 h-24 w-24 text-slate-300" />
              <p className="max-w-[16rem] text-sm text-slate-500">Nhập mã giảm giá để được áp dụng những ưu đãi</p>
            </div>
          </div>
        )}
      </OfferSheet>
    </div>
  )
}

function QuantityStepper(props: {
  qty: number
  onDec: () => void
  onInc: () => void
  disableDec: boolean
}) {
  const { qty, onDec, onInc, disableDec } = props
  return (
    <div className="inline-flex items-center overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <button
        type="button"
        onClick={onDec}
        disabled={disableDec}
        className="px-2.5 py-2 text-slate-600 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
        aria-label="Giảm số lượng"
      >
        <MinusIcon />
      </button>
      <span className="min-w-[2.25rem] select-none px-1 py-2 text-center text-sm font-semibold text-slate-800">
        {qty}
      </span>
      <button
        type="button"
        onClick={onInc}
        className="px-2.5 py-2 text-slate-600 transition-colors hover:bg-slate-50"
        aria-label="Tăng số lượng"
      >
        <PlusIcon />
      </button>
    </div>
  )
}

function UnitSelect(props: {
  value: number
  options: { id: number; unit_name: string }[]
  disabled?: boolean
  onChange: (nextUnitId: number) => void
}) {
  const { value, options, disabled = false, onChange } = props
  return (
    <div className="relative">
      <select
        disabled={disabled}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label="Đơn vị"
        className="w-full min-w-[5.5rem] appearance-none rounded-lg border border-slate-200 bg-white py-2 pl-3 pr-8 text-sm font-medium text-slate-700 shadow-sm disabled:cursor-not-allowed disabled:opacity-60"
      >
        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.unit_name}
          </option>
        ))}
      </select>
      <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400">
        <ChevronDownIcon className="h-3 w-3" size={12} />
      </span>
    </div>
  )
}

