import * as Yup from 'yup'

export const loginSchema = Yup.object().shape({
  email: Yup.string()
    .trim()
    .required('Vui lòng nhập email')
    .email('Email không hợp lệ')
    .max(254, 'Email không được vượt quá 254 ký tự'),
  password: Yup.string()
    .required('Vui lòng nhập mật khẩu')
    .min(1, 'Mật khẩu không được để trống'),
})

export const registerSchema = Yup.object().shape({
  name: Yup.string()
    .trim()
    .required('Vui lòng nhập họ tên')
    .min(2, 'Họ tên phải có ít nhất 2 ký tự')
    .max(254, 'Họ tên không được vượt quá 254 ký tự'),
  email: Yup.string()
    .trim()
    .required('Vui lòng nhập email')
    .email('Email không hợp lệ')
    .max(254, 'Email không được vượt quá 254 ký tự'),
  password: Yup.string()
    .required('Vui lòng nhập mật khẩu')
    .min(8, 'Mật khẩu phải có ít nhất 8 ký tự')
    .max(128, 'Mật khẩu không được vượt quá 128 ký tự'),
  confirmPassword: Yup.string()
    .required('Vui lòng xác nhận mật khẩu')
    .oneOf([Yup.ref('password')], 'Mật khẩu xác nhận không khớp'),
})

export type LoginFormData = Yup.InferType<typeof loginSchema>
export type RegisterFormData = Yup.InferType<typeof registerSchema>

