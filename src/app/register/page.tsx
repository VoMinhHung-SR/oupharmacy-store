'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { toastError } from '@/lib/utils/toast'
import { registerSchema, type RegisterFormData } from '@/lib/validations/auth'
import { useRegister } from '@/lib/hooks/useRegister'
import { useLoginModal } from '@/contexts/LoginModalContext'
import UserInfoForm from '@/components/register/UserInfoForm'
import { FormPageSkeleton } from '@/components/skeletons'
import { BackdropLoading } from '@/components/BackdropLoading'

export default function RegisterPage() {
  const router = useRouter()
  const { openModal } = useLoginModal()
  const [loading, setLoading] = useState(false)

  const {
    openBackdrop,
    dob,
    gender,
    selectedImage,
    imageUrl,
    isLoadingUserRole,
    userRoleID,
    onSubmit,
    setDOB,
    setGender,
    setImageUrl,
    setSelectedImage,
  } = useRegister()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    setError,
    trigger,
  } = useForm<RegisterFormData>({
    resolver: yupResolver(registerSchema),
    mode: 'onBlur',
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      dob: '',
      phoneNumber: '',
      gender: 0,
    },
  })

  // Update image preview
  useEffect(() => {
    if (selectedImage) {
      setImageUrl(URL.createObjectURL(selectedImage))
    }
  }, [selectedImage, setImageUrl])

  // Handle form submit
  const onFormSubmit = async (data: RegisterFormData) => {
    setLoading(true)
    try {
      await onSubmit(data, setError)
    } catch (err: any) {
      // Error handling is done in useRegister hook
    } finally {
      setLoading(false)
    }
  }

  const isLoading = loading || openBackdrop || isLoadingUserRole

  if (isLoadingUserRole) {
    return <FormPageSkeleton />
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 py-8 px-4">
      <BackdropLoading isOpen={openBackdrop} loadingText="Đang xử lý..." />

      <div className="text-center">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Đăng ký tài khoản</h1>
        <p className="text-sm text-gray-600">
          Bạn có thể cập nhật địa chỉ sau trong phần tài khoản
        </p>
      </div>

      <form
        className="space-y-6 rounded-lg bg-white p-4 shadow-md sm:p-6"
        onSubmit={handleSubmit(onFormSubmit, (errors) => {
          const firstError = Object.values(errors)[0]
          if (firstError?.message) {
            toastError(firstError.message)
          }
        })}
      >
        <UserInfoForm
          register={register}
          errors={errors}
          setValue={setValue}
          isLoading={isLoading}
          dob={dob}
          gender={gender}
          selectedImage={selectedImage}
          imageUrl={imageUrl}
          onDOBChange={setDOB}
          onGenderChange={setGender}
          onImageChange={setSelectedImage}
        />

        {/* Submit Button */}
        {userRoleID === null || userRoleID === -1 ? (
          <div className="text-center py-5">
            <div className="text-red-700 text-xl">Vui lòng làm mới trang</div>
          </div>
        ) : (
          <div className="flex flex-col-reverse gap-3 border-t pt-6 sm:flex-row sm:items-center sm:justify-between">
            <Link
              href="/"
              className="w-full rounded-lg border border-gray-300 bg-white px-6 py-2.5 text-center text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:w-auto"
            >
              Quay lại
            </Link>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-lg bg-primary-600 px-6 py-2.5 text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors sm:w-auto"
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Đang đăng ký...
                </span>
              ) : (
                'Đăng ký'
              )}
            </button>
          </div>
        )}
      </form>

      <div className="text-center space-y-2">
        <div className="text-sm text-gray-600">
          Đã có tài khoản?{' '}
          <button
            onClick={() => openModal()}
            className="text-primary-700 hover:text-primary-800 hover:underline font-medium"
          >
            Đăng nhập
          </button>
        </div>
      </div>
    </div>
  )
}
