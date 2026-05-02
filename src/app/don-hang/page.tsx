'use client'

import { useRouter } from 'next/navigation'
import React, { useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useAuth } from '@/contexts/AuthContext'
import { useCheckout } from '@/contexts/CheckoutContext'
import { useCart } from '@/contexts/CartContext'
import { usePaymentMethods } from '@/lib/hooks/usePayment'
import { useShippingMethods } from '@/lib/hooks/useShipping'
import { useShippingMethod } from '@/lib/hooks/useShipping'
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
} from '@/components/checkout'

export default function CheckoutPage() {
  const router = useRouter()
  const { user } = useAuth()
  const {
    information,
    setInformation,
    shippingMethodId,
    setShippingMethodId,
    setSelectedShippingMethod,
    selectedShippingMethod,
    paymentMethodId,
    setPaymentMethodId,
    clear: clearCheckout,
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
  const { data: fallbackShippingMethod } = useShippingMethod(
    selectedShippingMethod == null && (serverShippingMethodId ?? shippingMethodId) != null ? (serverShippingMethodId ?? shippingMethodId ?? 0) : 0
  )
  const checkoutCartMutation = useCheckoutCart()
  const selectShippingMutation = useSelectShippingMethod()
  const applyVoucherMutation = useApplyVoucher()
  const removeVoucherMutation = useRemoveVoucher()
  const hasCompletedOrderRef = useRef(false)

  const paymentMethods = Array.isArray(paymentMethodsData) ? paymentMethodsData.filter((m) => m.active) : []
  const shippingMethods = Array.isArray(shippingMethodsData) ? shippingMethodsData.filter((m) => m.active) : []
  const selectedShippingId = serverShippingMethodId ?? shippingMethodId
  const selectedShippingMethodFromList = shippingMethods.find((m) => m.id === selectedShippingId)
  const normalizedServerShippingFee = Number(cartShippingFee) > 0 ? Number(cartShippingFee) : undefined
  const shippingFee =
    normalizedServerShippingFee ??
    selectedShippingMethod?.price ??
    fallbackShippingMethod?.price ??
    selectedShippingMethodFromList?.price ??
    0
  const orderSubtotal = subtotal ?? total
  const orderTotal = total

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    trigger,
    getValues,
  } = useForm<CheckoutInformationFormData>({
    resolver: yupResolver(checkoutInformationSchema),
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
      email: data.email,
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
        email: formValues.email,
        address: formValues.address,
      })
      const created = await checkoutCartMutation.mutateAsync({
        payment_method_id: paymentMethodId,
        shipping_address: formValues.address,
        notes: undefined,
        expected_version: cartVersion,
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
      return
    }
    if (!payload.order_voucher_code && !payload.shipping_voucher_code) {
      toastError('Vui lòng nhập ít nhất 1 mã giảm giá.')
      return
    }
    try {
      await applyVoucherMutation.mutateAsync({
        expected_version: cartVersion,
        ...payload,
      })
      toastSuccess('Áp dụng mã giảm giá thành công.')
    } catch (error: unknown) {
      toastError(error instanceof Error ? error.message : 'Áp dụng mã giảm giá thất bại.')
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

      <div className="grid gap-6 md:grid-cols-[1fr_minmax(320px,360px)]">
        <div className="space-y-6 min-w-0">
          <CheckoutInfoSection
            register={register}
            errors={errors}
            handleSubmit={handleSubmit}
            onSubmit={onInfoSubmit}
          />
          <CheckoutShippingSection
            methods={shippingMethods}
            selectedId={selectedShippingId}
            onSelect={(id, method) => {
              if (cartVersion == null) {
                toastError('Không thể cập nhật phương thức vận chuyển. Vui lòng thử lại.')
                return
              }
              selectShippingMutation
                .mutateAsync({
                  shipping_method_id: id,
                  expected_version: cartVersion,
                })
                .then(() => {
                  setShippingMethodId(id)
                  setSelectedShippingMethod(method)
                })
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
            isSubmitting={isSubmitting}
            canSubmit={canSubmit}
            onPlaceOrder={handlePlaceOrder}
          />
          <CheckoutVoucherSection
            onApplyVoucher={handleApplyVoucher}
            onRemoveVoucher={handleRemoveVoucher}
            isApplying={applyVoucherMutation.isPending || removeVoucherMutation.isPending}
            orderVoucherCode={orderVoucherCode ?? undefined}
            shippingVoucherCode={shippingVoucherCode ?? undefined}
          />
        </div>

        <div className="w-full min-w-0">
          <CheckoutOrderSummary
            items={items}
            subtotal={orderSubtotal}
            shippingFee={shippingFee}
            total={orderTotal}
            hasShippingSelected={Boolean(selectedShippingMethodFromList ?? selectedShippingMethod)}
            discountAmount={discountAmount}
            shippingDiscountAmount={shippingDiscountAmount}
          />
        </div>
      </div>
    </Container>
  )
}
