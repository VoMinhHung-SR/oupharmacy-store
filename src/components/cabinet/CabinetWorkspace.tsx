'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { AccountPageHeader } from '@/components/account/AccountPageHeader'
import { Button } from '@/components/Button'
import { TextField, SelectField } from '@/components/TextField'
import { AddMedicineSheet } from '@/components/cabinet/AddMedicineSheet'
import { ItemActionsSheet } from '@/components/cabinet/ItemActionsSheet'
import { ExpiryBadge } from '@/components/cabinet/ExpiryBadge'
import { useCabinet } from '@/lib/hooks/useCabinet'
import type { CabinetItem } from '@/lib/services/cabinet'
import { toastError, toastSuccess } from '@/lib/utils/toast'

export function CabinetWorkspace() {
  const t = useTranslations('cabinet')
  const cabinet = useCabinet(true)
  const [addOpen, setAddOpen] = useState(false)
  const [activeItem, setActiveItem] = useState<CabinetItem | null>(null)
  const [newName, setNewName] = useState('')
  const [renameValue, setRenameValue] = useState('')
  const [showRename, setShowRename] = useState(false)

  const selected = cabinet.cabinets.find((row) => row.id === cabinet.selectedId)
  const counts = cabinet.overview?.counts

  const handleCreate = async () => {
    const name = newName.trim()
    if (!name) return
    try {
      await cabinet.createCabinet.mutateAsync(name)
      setNewName('')
      toastSuccess(t('toast.cabinetCreated'))
    } catch (err) {
      toastError(err instanceof Error ? err.message : t('toast.actionFailed'))
    }
  }

  const handleRename = async () => {
    if (!cabinet.selectedId) return
    const name = renameValue.trim()
    if (!name) return
    try {
      await cabinet.renameCabinet.mutateAsync({ id: cabinet.selectedId, name })
      setShowRename(false)
      toastSuccess(t('toast.cabinetRenamed'))
    } catch (err) {
      toastError(err instanceof Error ? err.message : t('toast.actionFailed'))
    }
  }

  const handleDeleteCabinet = async () => {
    if (!cabinet.selectedId || cabinet.cabinets.length <= 1) return
    try {
      await cabinet.deleteCabinet.mutateAsync(cabinet.selectedId)
      toastSuccess(t('toast.cabinetDeleted'))
    } catch (err) {
      toastError(err instanceof Error ? err.message : t('toast.actionFailed'))
    }
  }

  return (
    <div className="space-y-6">
      <AccountPageHeader
        title={t('title')}
        subtitle={selected ? t('subtitle', { name: selected.name, count: counts?.total ?? 0 }) : t('titleHint')}
        rightSlot={
          <Button onClick={() => setAddOpen(true)} disabled={!cabinet.selectedId}>
            {t('addMedicine')}
          </Button>
        }
      />

      <section className="rounded-lg border border-gray-200 bg-white p-5 space-y-4">
        <div className="flex flex-wrap items-end gap-3">
          <div className="min-w-[12rem] flex-1">
            <SelectField
              label={t('switcherLabel')}
              value={cabinet.selectedId != null ? String(cabinet.selectedId) : ''}
              onChange={(e) => cabinet.setSelectedId(Number(e.target.value))}
              fullWidth
            >
              {cabinet.cabinets.map((row) => (
                <option key={row.id} value={row.id}>
                  {row.name}
                </option>
              ))}
            </SelectField>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setRenameValue(selected?.name ?? '')
              setShowRename((v) => !v)
            }}
          >
            {t('rename')}
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={cabinet.cabinets.length <= 1}
            onClick={handleDeleteCabinet}
          >
            {t('deleteCabinet')}
          </Button>
        </div>
        {showRename ? (
          <div className="flex flex-wrap gap-2">
            <div className="min-w-[12rem] flex-1">
              <TextField
                label={t('cabinetName')}
                value={renameValue}
                onChange={(e) => setRenameValue(e.target.value)}
                fullWidth
              />
            </div>
            <Button size="sm" onClick={handleRename}>
              {t('saveChanges')}
            </Button>
          </div>
        ) : null}
        <div className="flex flex-wrap gap-2">
          <div className="min-w-[12rem] flex-1">
            <TextField
              label={t('newCabinet')}
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              fullWidth
            />
          </div>
          <Button size="sm" variant="secondary" onClick={handleCreate} disabled={!newName.trim()}>
            {t('createCabinet')}
          </Button>
        </div>
      </section>

      {cabinet.error ? (
        <p className="text-sm text-accent-600">{cabinet.error.message}</p>
      ) : null}

      <section className="grid gap-3 sm:grid-cols-3">
        <CountCard
          label={t('counts.expired')}
          value={counts?.expired ?? 0}
          tone="text-accent-700 bg-accent-50 border-accent-200"
        />
        <CountCard
          label={t('counts.expiringSoon')}
          value={counts?.expiring_soon ?? 0}
          tone="text-accent-700 bg-accent-50 border-accent-200"
        />
        <CountCard
          label={t('counts.expiring')}
          value={counts?.expiring ?? 0}
          tone="text-amber-800 bg-amber-50 border-amber-200"
        />
      </section>

      <AlertList title={t('lists.expired')} items={cabinet.overview?.expired ?? []} onOpen={setActiveItem} empty={t('lists.empty')} />
      <AlertList
        title={t('lists.expiringSoon')}
        items={cabinet.overview?.expiring_soon ?? []}
        onOpen={setActiveItem}
        empty={t('lists.empty')}
      />

      <section className="rounded-lg border border-gray-200 bg-white p-5">
        <h2 className="mb-4 text-lg font-semibold text-slate-900">{t('allItems')}</h2>
        {cabinet.isLoading ? <p className="text-sm text-gray-500">{t('loading')}</p> : null}
        {!cabinet.isLoading && cabinet.items.length === 0 ? (
          <p className="text-sm text-gray-500">{t('emptyCabinet')}</p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {cabinet.items.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  className="flex w-full items-center gap-3 py-3 text-left hover:bg-slate-50"
                  onClick={() => setActiveItem(item)}
                >
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-medium text-slate-900">
                      {item.product_name || t('itemFallback')}
                    </span>
                    <span className="block text-sm text-gray-500">
                      {item.quantity} {item.unit_name} · {item.expiration_date}
                    </span>
                  </span>
                  <ExpiryBadge status={item.expiration_status} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      {cabinet.selectedId ? (
        <AddMedicineSheet
          open={addOpen}
          onClose={() => setAddOpen(false)}
          cabinetId={cabinet.selectedId}
          onAdd={(payload) => cabinet.addItem.mutateAsync(payload)}
        />
      ) : null}
      <ItemActionsSheet
        item={activeItem}
        open={activeItem != null}
        onClose={() => setActiveItem(null)}
        onUpdate={(id, payload) => cabinet.updateItem.mutateAsync({ id, payload })}
        onDelete={(id) => cabinet.deleteItem.mutateAsync(id)}
      />
    </div>
  )
}

function CountCard({ label, value, tone }: { label: string; value: number; tone: string }) {
  return (
    <div className={`rounded-lg border px-4 py-3 ${tone}`}>
      <p className="text-sm font-medium">{label}</p>
      <p className="text-2xl font-semibold">{value}</p>
    </div>
  )
}

function AlertList({
  title,
  items,
  onOpen,
  empty,
}: {
  title: string
  items: CabinetItem[]
  onOpen: (item: CabinetItem) => void
  empty: string
}) {
  return (
    <section className="rounded-lg border border-gray-200 bg-white p-5">
      <h2 className="mb-3 text-lg font-semibold text-slate-900">{title}</h2>
      {items.length === 0 ? (
        <p className="text-sm text-gray-500">{empty}</p>
      ) : (
        <ul className="space-y-2">
          {items.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                className="flex w-full items-center justify-between gap-3 rounded-lg px-2 py-2 text-left hover:bg-slate-50"
                onClick={() => onOpen(item)}
              >
                <span className="truncate font-medium text-slate-900">
                  {item.product_name}
                </span>
                <ExpiryBadge status={item.expiration_status} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
