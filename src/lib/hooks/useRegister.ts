import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { register as registerApi } from '../services/auth'
import { toastSuccess, toastError } from '../utils/toast'
import type { RegisterFormData } from '../validations/auth'

const MAIN_API_URL = process.env.NEXT_PUBLIC_MAIN_API_URL || 'http://localhost:8000'

interface Role {
  id: number
  name: string
}

interface Config {
  roles: Role[]
}

export function useRegister() {
  const router = useRouter()
  const [openBackdrop, setOpenBackdrop] = useState(false)
  const [isLoadingUserRole, setIsLoadingUserRole] = useState(true)
  const [dob, setDOB] = useState('')
  const [gender, setGender] = useState(0)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [userRoleID, setUserRoleID] = useState<number | null>(null)

  // Load user role from config
  useEffect(() => {
    const loadUserRole = async () => {
      try {
        const response = await fetch(`${MAIN_API_URL}/common-configs/`)
        if (response.ok) {
          const data: Config = await response.json()
          
          // Find user role (ROLE_USER or User)
          const userRole = data.roles?.find(
            (role) => role.name === 'ROLE_USER' || role.name === 'User' || role.name === 'USER'
          )
          if (userRole) {
            setUserRoleID(userRole.id)
          }
        }
      } catch (error) {
        console.error('Error loading user role:', error)
      } finally {
        setIsLoadingUserRole(false)
      }
    }

    loadUserRole()
  }, [])

  const onSubmit = async (
    data: RegisterFormData,
    setError: (name: any, error: { type: string; message: string }) => void
  ) => {
    if (!userRoleID) {
      toastError('Không thể xác định vai trò người dùng. Vui lòng thử lại.')
      return
    }

    setOpenBackdrop(true)

    try {
      // Create user with FormData
      const formData = new FormData()
      formData.append('first_name', data.firstName)
      formData.append('last_name', data.lastName)
      formData.append('password', data.password)
      formData.append('email', data.email)
      formData.append('phone_number', data.phoneNumber)
      if (data.dob) {
        formData.append('date_of_birth', new Date(data.dob).toISOString())
      }
      formData.append('gender', gender.toString())
      if (selectedImage) {
        formData.append('avatar', selectedImage)
      }
      formData.append('role', userRoleID.toString())
      // Location is optional - user can update it later in profile

      const userResult = await registerApi(formData)
      if (userResult.error || !userResult.data) {
        // Handle specific errors
        if (userResult.error?.includes('email') || userResult.error?.toLowerCase().includes('email')) {
          setError('email', {
            type: 'custom',
            message: 'Email đã tồn tại',
          })
        } else if (
          userResult.error?.includes('phone') ||
          userResult.error?.toLowerCase().includes('phone')
        ) {
          setError('phoneNumber', {
            type: 'custom',
            message: 'Số điện thoại đã tồn tại',
          })
        }
        throw new Error(userResult.error || 'Đăng ký thất bại')
      }

      setOpenBackdrop(false)
      toastSuccess('Đăng ký thành công! Bạn có thể cập nhật địa chỉ sau trong phần tài khoản.')
      router.push('/login')
    } catch (err: any) {
      setOpenBackdrop(false)
      const errorMsg = err.message || 'Đăng ký thất bại. Vui lòng thử lại.'
      if (!errorMsg.includes('email') && !errorMsg.includes('phone')) {
        toastError(errorMsg)
      }
    }
  }

  return {
    userRoleID,
    isLoadingUserRole,
    dob,
    gender,
    openBackdrop,
    selectedImage,
    imageUrl,
    onSubmit,
    setDOB,
    setGender,
    setImageUrl,
    setSelectedImage,
  }
}

