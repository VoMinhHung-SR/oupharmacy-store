import * as Yup from 'yup'
import { REGEX_PHONE_NUMBER } from '../constant'

export type MedicineRequestFormData = {
  fullName: string
  phone: string
  note: string
}

export const medicineRequestSchema = Yup.object({
  fullName: Yup.string()
    .trim()
    .required('Vui lòng nhập họ tên')
    .min(2, 'Họ tên phải có ít nhất 2 ký tự')
    .max(120, 'Họ tên không được vượt quá 120 ký tự'),
  phone: Yup.string()
    .trim()
    .required('Vui lòng nhập số điện thoại')
    .matches(REGEX_PHONE_NUMBER, 'Số điện thoại không hợp lệ'),
  note: Yup.string().trim().max(2000, 'Ghi chú không được vượt quá 2000 ký tự').default(''),
})
