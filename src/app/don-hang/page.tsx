'use client'

import { useRouter } from 'next/navigation'
import React, { useEffect, useMemo, useRef } from 'react'
import { useForm, type Resolver } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useAuth } from '@/contexts/AuthContext'
import { useCheckout } from '@/contexts/CheckoutContext'
import { useCart } from '@/contexts/CartContext'
import { usePaymentMethods } from '@/lib/hooks/usePayment'
import { useShippingMethods } from '@/lib/hooks/useShipping'
import { useApplyVoucher, useCheckoutCart, useRemoveVoucher, useSelectShippingMethod } from '@/lib/hooks/useCarts'
import { toastError, toastSuccess } from '@/lib/utils/toast'
import { checkoutInformationSchema, type CheckoutInformationFormData } from '@/lib/validations/checkout'
import Breadcrumb from '@/components/Breadcrumb'
import { Container } from '@/components/Container'
import {
  CheckoutInfoSection,
  CheckoutShippingSection,
  CheckoutPaymentSection,
  CheckoutOrderSummary,
  CheckoutVoucherSection,
  CheckoutNotesSection,
} from '@/components/checkout'

export default function CheckoutPage() {
  const router = useRouter()
  const { user } = useAuth()
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
    discountAmount = 0,
    shippingDiscountAmount = 0,
    orderVoucherCode,
    shippingVoucherCode,
    version: cartVersion,
    shippingMethodId: serverShippingMethodId,
  } = useCart()
  const { data: paymentMethodsData, isLoading: methodsLoadingPayment, error: methodsErrorPayment } = usePaymentMethods()
  const { data: shippingMethodsData, isLoading: methodsLoadingShipping, error: methodsErrorShipping } = useShippingMethods()
  const checkoutCartMutation = useCheckoutCart()
  const selectShippingMutation = useSelectShippingMethod()
  const applyVoucherMutation = useApplyVoucher()
  const removeVoucherMutation = useRemoveVoucher()
  const hasCompletedOrderRef = useRef(false)

  const paymentMethods = Array.isArray(paymentMethodsData) ? paymentMethodsData.filter((m) => m.active) : []
  const shippingMethods = Array.isArray(shippingMethodsData) ? shippingMethodsData.filter((m) => m.active) : []
  const selectedShippingId = serverShippingMethodId ?? null
  const selectedShippingMethodFromList = shippingMethods.find((m) => m.id === selectedShippingId)
  const shippingFee = Number(cartShippingFee) || selectedShippingMethodFromList?.price || 0
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

  const scopedLineSubtotal = useMemo(
    () => summaryItems.reduce((s, i) => s + i.price * i.qty, 0),
    [summaryItems]
  )

  const scopeRatio = useMemo(() => {
    if (!hasScopedSubset || !orderSubtotal) return 1
    return Math.min(1, scopedLineSubtotal / orderSubtotal)
  }, [hasScopedSubset, scopedLineSubtotal, orderSubtotal])

  const displayOrderDiscount = discountAmount * scopeRatio
  const displayShippingDiscount = shippingDiscountAmount * scopeRatio
  const orderTotal = Math.max(
    0,
    scopedLineSubtotal - displayOrderDiscount - displayShippingDiscount + shippingFee
  )

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    trigger,
    getValues,
  } = useForm<CheckoutInformationFormData>({
    resolver: yupResolver(checkoutInformationSchema) as Resolver<CheckoutInformationFormData>,
    mode: 'onBlur',
    defaultValues: {
      name: information?.name ?? '',
      phone: information?.phone ?? '',
      email: information?.email ?? '',
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
      setValue('address', information.address)
    }
  }, [information, setValue])

  useEffect(() => {
    if (information || !user) return
    const name =
      user?.name ||
      [user?.first_name, user?.last_name].filter(Boolean).join(' ').trim() ||
      user?.username ||
      ''
    if (name) setValue('name', name)
    if (user?.email) setValue('email', user.email)
    if (user?.phone_number) setValue('phone', user.phone_number)
  }, [user, information, setValue])

  const onInfoSubmit = (data: CheckoutInformationFormData) => {
      setInformation({
        name: data.name,
        phone: data.phone,
        email: data.email ?? '',
        address: data.address,
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
      })
      const trimmedNotes = notes.trim()
      const scope =
        hasScopedSubset && checkoutScopedLineIds
          ? checkoutScopedLineIds.map((id) => Number(id))
          : undefined
      const created = await checkoutCartMutation.mutateAsync({
        payment_method_id: paymentMethodId,
        shipping_address: formValues.address,
        notes: trimmedNotes.length > 0 ? trimmedNotes : undefined,
        expected_version: cartVersion,
        ...(scope ? { cart_item_ids: scope } : {}),
      })
      toastSuccess('Đặt hàng thành công! Đang chuyển đến trang xác nhận đơn hàng.')
      clearCheckout()
      const orderNumber = String(created?.order_number || '')
      const orderId = Number(created?.id)
      const query = orderNumber
        ? `order_number=${orderNumber}`
        : Number.isFinite(orderId)
          ? `order_id=${orderId}`
          : ''
      router.push(query ? `/don-hang/xac-nhan-don-hang?${query}` : '/don-hang/xac-nhan-don-hang')
    } catch (err: unknown) {
      hasCompletedOrderRef.current = false
      const message = err instanceof Error ? err.message : 'Đặt hàng thất bại. Vui lòng thử lại.'
      toastError(message)
    }
  }

  const isSubmitting = checkoutCartMutation.isPending
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

  const handleRemoveVoucher = async (target: 'order' | 'shipping' | 'all') => {
    if (cartVersion == null) {
      toastError('Không thể gỡ mã giảm giá. Vui lòng thử lại.')
      return
    }
    try {
      await removeVoucherMutation.mutateAsync({
        target,
        expected_version: cartVersion,
      })
      toastSuccess('Đã gỡ mã giảm giá.')
    } catch (error: unknown) {
      toastError(error instanceof Error ? error.message : 'Gỡ mã giảm giá thất bại.')
    }
  }

  if (items.length === 0) {
    return null
  }

  return (
    <Container className="space-y-6 py-8">
      <Breadcrumb
        items={[
          { label: 'Trang chủ', href: '/' },
          { label: 'Giỏ hàng', href: '/gio-hang' },
          { label: 'Thanh toán' },
        ]}
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(300px,380px)] lg:items-start">
        <div className="min-w-0 space-y-6">
          <CheckoutInfoSection
            register={register}
            errors={errors}
            handleSubmit={handleSubmit}
            onSubmit={onInfoSubmit}
          />
          <CheckoutNotesSection value={notes} onChange={setNotes} />
          <CheckoutShippingSection
            methods={shippingMethods}
            selectedId={selectedShippingId}
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

        <aside className="flex min-h-0 min-w-0 flex-col gap-4 lg:sticky lg:top-20 lg:max-h-[calc(100dvh-5rem)] lg:self-start lg:overflow-y-auto lg:overscroll-contain lg:pr-1 lg:pb-2">
          <CheckoutVoucherSection
            onApplyVoucher={handleApplyVoucher}
            onRemoveVoucher={handleRemoveVoucher}
            isApplying={applyVoucherMutation.isPending || removeVoucherMutation.isPending}
            orderVoucherCode={orderVoucherCode ?? undefined}
            shippingVoucherCode={shippingVoucherCode ?? undefined}
          />
          <CheckoutOrderSummary
            items={summaryItems}
            subtotal={scopedLineSubtotal}
            shippingFee={shippingFee}
            total={orderTotal}
            hasShippingSelected={Boolean(selectedShippingMethodFromList)}
            discountAmount={displayOrderDiscount}
            shippingDiscountAmount={displayShippingDiscount}
            onPlaceOrder={handlePlaceOrder}
            isSubmitting={isSubmitting}
            canSubmit={canSubmit}
          />
        </aside>
      </div>
    </Container>
  )
}
