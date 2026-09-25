import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@/contexts/AuthContext'
import {
  createUserAddress,
  deleteUserAddress,
  listUserAddresses,
  setDefaultUserAddress,
  updateUserAddress,
  type UserAddress,
  type UserAddressWrite,
} from '@/lib/services/userAddresses'

export const USER_ADDRESSES_QUERY_KEY = ['user-addresses'] as const

export function useUserAddresses(enabled: boolean) {
  const { token, isAuthenticated } = useAuth()

  return useQuery<UserAddress[], Error>({
    queryKey: USER_ADDRESSES_QUERY_KEY,
    queryFn: async () => {
      if (!token) throw new Error('Vui lòng đăng nhập')
      const res = await listUserAddresses(token)
      if (res.error) throw new Error(res.error)
      return res.data || []
    },
    enabled: enabled && isAuthenticated && !!token,
  })
}

export function useUserAddressMutations() {
  const { token } = useAuth()
  const queryClient = useQueryClient()

  const invalidate = () => queryClient.invalidateQueries({ queryKey: USER_ADDRESSES_QUERY_KEY })

  const requireToken = () => {
    if (!token) throw new Error('Vui lòng đăng nhập')
    return token
  }

  const createMutation = useMutation({
    mutationFn: async (payload: UserAddressWrite) => {
      const res = await createUserAddress(requireToken(), payload)
      if (res.error) throw new Error(res.error)
      return res.data
    },
    onSuccess: invalidate,
  })

  const updateMutation = useMutation({
    mutationFn: async ({ id, payload }: { id: number; payload: Partial<UserAddressWrite> }) => {
      const res = await updateUserAddress(requireToken(), id, payload)
      if (res.error) throw new Error(res.error)
      return res.data
    },
    onSuccess: invalidate,
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await deleteUserAddress(requireToken(), id)
      if (res.error) throw new Error(res.error)
      return res.data
    },
    onSuccess: invalidate,
  })

  const setDefaultMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await setDefaultUserAddress(requireToken(), id)
      if (res.error) throw new Error(res.error)
      return res.data
    },
    onSuccess: invalidate,
  })

  return { createMutation, updateMutation, deleteMutation, setDefaultMutation }
}
