import * as Yup from 'yup'
import { REGEX_PHONE_NUMBER, REGEX_ADDRESS } from '../constant'

const regionField = Yup.string()
  .trim()
  .max(120, 'Quá 120 ký tự')
  .transform((v) => (v === '' ? undefined : v))
  .optional()

const selectIdField = (message: string) =>
  Yup.string()
    .trim()
    .required(message)
    .matches(/^\d+$/, message)

export const checkoutInformationSchema = Yup.object().shape({
  name: Yup.string()
    .trim()
    .required('Vui lòng nhập họ tên')
    .min(2, 'Họ tên phải có ít nhất 2 ký tự')
    .max(254, 'Họ tên không được vượt quá 254 ký tự'),
  phone: Yup.string()
    .trim()
    .required('Vui lòng nhập số điện thoại')
    .matches(REGEX_PHONE_NUMBER, 'Số điện thoại không hợp lệ'),
  email: Yup.string()
    .trim()
    .transform((v) => (v === '' ? undefined : v))
    .max(254, 'Email không được vượt quá 254 ký tự')
    .email('Email không hợp lệ')
    .optional(),
  recipient_name: Yup.string()
    .trim()
    .required('Vui lòng nhập họ tên người nhận')
    .min(2, 'Họ tên phải có ít nhất 2 ký tự')
    .max(254, 'Họ tên không được vượt quá 254 ký tự'),
  recipient_phone: Yup.string()
    .trim()
    .required('Vui lòng nhập SĐT người nhận')
    .matches(REGEX_PHONE_NUMBER, 'Số điện thoại không hợp lệ'),
  city_id: selectIdField('Vui lòng chọn Tỉnh/Thành phố'),
  commune_id: selectIdField('Vui lòng chọn Phường/Xã'),
  province: regionField,
  district: regionField,
  ward: regionField,
  address: Yup.string()
    .trim()
    .required('Vui lòng nhập địa chỉ')
    .min(5, 'Địa chỉ phải có ít nhất 5 ký tự')
    .max(500, 'Địa chỉ không được vượt quá 500 ký tự')
    .matches(REGEX_ADDRESS, 'Địa chỉ chứa ký tự không hợp lệ'),
})

export interface CheckoutInformationFormData {
  name: string
  phone: string
  email?: string
  recipient_name: string
  recipient_phone: string
  city_id: string
  commune_id: string
  province?: string
  district?: string
  ward?: string
  address: string
}

/** Structured body for `POST /carts/checkout/` (`delivery`); BE formats `Order.shipping_address`. */
export interface CheckoutDeliveryPayload {
  orderer: { name: string; phone: string; email?: string }
  recipient: { name: string; phone: string }
  address: {
    province?: string
    district?: string
    ward?: string
    detail: string
  }
}

export function buildCheckoutDeliveryPayload(data: CheckoutInformationFormData): CheckoutDeliveryPayload {
  const orderer: CheckoutDeliveryPayload['orderer'] = {
    name: data.name.trim(),
    phone: data.phone.trim(),
  }
  const email = data.email?.trim()
  if (email) orderer.email = email

  const address: CheckoutDeliveryPayload['address'] = {
    detail: data.address.trim(),
  }
  const p = data.province?.trim()
  const d = data.district?.trim()
  const w = data.ward?.trim()
  if (p) address.province = p
  if (d) address.district = d
  if (w) address.ward = w

  return {
    orderer,
    recipient: {
      name: data.recipient_name.trim(),
      phone: data.recipient_phone.trim(),
    },
    address,
  }
}

/** @deprecated Prefer `buildCheckoutDeliveryPayload` + API `delivery` so the server owns canonical formatting. */
export function composeShippingAddressPayload(data: CheckoutInformationFormData): string {
  const lines: string[] = []
  lines.push(`Người nhận: ${data.recipient_name.trim()} — ${data.recipient_phone.trim()}`)
  const admin = [data.province, data.district, data.ward].filter(Boolean).join(', ')
  if (admin) {
    lines.push(`Địa chỉ hành chính sau sáp nhập: ${admin}`)
  }
  lines.push(`Địa chỉ cụ thể: ${data.address.trim()}`)
  return lines.join('\n')
}
