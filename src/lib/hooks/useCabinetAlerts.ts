'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  clearReadCabinetAlerts,
  dismissCabinetAlert,
  listCabinetAlerts,
  markAllCabinetAlertsRead,
  markCabinetAlertRead,
} from '@/lib/services/cabinetAlerts'

const alertKeys = {
  all: ['cabinet-alerts'] as const,
  list: (unreadOnly: boolean) => [...alertKeys.all, 'list', unreadOnly] as const,
}

export function useCabinetAlerts(enabled: boolean, unreadOnly = false) {
  const queryClient = useQueryClient()

  const listQuery = useQuery({
    queryKey: alertKeys.list(unreadOnly),
    queryFn: () => listCabinetAlerts(unreadOnly),
    enabled,
  })

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: alertKeys.all })
  }

  const markRead = useMutation({
    mutationFn: markCabinetAlertRead,
    onSuccess: invalidate,
  })

  const markAllRead = useMutation({
    mutationFn: markAllCabinetAlertsRead,
    onSuccess: invalidate,
  })

  const dismiss = useMutation({
    mutationFn: dismissCabinetAlert,
    onSuccess: invalidate,
  })

  const clearRead = useMutation({
    mutationFn: clearReadCabinetAlerts,
    onSuccess: invalidate,
  })

  const alerts = listQuery.data ?? []
  const unreadCount = unreadOnly ? alerts.length : alerts.filter((row) => !row.is_read).length
  const readCount = unreadOnly ? 0 : alerts.filter((row) => row.is_read).length

  return {
    alerts,
    unreadCount,
    readCount,
    isLoading: listQuery.isLoading,
    error: listQuery.error,
    markRead,
    markAllRead,
    dismiss,
    clearRead,
    refetch: listQuery.refetch,
  }
}
