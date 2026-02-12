'use client'

import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useAuth } from '@/contexts/AuthContext'
import { useCheckout } from '@/contexts/CheckoutContext'
import { useCart } from '@/contexts/CartContext'
import { usePaymentMethods } from '@/lib/hooks/usePayment'
import { useShippingMethods } from '@/lib/hooks/useShipping'
import { useShippingMethod } from '@/lib/hooks/useShipping'
import { useCreateOrder } from '@/lib/hooks/useOrders'
import type { Order } from '@/lib/services/orders'
import { toastError } from '@/lib/utils/toast'
import { checkoutInformationSchema, type CheckoutInformationFormData } from '@/lib/validations/checkout'
import Breadcrumb from '@/components/Breadcrumb'
import { Container } from '@/components/Container'
import {
  CheckoutInfoSection,
  CheckoutShippingSection,
  CheckoutPaymentSection,
  CheckoutOrderSummary,
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
  const { items, total, clear: clearCart } = useCart()
  const { data: paymentMethodsData, isLoading: methodsLoadingPayment, error: methodsErrorPayment } = usePaymentMethods()
  const { data: shippingMethodsData, isLoading: methodsLoadingShipping, error: methodsErrorShipping } = useShippingMethods()
  const { data: fallbackShippingMethod } = useShippingMethod(
    selectedShippingMethod == null && shippingMethodId != null ? shippingMethodId : 0
  )
  const createOrderMutation = useCreateOrder()

  const paymentMethods = Array.isArray(paymentMethodsData) ? paymentMethodsData.filter((m) => m.active) : []
  const shippingMethods = Array.isArray(shippingMethodsData) ? shippingMethodsData.filter((m) => m.active) : []
  const selectedShippingMethodFromList = shippingMethods.find((m) => m.id === shippingMethodId)
  const shippingFee =
    selectedShippingMethod?.price ??
    fallbackShippingMethod?.price ??
    selectedShippingMethodFromList?.price ??
    0
  const orderTotal = total + shippingFee

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
    if (shippingMethodId == null) {
      toastError('Vui lòng chọn phương thức vận chuyển')
      return
    }
    if (paymentMethodId == null) {
      toastError('Vui lòng chọn phương thức thanh toán')
      return
    }
    const method = shippingMethods.find((m) => m.id === shippingMethodId)
    const fee = method?.price ?? selectedShippingMethod?.price ?? fallbackShippingMethod?.price ?? 0
    const formValues = getValues()

    const payload: Order = {
      items: items.map((i) => ({
        medicine_unit_id: i.medicine_unit_id,
        quantity: i.qty,
        price: i.price,
      })),
      subtotal: total,
      shipping_fee: fee,
      total: total + fee,
      shipping_method: shippingMethodId,
      payment_method: paymentMethodId,
      shipping_address: formValues.address,
      status: 'PENDING',
    }

    try {
      setInformation({
        name: formValues.name,
        phone: formValues.phone,
        email: formValues.email,
        address: formValues.address,
      })
      const created = await createOrderMutation.mutateAsync(payload)
      const orderId = created?.id
      clearCart()
      clearCheckout()
      router.push(
        orderId != null ? `/don-hang/xac-nhan-don-hang?order_id=${orderId}` : '/don-hang/xac-nhan-don-hang'
      )
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Đặt hàng thất bại. Vui lòng thử lại.'
      toastError(message)
    }
  }

  const isSubmitting = createOrderMutation.isPending
  const canSubmit =
    !methodsLoadingPayment &&
    !methodsLoadingShipping &&
    paymentMethods.length > 0 &&
    shippingMethods.length > 0 &&
    !isSubmitting

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
            selectedId={shippingMethodId}
            onSelect={(id, method) => {
              setShippingMethodId(id)
              setSelectedShippingMethod(method)
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
        </div>

        <div className="w-full min-w-0">
          <CheckoutOrderSummary
            items={items}
            subtotal={total}
            shippingFee={shippingFee}
            total={orderTotal}
            hasShippingSelected={Boolean(selectedShippingMethodFromList ?? selectedShippingMethod)}
          />
        </div>
      </div>
    </Container>
  )
}
