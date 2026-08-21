'use client'

import { useEffect, useMemo, useState } from 'react'
import { useTranslations } from 'next-intl'
import { AccountPageHeader } from '@/components/account/AccountPageHeader'
import { Button } from '@/components/Button'
import { TextField } from '@/components/TextField'
import { SearchableSelect } from '@/components/common/SearchableSelect'
import { AddMedicineSheet } from '@/components/cabinet/AddMedicineSheet'
import { CabinetAlertsPanel } from '@/components/cabinet/CabinetAlertsPanel'
import { ItemActionsSheet } from '@/components/cabinet/ItemActionsSheet'
import { SeedFromOrderSheet } from '@/components/cabinet/SeedFromOrderSheet'
import { SeedFromPrescriptionSheet } from '@/components/cabinet/SeedFromPrescriptionSheet'
import { ExpiryBadge } from '@/components/cabinet/ExpiryBadge'
import { InventoryBadge } from '@/components/cabinet/InventoryBadge'
import { useCabinet } from '@/lib/hooks/useCabinet'
import { mapBuyAgainError, useCabinetBuyAgain } from '@/lib/hooks/useCabinetBuyAgain'
import type { CabinetItem } from '@/lib/services/cabinet'
import { toastError, toastSuccess } from '@/lib/utils/toast'
import { CartLineThumb } from '@/components/cart/CartLineThumb'

type StageFilter = 'all' | 'expired' | 'expiring_soon' | 'expiring' | 'low_stock' | 'refill'
type StageTone = 'neutral' | 'danger' | 'warn'

const MANAGE_DELETE_BTN =
  'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500'
const MANAGE_CREATE_BTN =
  'bg-emerald-600 text-white hover:bg-emerald-700 focus:ring-emerald-500'

function stageChipClass(tone: StageTone, active: boolean) {
  if (tone === 'danger') {
    return active
      ? 'border-accent-500 bg-accent-50 text-accent-800'
      : 'border-accent-100 text-accent-700 hover:bg-accent-50/60'
  }
  if (tone === 'warn') {
    return active
      ? 'border-amber-500 bg-amber-50 text-amber-900'
      : 'border-amber-100 text-amber-800 hover:bg-amber-50/60'
  }
  return active
    ? 'border-primary-500 bg-primary-50 text-primary-800'
    : 'border-slate-200 text-slate-700 hover:bg-slate-50'
}

export function CabinetWorkspace() {
  const t = useTranslations('cabinet')
  const cabinet = useCabinet(true)
  const { buyAgain } = useCabinetBuyAgain()
  const [buyAgainId, setBuyAgainId] = useState<number | null>(null)
  const [addOpen, setAddOpen] = useState(false)
  const [seedOpen, setSeedOpen] = useState(false)
  const [seedRxOpen, setSeedRxOpen] = useState(false)
  const [activeItem, setActiveItem] = useState<CabinetItem | null>(null)
  const [newName, setNewName] = useState('')
  const [renameValue, setRenameValue] = useState('')
  const [showManage, setShowManage] = useState(false)
  const [showRename, setShowRename] = useState(false)
  const [showCreate, setShowCreate] = useState(false)
  const [stage, setStage] = useState<StageFilter>('all')
  const [reminderEnabled, setReminderEnabled] = useState(true)
  const [soonDays, setSoonDays] = useState('30')

  const selected = cabinet.cabinets.find((row) => row.id === cabinet.selectedId)
  const counts = cabinet.overview?.counts
  const total = counts?.total ?? 0

  const cabinetOptions = useMemo(
    () => cabinet.cabinets.map((row) => ({ value: String(row.id), label: row.name })),
    [cabinet.cabinets]
  )

  const filteredItems = useMemo(() => {
    const overview = cabinet.overview
    const items = cabinet.items
    switch (stage) {
      case 'expired':
        return overview?.expired ?? items.filter((i) => i.expiration_status === 'EXPIRED')
      case 'expiring_soon':
        return overview?.expiring_soon ?? items.filter((i) => i.expiration_status === 'EXPIRING_SOON')
      case 'expiring':
        return items.filter((i) => i.expiration_status === 'EXPIRING')
      case 'low_stock':
        return overview?.low_stock ?? items.filter((i) => i.inventory_status === 'LOW_STOCK')
      case 'refill':
        return overview?.refill_list ?? items.filter((i) => i.on_refill_list)
      default:
        return items
    }
  }, [cabinet.items, cabinet.overview, stage])

  useEffect(() => {
    if (!selected) return
    setReminderEnabled(selected.reminder_enabled ?? true)
    setSoonDays(String(selected.expiring_soon_days ?? 30))
  }, [selected])

  useEffect(() => {
    setStage('all')
  }, [cabinet.selectedId])

  const handleCreate = async () => {
    const name = newName.trim()
    if (!name) return
    try {
      await cabinet.createCabinet.mutateAsync(name)
      setNewName('')
      setShowCreate(false)
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

  const stageTabs: { id: StageFilter; label: string; count: number; tone: StageTone }[] = [
    { id: 'all', label: t('filters.all'), count: total, tone: 'neutral' },
    { id: 'expired', label: t('filters.expired'), count: counts?.expired ?? 0, tone: 'danger' },
    {
      id: 'expiring_soon',
      label: t('filters.expiringSoon'),
      count: counts?.expiring_soon ?? 0,
      tone: 'danger',
    },
    { id: 'expiring', label: t('filters.expiring'), count: counts?.expiring ?? 0, tone: 'warn' },
    { id: 'low_stock', label: t('filters.lowStock'), count: counts?.low_stock ?? 0, tone: 'warn' },
    {
      id: 'refill',
      label: t('filters.refill'),
      count: counts?.on_refill_list ?? 0,
      tone: 'neutral',
    },
  ]

  const toggleManage = () => {
    setShowManage((open) => {
      if (open) {
        setShowRename(false)
        setShowCreate(false)
      }
      return !open
    })
  }

  return (
    <div className="space-y-5">
      <AccountPageHeader
        title={t('title')}
        subtitle={selected ? t('subtitle', { name: selected.name, count: total }) : t('titleHint')}
        rightSlot={
          <div className="flex flex-wrap items-center justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setSeedOpen(true)}
              disabled={!cabinet.selectedId}
            >
              {t('seed.open')}
            </Button>
            <Button
              variant="outline"
              onClick={() => setSeedRxOpen(true)}
              disabled={!cabinet.selectedId}
            >
              {t('seedRx.open')}
            </Button>
            <Button onClick={() => setAddOpen(true)} disabled={!cabinet.selectedId}>
              {t('addMedicine')}
            </Button>
          </div>
        }
      />

      <section className="rounded-lg border border-gray-200 bg-white p-5 space-y-3">
        <label className="block text-sm font-medium text-slate-700">{t('switcherLabel')}</label>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-stretch">
          <div className="min-w-0 flex-1">
            <SearchableSelect
              id="cabinet-switcher"
              value={cabinet.selectedId != null ? String(cabinet.selectedId) : ''}
              onChange={(v) => {
                if (v) cabinet.setSelectedId(Number(v))
              }}
              options={cabinetOptions}
              placeholder={t('switcherPlaceholder')}
              searchPlaceholder={t('switcherSearch')}
              title={t('switcherTitle')}
              emptyMessage={t('switcherEmpty')}
              disabled={cabinet.cabinets.length === 0}
            />
          </div>
          <Button
            variant="outline"
            className="shrink-0 !px-3.5 !py-3 !text-sm !leading-5 sm:self-stretch"
            onClick={toggleManage}
          >
            {showManage ? t('manageCabinetHide') : t('manageCabinet')}
          </Button>
        </div>

        {showManage ? (
          <div className="space-y-3 rounded-lg border border-slate-100 bg-slate-50/80 p-4">
            <div className="flex flex-wrap items-center justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setRenameValue(selected?.name ?? '')
                  setShowRename((v) => !v)
                  setShowCreate(false)
                }}
              >
                {t('rename')}
              </Button>
              <Button
                size="sm"
                className={MANAGE_DELETE_BTN}
                disabled={cabinet.cabinets.length <= 1}
                onClick={() => void handleDeleteCabinet()}
              >
                {t('deleteCabinet')}
              </Button>
              <Button
                size="sm"
                className={MANAGE_CREATE_BTN}
                onClick={() => {
                  setShowCreate((v) => !v)
                  setShowRename(false)
                }}
              >
                {t('createCabinetOpen')}
              </Button>
            </div>

            {showRename ? (
              <div className="flex flex-wrap items-end justify-end gap-2">
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

            {showCreate ? (
              <div className="flex flex-wrap items-end justify-end gap-2">
                <div className="min-w-[12rem] flex-1">
                  <TextField
                    label={t('newCabinet')}
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    fullWidth
                  />
                </div>
                <Button
                  size="sm"
                  className={MANAGE_CREATE_BTN}
                  onClick={() => void handleCreate()}
                  disabled={!newName.trim()}
                >
                  {t('createCabinet')}
                </Button>
              </div>
            ) : null}
          </div>
        ) : null}
      </section>

      <CabinetAlertsPanel enabled />

      {cabinet.error ? <p className="text-sm text-accent-600">{cabinet.error.message}</p> : null}

      <section className="rounded-lg border border-gray-200 bg-white p-5 space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">{t('statusSection.title')}</h2>
          <p className="mt-1 text-sm text-gray-500">{t('statusSection.hint')}</p>
        </div>

        <div
          className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 scrollbar-thin"
          role="tablist"
          aria-label={t('statusSection.title')}
        >
          {stageTabs.map((tab) => {
            const active = stage === tab.id
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setStage(tab.id)}
                className={`inline-flex shrink-0 items-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${stageChipClass(tab.tone, active)}`}
              >
                <span>{tab.label}</span>
                <span
                  className={`rounded-md px-1.5 py-0.5 text-xs tabular-nums ${
                    active ? 'bg-white/80' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            )
          })}
        </div>

        {cabinet.isLoading ? <p className="text-sm text-gray-500">{t('loading')}</p> : null}

        {!cabinet.isLoading && filteredItems.length === 0 ? (
          <p className="text-sm text-gray-500">
            {stage === 'all' ? t('emptyCabinet') : t('lists.empty')}
          </p>
        ) : null}

        {!cabinet.isLoading && filteredItems.length > 0 ? (
          <ul className="divide-y divide-slate-100">
            {filteredItems.map((item) => (
              <li key={item.id} className="flex items-center gap-2">
                <button
                  type="button"
                  className="flex min-w-0 flex-1 items-center gap-2.5 py-3 text-left hover:bg-slate-50"
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
                {stage === 'refill' ? (
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={buyAgainId != null}
                    onClick={() => void handleBuyAgain(item)}
                  >
                    {t('refill.buyAgain')}
                  </Button>
                ) : null}
              </li>
            ))}
          </ul>
        ) : null}
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
          <SeedFromPrescriptionSheet
            open={seedRxOpen}
            onClose={() => setSeedRxOpen(false)}
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
        <h2 className="text-lg font-semibold text-slate-900">{t('settings.toggle')}</h2>
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
      <div className="max-w-sm">
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
      <div className="flex justify-end">
        <Button size="sm" onClick={onSave} disabled={saving || selectedId == null}>
          {t('settings.save')}
        </Button>
      </div>
    </section>
  )
}
