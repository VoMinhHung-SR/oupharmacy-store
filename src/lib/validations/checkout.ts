import * as Yup from 'yup'
import { REGEX_PHONE_NUMBER, REGEX_ADDRESS } from '../constant'

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
  address: string
}

