import * as Yup from 'yup'
import { REGEX_PHONE_NUMBER, REGEX_ADDRESS } from '../constant'

const regionField = Yup.string()
  .trim()
  .max(120, 'Quá 120 ký tự')
  .transform((v) => (v === '' ? undefined : v))
  .optional()

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
  province?: string
  district?: string
  ward?: string
  address: string
}

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
