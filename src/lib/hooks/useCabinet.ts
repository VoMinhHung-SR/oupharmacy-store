'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useCallback, useEffect, useState } from 'react'
import {
  createCabinet,
  createCabinetItem,
  deleteCabinet,
  deleteCabinetItem,
  getCabinetOverview,
  listCabinetItems,
  listCabinets,
  unwrap,
  updateCabinet,
  updateCabinetItem,
  type CreateCabinetItemPayload,
  type UpdateCabinetItemPayload,
  type UpdateCabinetPayload,
} from '@/lib/services/cabinet'

const cabinetKeys = {
  all: ['cabinets'] as const,
  list: () => [...cabinetKeys.all, 'list'] as const,
  overview: (id: number) => [...cabinetKeys.all, 'overview', id] as const,
  items: (id: number) => [...cabinetKeys.all, 'items', id] as const,
}

export function useCabinet(enabled: boolean) {
  const queryClient = useQueryClient()
  const [selectedId, setSelectedId] = useState<number | null>(null)

  const cabinetsQuery = useQuery({
    queryKey: cabinetKeys.list(),
    queryFn: async () => unwrap(await listCabinets()),
    enabled,
  })

  useEffect(() => {
    const rows = cabinetsQuery.data
    if (!rows?.length) return
    if (selectedId == null || !rows.some((row) => row.id === selectedId)) {
      setSelectedId(rows[0].id)
    }
  }, [cabinetsQuery.data, selectedId])

  const cabinetId = selectedId
  const overviewQuery = useQuery({
    queryKey: cabinetKeys.overview(cabinetId ?? 0),
    queryFn: async () => unwrap(await getCabinetOverview(cabinetId!)),
    enabled: enabled && cabinetId != null,
  })

  const itemsQuery = useQuery({
    queryKey: cabinetKeys.items(cabinetId ?? 0),
    queryFn: async () => unwrap(await listCabinetItems(cabinetId!)),
    enabled: enabled && cabinetId != null,
  })

  const invalidate = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: cabinetKeys.all })
  }, [queryClient])

  const createCabinetMutation = useMutation({
    mutationFn: async (name: string) => unwrap(await createCabinet(name)),
    onSuccess: (cabinet) => {
      invalidate()
      setSelectedId(cabinet.id)
    },
  })

  const renameCabinetMutation = useMutation({
    mutationFn: async ({ id, name }: { id: number; name: string }) =>
      unwrap(await updateCabinet(id, { name })),
    onSuccess: invalidate,
  })

  const updateCabinetMutation = useMutation({
    mutationFn: async ({ id, payload }: { id: number; payload: UpdateCabinetPayload }) =>
      unwrap(await updateCabinet(id, payload)),
    onSuccess: invalidate,
  })

  const deleteCabinetMutation = useMutation({
    mutationFn: async (id: number) => unwrap(await deleteCabinet(id)),
    onSuccess: () => {
      setSelectedId(null)
      invalidate()
    },
  })

  const addItemMutation = useMutation({
    mutationFn: async (payload: CreateCabinetItemPayload) =>
      unwrap(await createCabinetItem(payload)),
    onSuccess: invalidate,
  })

  const updateItemMutation = useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: number
      payload: UpdateCabinetItemPayload
    }) => unwrap(await updateCabinetItem(id, payload)),
    onSuccess: invalidate,
  })

  const deleteItemMutation = useMutation({
    mutationFn: async (id: number) => unwrap(await deleteCabinetItem(id)),
    onSuccess: invalidate,
  })

  return {
    selectedId: cabinetId,
    setSelectedId,
    cabinets: cabinetsQuery.data ?? [],
    overview: overviewQuery.data,
    items: itemsQuery.data ?? [],
    isLoading: cabinetsQuery.isLoading || overviewQuery.isLoading || itemsQuery.isLoading,
    isFetching: cabinetsQuery.isFetching || overviewQuery.isFetching || itemsQuery.isFetching,
    error:
      cabinetsQuery.error ||
      overviewQuery.error ||
      itemsQuery.error,
    createCabinet: createCabinetMutation,
    renameCabinet: renameCabinetMutation,
    updateCabinet: updateCabinetMutation,
    deleteCabinet: deleteCabinetMutation,
    addItem: addItemMutation,
    updateItem: updateItemMutation,
    deleteItem: deleteItemMutation,
  }
}
