'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { AccountPageHeader } from '@/components/account/AccountPageHeader'
import { Button } from '@/components/Button'
import { TextField, SelectField } from '@/components/TextField'
import { AddMedicineSheet } from '@/components/cabinet/AddMedicineSheet'
import { CabinetAlertsPanel } from '@/components/cabinet/CabinetAlertsPanel'
import { ItemActionsSheet } from '@/components/cabinet/ItemActionsSheet'
import { SeedFromOrderSheet } from '@/components/cabinet/SeedFromOrderSheet'
import { ExpiryBadge } from '@/components/cabinet/ExpiryBadge'
import { InventoryBadge } from '@/components/cabinet/InventoryBadge'
import { useCabinet } from '@/lib/hooks/useCabinet'
import { mapBuyAgainError, useCabinetBuyAgain } from '@/lib/hooks/useCabinetBuyAgain'
import type { CabinetItem } from '@/lib/services/cabinet'
import { toastError, toastSuccess } from '@/lib/utils/toast'
import { CartLineThumb } from '@/components/cart/CartLineThumb'

export function CabinetWorkspace() {
  const t = useTranslations('cabinet')
  const cabinet = useCabinet(true)
  const { buyAgain } = useCabinetBuyAgain()
  const [buyAgainId, setBuyAgainId] = useState<number | null>(null)
  const [addOpen, setAddOpen] = useState(false)
  const [seedOpen, setSeedOpen] = useState(false)
  const [activeItem, setActiveItem] = useState<CabinetItem | null>(null)
  const [newName, setNewName] = useState('')
  const [renameValue, setRenameValue] = useState('')
  const [showRename, setShowRename] = useState(false)
  const [reminderEnabled, setReminderEnabled] = useState(true)
  const [soonDays, setSoonDays] = useState('30')

  const selected = cabinet.cabinets.find((row) => row.id === cabinet.selectedId)
  const counts = cabinet.overview?.counts

  useEffect(() => {
    if (!selected) return
    setReminderEnabled(selected.reminder_enabled ?? true)
    setSoonDays(String(selected.expiring_soon_days ?? 30))
  }, [selected])

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

  const handleBuyAgain = async (item: CabinetItem) => {
    setBuyAgainId(item.id)
    try {
      await buyAgain(item)
      toastSuccess(t('toast.addedToCart'))
    } catch (err) {
      toastError(mapBuyAgainError(err instanceof Error ? err.message : '', t))
    } finally {
      setBuyAgainId(null)
    }
  }

  const handleSaveSettings = async () => {
    if (!cabinet.selectedId) return
    const days = Number(soonDays)
    if (!Number.isFinite(days) || days < 1 || days > 365) {
      toastError(t('settings.daysInvalid'))
      return
    }
    try {
      await cabinet.updateCabinet.mutateAsync({
        id: cabinet.selectedId,
        payload: { reminder_enabled: reminderEnabled, expiring_soon_days: days },
      })
      toastSuccess(t('toast.settingsSaved'))
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
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => setSeedOpen(true)} disabled={!cabinet.selectedId}>
              {t('seed.open')}
            </Button>
            <Button onClick={() => setAddOpen(true)} disabled={!cabinet.selectedId}>
              {t('addMedicine')}
            </Button>
          </div>
        }
      />

      <section className="rounded-lg border border-gray-200 bg-white p-5 space-y-4">
        <div className="flex flex-wrap items-end gap-3">
          <div className="min-w-[12rem] flex-1">
            <SelectField
              label={t('switcherLabel')}
              value={cabinet.selectedId != null ? String(cabinet.selectedId) : ''}
              onChange={(e) => {
                cabinet.setSelectedId(Number(e.target.value))
              }}
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
            onClick={() => void handleDeleteCabinet()}
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
            <Button size="sm" onClick={() => void handleRename()}>
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
          <Button size="sm" variant="secondary" onClick={() => void handleCreate()} disabled={!newName.trim()}>
            {t('createCabinet')}
          </Button>
        </div>
      </section>

      <SettingsSection
        selectedId={selected?.id}
        reminderEnabled={reminderEnabled}
        soonDays={soonDays}
        onReminderChange={setReminderEnabled}
        onSoonDaysChange={setSoonDays}
        onSave={() => void handleSaveSettings()}
        saving={cabinet.updateCabinet.isPending}
      />

      <CabinetAlertsPanel enabled />

      {cabinet.error ? (
        <p className="text-sm text-accent-600">{cabinet.error.message}</p>
      ) : null}

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
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
        <CountCard
          label={t('counts.lowStock')}
          value={counts?.low_stock ?? 0}
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
      <AlertList
        title={t('lists.lowStock')}
        items={cabinet.overview?.low_stock ?? []}
        onOpen={setActiveItem}
        empty={t('lists.empty')}
      />
      <AlertList
        title={t('lists.refill')}
        items={cabinet.overview?.refill_list ?? []}
        onOpen={setActiveItem}
        empty={t('lists.empty')}
        onBuyAgain={handleBuyAgain}
        buyAgainLabel={t('refill.buyAgain')}
        buyAgainBusyId={buyAgainId}
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
                  className="flex w-full items-center gap-2.5 py-3 text-left hover:bg-slate-50"
                  onClick={() => setActiveItem(item)}
                >
                  <CartLineThumb src={item.image_url} alt="" size="sm" native />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-medium text-slate-900">
                      {item.product_name || t('itemFallback')}
                    </span>
                    <span className="block text-sm text-gray-500">
                      {item.quantity} {item.unit_name} · {item.expiration_date}
                      {item.lot_number ? ` · ${item.lot_number}` : ''}
                    </span>
                  </span>
                  <span className="flex flex-col items-end gap-1">
                    <ExpiryBadge status={item.expiration_status} />
                    <InventoryBadge status={item.inventory_status} />
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      {cabinet.selectedId ? (
        <>
          <AddMedicineSheet
            open={addOpen}
            onClose={() => setAddOpen(false)}
            cabinetId={cabinet.selectedId}
            onAdd={(payload) => cabinet.addItem.mutateAsync(payload)}
          />
          <SeedFromOrderSheet
            open={seedOpen}
            onClose={() => setSeedOpen(false)}
            cabinetId={cabinet.selectedId}
            onAdd={(payload) => cabinet.addItem.mutateAsync(payload)}
          />
        </>
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

function SettingsSection({
  selectedId,
  reminderEnabled,
  soonDays,
  onReminderChange,
  onSoonDaysChange,
  onSave,
  saving,
}: {
  selectedId?: number
  reminderEnabled: boolean
  soonDays: string
  onReminderChange: (value: boolean) => void
  onSoonDaysChange: (value: string) => void
  onSave: () => void
  saving: boolean
}) {
  const t = useTranslations('cabinet')

  return (
    <section className="rounded-lg border border-gray-200 bg-white p-5 space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">{t('settings.title')}</h2>
        <p className="mt-1 text-sm text-gray-500">{t('settings.alertsAlwaysVisible')}</p>
      </div>
      <label className="flex items-start gap-3">
        <input
          type="checkbox"
          className="mt-1 h-4 w-4 rounded border-slate-300 text-primary-600"
          checked={reminderEnabled}
          onChange={(e) => onReminderChange(e.target.checked)}
        />
        <span>
          <span className="block text-sm font-medium text-slate-800">{t('settings.reminderEnabled')}</span>
          <span className="block text-xs text-gray-500">{t('settings.reminderHint')}</span>
        </span>
      </label>
      <div className="max-w-xs">
        <TextField
          type="number"
          min={1}
          max={365}
          label={t('settings.soonDays')}
          value={soonDays}
          onChange={(e) => onSoonDaysChange(e.target.value)}
          helperText={t('settings.soonDaysHint')}
          fullWidth
        />
      </div>
      <Button size="sm" onClick={onSave} disabled={saving || selectedId == null}>
        {t('settings.save')}
      </Button>
    </section>
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
  onBuyAgain,
  buyAgainLabel,
  buyAgainBusyId,
}: {
  title: string
  items: CabinetItem[]
  onOpen: (item: CabinetItem) => void
  empty: string
  onBuyAgain?: (item: CabinetItem) => void
  buyAgainLabel?: string
  buyAgainBusyId?: number | null
}) {
  return (
    <section className="rounded-lg border border-gray-200 bg-white p-5">
      <h2 className="mb-3 text-lg font-semibold text-slate-900">{title}</h2>
      {items.length === 0 ? (
        <p className="text-sm text-gray-500">{empty}</p>
      ) : (
        <ul className="space-y-2">
          {items.map((item) => (
            <li key={item.id} className="flex items-center gap-2 rounded-lg px-2 py-2 hover:bg-slate-50">
              <button
                type="button"
                className="flex min-w-0 flex-1 items-center gap-2.5 text-left"
                onClick={() => onOpen(item)}
              >
                <CartLineThumb src={item.image_url} alt="" size="sm" native />
                <span className="min-w-0 flex-1 truncate font-medium text-slate-900">
                  {item.product_name}
                </span>
                <span className="flex items-center gap-1">
                  <ExpiryBadge status={item.expiration_status} />
                  <InventoryBadge status={item.inventory_status} />
                </span>
              </button>
              {onBuyAgain && buyAgainLabel ? (
                <Button
                  size="sm"
                  variant="outline"
                  disabled={buyAgainBusyId != null}
                  onClick={() => onBuyAgain(item)}
                >
                  {buyAgainLabel}
                </Button>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
