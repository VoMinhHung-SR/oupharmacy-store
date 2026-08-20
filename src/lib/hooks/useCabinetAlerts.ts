'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  listCabinetAlerts,
  markAllCabinetAlertsRead,
  markCabinetAlertRead,
  unwrapAlert,
} from '@/lib/services/cabinetAlerts'

const alertKeys = {
  all: ['cabinet-alerts'] as const,
  list: (unreadOnly: boolean) => [...alertKeys.all, 'list', unreadOnly] as const,
}

export function useCabinetAlerts(enabled: boolean, unreadOnly = false) {
  const queryClient = useQueryClient()

  const listQuery = useQuery({
    queryKey: alertKeys.list(unreadOnly),
    queryFn: async () => unwrapAlert(await listCabinetAlerts(unreadOnly)),
    enabled,
  })

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: alertKeys.all })
  }

  const markRead = useMutation({
    mutationFn: async (id: number) => unwrapAlert(await markCabinetAlertRead(id)),
    onSuccess: invalidate,
  })

  const markAllRead = useMutation({
    mutationFn: async () => unwrapAlert(await markAllCabinetAlertsRead()),
    onSuccess: invalidate,
  })

  const alerts = listQuery.data ?? []
  const unreadCount = unreadOnly ? alerts.length : alerts.filter((row) => !row.is_read).length

  return {
    alerts,
    unreadCount,
    isLoading: listQuery.isLoading,
    error: listQuery.error,
    markRead,
    markAllRead,
    refetch: listQuery.refetch,
  }
}
