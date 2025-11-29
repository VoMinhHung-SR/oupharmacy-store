import * as Yup from 'yup'
import {
  REGEX_EMAIL,
  REGEX_NAME,
  REGEX_PHONE_NUMBER,
  REGEX_ADDRESS,
  REGEX_STRONG_PASSWORD,
} from '../constant'

export const loginSchema = Yup.object().shape({
  email: Yup.string()
    .trim()
    .required('Vui lòng nhập email')
    .email('Email không hợp lệ')
    .max(254, 'Email không được vượt quá 254 ký tự')
    .matches(REGEX_EMAIL, 'Email không hợp lệ'),
  password: Yup.string()
    .required('Vui lòng nhập mật khẩu')
    .min(1, 'Mật khẩu không được để trống'),
})

export const registerSchema = Yup.object().shape({
  firstName: Yup.string()
    .trim()
    .required('Vui lòng nhập họ')
    .max(254, 'Họ không được vượt quá 254 ký tự')
    .matches(REGEX_NAME, 'Họ chỉ được chứa chữ cái và khoảng trắng'),
  lastName: Yup.string()
    .trim()
    .required('Vui lòng nhập tên')
    .max(254, 'Tên không được vượt quá 254 ký tự')
    .matches(REGEX_NAME, 'Tên chỉ được chứa chữ cái và khoảng trắng'),
  email: Yup.string()
    .trim()
    .required('Vui lòng nhập email')
    .max(254, 'Email không được vượt quá 254 ký tự')
    .matches(REGEX_EMAIL, 'Email không hợp lệ'),
  password: Yup.string()
    .trim()
    .required('Vui lòng nhập mật khẩu')
    .matches(REGEX_STRONG_PASSWORD, 'Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt')
    .max(128, 'Mật khẩu không được vượt quá 128 ký tự'),
  confirmPassword: Yup.string()
    .trim()
    .required('Vui lòng xác nhận mật khẩu')
    .oneOf([Yup.ref('password')], 'Mật khẩu xác nhận không khớp'),
  phoneNumber: Yup.string()
    .trim()
    .required('Vui lòng nhập số điện thoại')
    .matches(REGEX_PHONE_NUMBER, 'Số điện thoại không hợp lệ'),
  dob: Yup.string().trim().nullable(),
  gender: Yup.number().min(0).max(2).default(0),
})

export type LoginFormData = Yup.InferType<typeof loginSchema>
export type RegisterFormData = Yup.InferType<typeof registerSchema>

