'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useForm, type Resolver } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useAuth } from '@/contexts/AuthContext'
import { saveGuestOrderConfirmation } from '@/lib/utils/guestOrderConfirmation'
import { useCheckout } from '@/contexts/CheckoutContext'
import { useCart } from '@/contexts/CartContext'
import { usePaymentMethods } from '@/lib/hooks/usePayment'
import { useShippingMethods } from '@/lib/hooks/useShipping'
import { useApplyVoucher, useCheckoutCart, useSelectShippingMethod } from '@/lib/hooks/useCarts'
import { toastError, toastSuccess } from '@/lib/utils/toast'
import {
  buildCheckoutDeliveryPayload,
  checkoutInformationSchema,
  type CheckoutInformationFormData,
} from '@/lib/validations/checkout'
import { Container } from '@/components/Container'
import { LoadingBackdrop } from '@/components/LoadingBackdrop'
import { ChevronLeftIcon } from '@/components/icons'
import {
  CheckoutInfoSection,
  CheckoutShippingSection,
  CheckoutPaymentSection,
  CheckoutOrderSummary,
  CheckoutVoucherSection,
  CheckoutProductList,
} from '@/components/checkout'
import { FREE_SHIPPING_THRESHOLD } from '@/lib/constant'
import {
  pickPreferredShippingMethod,
  shouldShowShippingMethodChoice,
} from '@/lib/utils/shippingCheckout'

export default function CheckoutPage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()
  const {
    information,
    setInformation,
    paymentMethodId,
    setPaymentMethodId,
    notes,
    setNotes,
    clear: clearCheckout,
    checkoutScopedLineIds,
    setCheckoutScopedLineIds,
  } = useCheckout()
  const {
    items,
    total,
    subtotal,
    shippingFee: cartShippingFee,
    freeShippingApplied: cartFreeShippingApplied,
    orderVoucherCode,
    shippingVoucherCode,
    discountAmount = 0,
    shippingDiscountAmount = 0,
    version: cartVersion,
    shippingMethodId: serverShippingMethodId,
  } = useCart()
  const { data: paymentMethodsData, isLoading: methodsLoadingPayment, error: methodsErrorPayment } = usePaymentMethods()
  const { data: shippingMethodsData, isLoading: methodsLoadingShipping, error: methodsErrorShipping } = useShippingMethods()
  const checkoutCartMutation = useCheckoutCart()
  const selectShippingMutation = useSelectShippingMethod()
  const applyVoucherMutation = useApplyVoucher()
  const hasCompletedOrderRef = useRef(false)
  const [hideLineDetail, setHideLineDetail] = useState(false)
  const [redirectingToConfirmation, setRedirectingToConfirmation] = useState(false)

  const paymentMethods = Array.isArray(paymentMethodsData) ? paymentMethodsData.filter((m) => m.active) : []
  const shippingMethods = Array.isArray(shippingMethodsData) ? shippingMethodsData.filter((m) => m.active) : []
  const selectedShippingId = serverShippingMethodId ?? null
  const selectedShippingMethodFromList = shippingMethods.find((m) => m.id === selectedShippingId)
  const rawShippingFee = Number(cartShippingFee) || selectedShippingMethodFromList?.price || 0
  const orderSubtotal = subtotal ?? total

  const scopedIdSet = useMemo(() => {
    if (!checkoutScopedLineIds || checkoutScopedLineIds.length === 0) return null
    return new Set(checkoutScopedLineIds)
  }, [checkoutScopedLineIds])

  const hasScopedSubset = useMemo(() => {
    if (!scopedIdSet || scopedIdSet.size === 0 || scopedIdSet.size >= items.length) return false
    const itemIdSet = new Set(items.map((i) => i.id))
    for (const scopedId of Array.from(scopedIdSet)) {
      if (!itemIdSet.has(scopedId)) return false
    }
    return true
  }, [items, scopedIdSet])

  const summaryItems = useMemo(() => {
    if (!hasScopedSubset || !scopedIdSet) return items
    return items.filter((i) => scopedIdSet.has(i.id))
  }, [hasScopedSubset, items, scopedIdSet])

  const productLines = useMemo(
    () =>
      summaryItems.map((i) => ({
        id: i.id,
        name: i.name,
        qty: i.qty,
        price: i.price,
        packaging: i.packaging,
        image_url: i.image_url,
      })),
    [summaryItems]
  )

  const scopedLineSubtotal = useMemo(
    () => summaryItems.reduce((s, i) => s + i.price * i.qty, 0),
    [summaryItems]
  )

  const scopeRatio = useMemo(() => {
    if (!hasScopedSubset || !orderSubtotal) return 1
    return Math.min(1, scopedLineSubtotal / orderSubtotal)
  }, [hasScopedSubset, scopedLineSubtotal, orderSubtotal])

  /** Full cart: BE `free_shipping_applied`. Partial checkout: local subtotal vs FE constant (BE applies on checkout). */
  const qualifiesFreeShipping = hasScopedSubset
    ? scopedLineSubtotal >= FREE_SHIPPING_THRESHOLD
    : Boolean(cartFreeShippingApplied)
  const displayShippingFee = hasScopedSubset
    ? qualifiesFreeShipping
      ? 0
      : rawShippingFee
    : Number(cartShippingFee) || (cartFreeShippingApplied ? 0 : rawShippingFee)

  const showShippingMethodChoice = useMemo(
    () => shouldShowShippingMethodChoice(shippingMethods, qualifiesFreeShipping),
    [shippingMethods, qualifiesFreeShipping]
  )

  const displayOrderDiscount = discountAmount * scopeRatio
  const displayShippingDiscount = shippingDiscountAmount * scopeRatio
  const hasVoucherApplied = Boolean(orderVoucherCode || shippingVoucherCode)
  const displayDirectDiscount = hasVoucherApplied ? 0 : Math.max(0, discountAmount) * scopeRatio
  const orderTotal = Math.max(
    0,
    scopedLineSubtotal - displayOrderDiscount - displayShippingDiscount + displayShippingFee
  )

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    getValues,
    trigger,
  } = useForm<CheckoutInformationFormData>({
    resolver: yupResolver(checkoutInformationSchema) as Resolver<CheckoutInformationFormData>,
    mode: 'onBlur',
    defaultValues: {
      name: information?.name ?? '',
      phone: information?.phone ?? '',
      email: information?.email ?? '',
      recipient_name: information?.recipient_name ?? information?.name ?? '',
      recipient_phone: information?.recipient_phone ?? information?.phone ?? '',
      city_id: information?.city_id != null ? String(information.city_id) : '',
      commune_id: information?.commune_id != null ? String(information.commune_id) : '',
      province: information?.province ?? '',
      district: information?.district ?? '',
      ward: information?.ward ?? '',
      address: information?.address ?? '',
    },
  })

  useEffect(() => {
    if (hasCompletedOrderRef.current) return
    if (items.length === 0) {
      router.replace('/gio-hang')
    }
  }, [items.length, router])

  useEffect(() => {
    if (checkoutScopedLineIds?.length && !hasScopedSubset && checkoutScopedLineIds.length < items.length) {
      toastError('Một số sản phẩm đã chọn không còn trong giỏ. Đang áp dụng lại toàn bộ giỏ.')
      setCheckoutScopedLineIds(null)
    }
  }, [checkoutScopedLineIds, hasScopedSubset, items.length, setCheckoutScopedLineIds])

  useEffect(() => {
    if (information) {
      setValue('name', information.name)
      setValue('phone', information.phone)
      setValue('email', information.email)
      setValue('recipient_name', information.recipient_name ?? information.name)
      setValue('recipient_phone', information.recipient_phone ?? information.phone)
      setValue('city_id', information.city_id != null ? String(information.city_id) : '')
      setValue('commune_id', information.commune_id != null ? String(information.commune_id) : '')
      setValue('province', information.province ?? '')
      setValue('district', information.district ?? '')
      setValue('ward', information.ward ?? '')
      setValue('address', information.address)
    }
  }, [information, setValue])

  useEffect(() => {
    if (!isAuthenticated || information || !user) return
    const name =
      user?.name ||
      [user?.first_name, user?.last_name].filter(Boolean).join(' ').trim() ||
      user?.username ||
      ''
    if (name) {
      setValue('name', name)
      setValue('recipient_name', name)
    }
    if (user?.email) setValue('email', user.email)
    if (user?.phone_number) {
      setValue('phone', user.phone_number)
      setValue('recipient_phone', user.phone_number)
    }
  }, [isAuthenticated, user, information, setValue])

  useEffect(() => {
    if (methodsLoadingShipping || shippingMethods.length === 0 || cartVersion == null) return
    const preferred = pickPreferredShippingMethod(shippingMethods)
    if (!preferred) return

    const shouldAutoSelect =
      qualifiesFreeShipping && !showShippingMethodChoice && selectedShippingId !== preferred.id

    if (shouldAutoSelect) {
      selectShippingMutation
        .mutateAsync({
          shipping_method_id: preferred.id,
          expected_version: cartVersion,
        })
        .catch(() => {})
    }
  }, [
    cartVersion,
    methodsLoadingShipping,
    qualifiesFreeShipping,
    selectedShippingId,
    selectShippingMutation,
    shippingMethods,
    showShippingMethodChoice,
  ])

  const onInfoSubmit = (data: CheckoutInformationFormData) => {
    setInformation({
      name: data.name,
      phone: data.phone,
      email: data.email ?? '',
      address: data.address,
      recipient_name: data.recipient_name,
      recipient_phone: data.recipient_phone,
      city_id: data.city_id ? Number(data.city_id) : undefined,
      commune_id: data.commune_id ? Number(data.commune_id) : undefined,
      province: data.province ?? '',
      district: data.district ?? '',
      ward: data.ward ?? '',
    })
  }

  const handlePlaceOrder = async () => {
    const infoValid = await trigger()
    if (!infoValid) {
      toastError('Vui lòng điền đầy đủ và đúng thông tin khách hàng.')
      return
    }
    if (selectedShippingId == null) {
      toastError('Vui lòng chọn phương thức vận chuyển')
      return
    }
    if (paymentMethodId == null) {
      toastError('Vui lòng chọn phương thức thanh toán')
      return
    }
    if (cartVersion == null) {
      toastError('Không thể xác định phiên bản giỏ hàng. Vui lòng thử lại.')
      return
    }
    const formValues = getValues()

    try {
      hasCompletedOrderRef.current = true
      setInformation({
        name: formValues.name,
        phone: formValues.phone,
        email: formValues.email ?? '',
        address: formValues.address,
        recipient_name: formValues.recipient_name,
        recipient_phone: formValues.recipient_phone,
        city_id: formValues.city_id ? Number(formValues.city_id) : undefined,
        commune_id: formValues.commune_id ? Number(formValues.commune_id) : undefined,
        province: formValues.province ?? '',
        district: formValues.district ?? '',
        ward: formValues.ward ?? '',
      })
      const trimmedNotes = notes.trim()
      const scope =
        hasScopedSubset && checkoutScopedLineIds
          ? checkoutScopedLineIds.map((id) => Number(id))
          : undefined
      const created = await checkoutCartMutation.mutateAsync({
        payment_method_id: paymentMethodId,
        delivery: buildCheckoutDeliveryPayload(formValues),
        notes: trimmedNotes.length > 0 ? trimmedNotes : undefined,
        expected_version: cartVersion,
        ...(scope ? { cart_item_ids: scope } : {}),
      })
      if (!isAuthenticated && created && typeof created === 'object') {
        saveGuestOrderConfirmation(created as Record<string, unknown>)
      }
      clearCheckout()
      const orderNumber = String(created?.order_number || '')
      const orderId = Number(created?.id)
      const query = orderNumber
        ? `order_number=${orderNumber}`
        : Number.isFinite(orderId)
          ? `order_id=${orderId}`
          : ''
      setRedirectingToConfirmation(true)
      router.push(query ? `/don-hang/xac-nhan-don-hang?${query}` : '/don-hang/xac-nhan-don-hang')
    } catch (err: unknown) {
      hasCompletedOrderRef.current = false
      setRedirectingToConfirmation(false)
      const message = err instanceof Error ? err.message : 'Đặt hàng thất bại. Vui lòng thử lại.'
      toastError(message)
    }
  }

  const isSubmitting = checkoutCartMutation.isPending
  const showCheckoutBackdrop = isSubmitting || redirectingToConfirmation
  const checkoutBackdropText = redirectingToConfirmation
    ? 'Đang chuyển đến trang xác nhận đơn hàng…'
    : 'Đang xử lý đặt hàng, vui lòng đợi…'
  const canSubmit =
    !methodsLoadingPayment &&
    !methodsLoadingShipping &&
    paymentMethods.length > 0 &&
    shippingMethods.length > 0 &&
    !isSubmitting

  const handleApplyVoucher = async (payload: { order_voucher_code?: string; shipping_voucher_code?: string }) => {
    if (cartVersion == null) {
      toastError('Không thể áp dụng mã giảm giá. Vui lòng thử lại.')
      throw new Error('Cart version missing')
    }
    if (!payload.order_voucher_code && !payload.shipping_voucher_code) {
      toastError('Vui lòng nhập ít nhất 1 mã giảm giá.')
      throw new Error('No voucher code')
    }
    try {
      await applyVoucherMutation.mutateAsync({
        expected_version: cartVersion,
        ...payload,
      })
      toastSuccess('Áp dụng mã giảm giá thành công.')
    } catch (error: unknown) {
      toastError(error instanceof Error ? error.message : 'Áp dụng mã giảm giá thất bại.')
      throw error
    }
  }

  if (items.length === 0) {
    return null
  }

  return (
    <div className="min-h-[60vh] bg-slate-50/80">
      <LoadingBackdrop
        isOpen={showCheckoutBackdrop}
        loadingText={checkoutBackdropText}
        size="lg"
        zIndex={10000}
      />
      <Container className="py-4">
        <div className="grid grid-cols-1 gap-y-3 lg:grid-cols-[minmax(0,1fr)_min(20rem,32%)] lg:items-start lg:gap-x-8 lg:gap-y-2">
          <div className="lg:col-start-1 lg:row-start-1">
            <Link
              href="/gio-hang"
              className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition-colors hover:text-primary-700"
            >
              <ChevronLeftIcon className="h-5 w-5 shrink-0" />
              Quay lại giỏ hàng
            </Link>
          </div>

          <div className="relative z-0 min-w-0 space-y-4 md:space-y-5 lg:col-start-1 lg:row-start-2">
            <CheckoutProductList
              items={productLines}
              lineSubtotal={scopedLineSubtotal}
              hideProductNames={hideLineDetail}
            />

            <CheckoutInfoSection
              register={register}
              control={control}
              watch={watch}
              setValue={setValue}
              getValues={getValues}
              savedInfo={information}
              errors={errors}
              handleSubmit={handleSubmit}
              onSubmit={onInfoSubmit}
              notes={notes}
              onNotesChange={setNotes}
            />
            <CheckoutShippingSection
              methods={shippingMethods}
              selectedId={selectedShippingId}
              qualifiesFreeShipping={qualifiesFreeShipping}
              onSelect={(id) => {
                if (cartVersion == null) {
                  toastError('Không thể cập nhật phương thức vận chuyển. Vui lòng thử lại.')
                  return
                }
                selectShippingMutation
                  .mutateAsync({
                    shipping_method_id: id,
                    expected_version: cartVersion,
                  })
                  .then(() => {})
                  .catch((error: Error) => {
                    toastError(error.message || 'Chọn phương thức vận chuyển thất bại')
                  })
              }}
              isLoading={methodsLoadingShipping}
              error={methodsErrorShipping}
            />
            <CheckoutPaymentSection
              methods={paymentMethods}
              selectedId={paymentMethodId}
              onSelect={setPaymentMethodId}
              isLoading={methodsLoadingPayment}
              error={methodsErrorPayment}
            />
          </div>

          <aside className="flex min-h-0 min-w-0 flex-col pb-1 lg:col-start-2 lg:row-start-2 lg:sticky lg:top-36 lg:max-h-[calc(100dvh-10rem)] lg:self-start lg:overflow-y-auto lg:overscroll-contain lg:pb-3">
            <div className="relative rounded-xl border border-slate-200/60 bg-white shadow-[0_2px_16px_rgba(15,23,42,0.06)]">
              <div className="p-5 pb-4">
                <CheckoutVoucherSection
                  onApplyVoucher={handleApplyVoucher}
                  isApplying={applyVoucherMutation.isPending}
                />
              </div>
              <div className="flex items-center justify-between gap-3 border-t border-slate-100 px-4 py-3">
                <span className="text-sm text-slate-700">Ẩn thông tin sản phẩm khi giao hàng</span>
                <input
                  type="checkbox"
                  checked={hideLineDetail}
                  onChange={(e) => setHideLineDetail(e.target.checked)}
                  className="h-4 w-4 shrink-0 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                />
              </div>
              <CheckoutOrderSummary
                embedded
                subtotal={scopedLineSubtotal}
                shippingFee={displayShippingFee}
                total={orderTotal}
                hasShippingSelected={
                  Boolean(selectedShippingMethodFromList) ||
                  (qualifiesFreeShipping && shippingMethods.length > 0 && !showShippingMethodChoice)
                }
                qualifiesFreeShipping={qualifiesFreeShipping}
                discountAmount={displayOrderDiscount}
                shippingDiscountAmount={displayShippingDiscount}
                directDiscount={displayDirectDiscount}
                onPlaceOrder={handlePlaceOrder}
                isSubmitting={isSubmitting}
                canSubmit={canSubmit}
              />
              <div
                className="pointer-events-none h-3 w-full bg-slate-50/80"
                style={{
                  backgroundImage:
                    'radial-gradient(circle at 9px 0, transparent 7px, rgb(255 255 255) 7.5px)',
                  backgroundSize: '18px 12px',
                  backgroundRepeat: 'repeat-x',
                  backgroundPosition: 'center top',
                }}
                aria-hidden
              />
            </div>
          </aside>
        </div>
      </Container>
    </div>
  )
}
