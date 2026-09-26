'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
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
import { CartLineThumb } from '@/components/cart/CartLineThumb'
import {
  ArrowLeftIcon,
  BellIcon,
  CheckCircleIcon,
  ClockIcon,
  JarOfPillsIcon,
  PillIcon,
  PillPlusIcon,
} from '@/components/icons'
import { useCabinet } from '@/lib/hooks/useCabinet'
import { useCabinetAlerts } from '@/lib/hooks/useCabinetAlerts'
import { mapBuyAgainError, useCabinetBuyAgain } from '@/lib/hooks/useCabinetBuyAgain'
import type { CabinetItem } from '@/lib/services/cabinet'
import { CabinetMedsListSkeleton } from '@/components/skeletons'
import { toastError, toastSuccess } from '@/lib/utils/toast'

type CabinetTab = 'meds' | 'reminders' | 'schedule'
type StageFilter = 'all' | 'expired' | 'expiring_soon' | 'expiring' | 'low_stock' | 'refill'
type StageTone = 'neutral' | 'danger' | 'warn'

const MANAGE_DELETE_BTN = 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500'
const MANAGE_CREATE_BTN = 'bg-emerald-600 text-white hover:bg-emerald-700 focus:ring-emerald-500'

function parseTab(raw: string | null, focusAlerts: boolean): CabinetTab {
  if (focusAlerts || raw === 'reminders' || raw === 'alerts') return 'reminders'
  if (raw === 'schedule' || raw === 'doses') return 'schedule'
  return 'meds'
}

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
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const focusAlerts = searchParams.get('focus') === 'alerts'
  const [tab, setTab] = useState<CabinetTab>(() =>
    parseTab(searchParams.get('tab'), focusAlerts)
  )

  const cabinet = useCabinet(true)
  const alerts = useCabinetAlerts(true, false)
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
  const unreadCount = alerts.unreadCount

  useEffect(() => {
    setTab(parseTab(searchParams.get('tab'), searchParams.get('focus') === 'alerts'))
  }, [searchParams])

  const selectTab = (next: CabinetTab) => {
    setTab(next)
    const params = new URLSearchParams(searchParams.toString())
    params.delete('focus')
    if (next === 'meds') params.delete('tab')
    else params.set('tab', next)
    const qs = params.toString()
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
  }

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

  const featureTabs: {
    id: CabinetTab
    label: string
    hint: string
    icon: typeof PillIcon
    badge?: number
  }[] = [
    {
      id: 'meds',
      label: t('tabs.meds'),
      hint: t('tabs.medsHint'),
      icon: PillIcon,
      badge: total > 0 ? total : undefined,
    },
    {
      id: 'reminders',
      label: t('tabs.reminders'),
      hint: t('tabs.remindersHint'),
      icon: BellIcon,
      badge: unreadCount > 0 ? unreadCount : undefined,
    },
    {
      id: 'schedule',
      label: t('tabs.schedule'),
      hint: t('tabs.scheduleHint'),
      icon: ClockIcon,
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
    <div className="space-y-4 sm:space-y-5">
      {/* Product hero — Smart cabinet identity */}
      <section className="overflow-hidden rounded-xl border border-primary-200/70 bg-gradient-to-br from-primary-600 to-primary-800 text-white shadow-md shadow-primary-900/10">
        <div className="relative p-4 sm:p-5">
          <div
            className="pointer-events-none absolute -right-8 -top-10 h-32 w-32 rounded-full bg-secondary-400/20 blur-2xl"
            aria-hidden
          />
          <Link
            href="/tai-khoan"
            className="relative mb-3 inline-flex items-center gap-1.5 text-sm font-medium text-primary-100 hover:text-white"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Quay lại
          </Link>
          <div className="relative flex items-start gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/25">
              <JarOfPillsIcon className="h-6 w-6" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-primary-100/90">
                {t('productEyebrow')}
              </p>
              <h1 className="mt-0.5 text-xl font-semibold tracking-tight sm:text-2xl">{t('title')}</h1>
              <p className="mt-1 text-sm leading-relaxed text-primary-50/95">{t('productTagline')}</p>
            </div>
          </div>

          {/* Feature map */}
          <div className="relative mt-4 grid grid-cols-3 gap-2">
            {featureTabs.map((item) => {
              const Icon = item.icon
              const active = tab === item.id
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => selectTab(item.id)}
                  className={`rounded-xl border px-2 py-2.5 text-left transition-colors sm:px-3 ${
                    active
                      ? 'border-white bg-white text-primary-800 shadow-sm'
                      : 'border-white/25 bg-white/10 text-white hover:bg-white/15'
                  }`}
                >
                  <span className="flex items-center justify-between gap-1">
                    <Icon className={`h-4 w-4 ${active ? 'text-primary-600' : 'text-white'}`} />
                    {item.badge != null ? (
                      <span
                        className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold tabular-nums ${
                          active ? 'bg-accent-100 text-accent-700' : 'bg-white/20 text-white'
                        }`}
                      >
                        {item.badge}
                      </span>
                    ) : null}
                  </span>
                  <span className={`mt-1.5 block text-xs font-semibold sm:text-sm ${active ? 'text-primary-900' : ''}`}>
                    {item.label}
                  </span>
                  <span
                    className={`mt-0.5 block text-[10px] leading-snug sm:text-[11px] ${
                      active ? 'text-primary-600/90' : 'text-primary-100/85'
                    }`}
                  >
                    {item.hint}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </section>

      {/* Shared: which cabinet */}
      <section className="rounded-xl border border-slate-200/90 bg-white p-3.5 shadow-sm sm:p-4">
        <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
          <label className="shrink-0 text-xs font-semibold uppercase tracking-wide text-slate-500 sm:w-28">
            {t('switcherLabel')}
          </label>
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
          <Button variant="outline" size="sm" className="shrink-0" onClick={toggleManage}>
            {showManage ? t('manageCabinetHide') : t('manageCabinet')}
          </Button>
        </div>

        {showManage ? (
          <div className="mt-3 space-y-3 rounded-lg border border-slate-100 bg-slate-50/80 p-3">
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
              <div className="flex flex-wrap items-end gap-2">
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
              <div className="flex flex-wrap items-end gap-2">
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

      {cabinet.error ? <p className="text-sm text-accent-600">{cabinet.error.message}</p> : null}

      {/* ===== TAB: MEDS ===== */}
      {tab === 'meds' ? (
        <section className="space-y-3.5 rounded-xl border border-slate-200/90 bg-white p-4 shadow-sm sm:p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold text-slate-900 sm:text-lg">{t('sections.medsTitle')}</h2>
              <p className="mt-0.5 text-xs text-slate-500 sm:text-sm">{t('sections.medsBody')}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button size="sm" onClick={() => setAddOpen(true)} disabled={!cabinet.selectedId}>
                <span className="inline-flex items-center gap-1.5">
                  <PillPlusIcon className="h-4 w-4" />
                  {t('addMedicine')}
                </span>
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setSeedOpen(true)}
                disabled={!cabinet.selectedId}
              >
                {t('seed.open')}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setSeedRxOpen(true)}
                disabled={!cabinet.selectedId}
              >
                {t('seedRx.open')}
              </Button>
            </div>
          </div>

          <div
            className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 scrollbar-thin"
            role="tablist"
            aria-label={t('statusSection.title')}
          >
            {stageTabs.map((row) => {
              const active = stage === row.id
              return (
                <button
                  key={row.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setStage(row.id)}
                  className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors sm:text-sm ${stageChipClass(row.tone, active)}`}
                >
                  <span>{row.label}</span>
                  <span
                    className={`rounded-full px-1.5 py-0.5 text-[11px] tabular-nums ${
                      active ? 'bg-white/90' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {row.count}
                  </span>
                </button>
              )
            })}
          </div>

          {cabinet.isLoading ? <CabinetMedsListSkeleton /> : null}

          {!cabinet.isLoading && filteredItems.length === 0 ? (
            <div className="flex flex-col items-center rounded-xl border border-dashed border-slate-200 bg-slate-50/70 px-4 py-8 text-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-50 text-primary-600">
                <JarOfPillsIcon className="h-6 w-6" />
              </span>
              <p className="mt-3 text-sm font-semibold text-slate-900">
                {stage === 'all' ? t('emptyCabinet') : t('lists.empty')}
              </p>
              {stage === 'all' ? (
                <Button size="sm" className="mt-3" onClick={() => setAddOpen(true)} disabled={!cabinet.selectedId}>
                  {t('addMedicine')}
                </Button>
              ) : (
                <button
                  type="button"
                  className="mt-2 text-xs font-semibold text-primary-700"
                  onClick={() => setStage('all')}
                >
                  {t('sections.showAllMeds')}
                </button>
              )}
            </div>
          ) : null}

          {!cabinet.isLoading && filteredItems.length > 0 ? (
            <ul className="divide-y divide-slate-100 overflow-hidden rounded-lg border border-slate-100">
              {filteredItems.map((item) => (
                <li key={item.id} className="flex items-center gap-2 bg-white">
                  <button
                    type="button"
                    className="flex min-w-0 flex-1 items-center gap-2.5 px-3 py-3 text-left hover:bg-slate-50"
                    onClick={() => setActiveItem(item)}
                  >
                    <CartLineThumb src={item.image_url} alt="" size="sm" native />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium text-slate-900">
                        {item.product_name || t('itemFallback')}
                      </span>
                      <span className="block text-xs text-gray-500">
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
                      className="mr-2"
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
      ) : null}

      {/* ===== TAB: REMINDERS (expiry) ===== */}
      {tab === 'reminders' ? (
        <div className="space-y-3.5">
          <section className="rounded-xl border border-slate-200/90 bg-white p-4 shadow-sm sm:p-5">
            <h2 className="text-base font-semibold text-slate-900 sm:text-lg">{t('sections.remindersTitle')}</h2>
            <p className="mt-0.5 text-xs text-slate-500 sm:text-sm">{t('sections.remindersBody')}</p>

            <div className="mt-4 space-y-4">
              <label
                className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3.5 ${
                  reminderEnabled
                    ? 'border-secondary-200 bg-secondary-50/50'
                    : 'border-slate-200 bg-slate-50'
                }`}
              >
                <input
                  type="checkbox"
                  className="mt-1 h-4 w-4 rounded border-slate-300 text-primary-600"
                  checked={reminderEnabled}
                  onChange={(e) => setReminderEnabled(e.target.checked)}
                />
                <span>
                  <span className="block text-sm font-medium text-slate-800">
                    {t('settings.reminderEnabled')}
                  </span>
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
                  onChange={(e) => setSoonDays(e.target.value)}
                  helperText={t('settings.soonDaysHint')}
                  fullWidth
                />
              </div>
              <div className="flex justify-end">
                <Button
                  size="sm"
                  onClick={() => void handleSaveSettings()}
                  disabled={cabinet.updateCabinet.isPending || selected?.id == null}
                >
                  {cabinet.updateCabinet.isPending ? t('loading') : t('settings.save')}
                </Button>
              </div>
            </div>
          </section>

          <div id="cabinet-alerts" className="scroll-mt-24">
            <CabinetAlertsPanel enabled showUnreadFilter variant="elevated" />
          </div>
        </div>
      ) : null}

      {/* ===== TAB: SCHEDULE (dose) — roadmap, honest empty ===== */}
      {tab === 'schedule' ? (
        <section className="rounded-xl border border-slate-200/90 bg-white p-4 shadow-sm sm:p-5">
          <h2 className="text-base font-semibold text-slate-900 sm:text-lg">{t('sections.scheduleTitle')}</h2>
          <p className="mt-0.5 text-xs text-slate-500 sm:text-sm">{t('sections.scheduleBody')}</p>

          <div className="mt-5 flex flex-col items-center rounded-xl border border-dashed border-primary-200 bg-gradient-to-b from-primary-50/80 to-white px-4 py-10 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-100 text-primary-700">
              <ClockIcon className="h-7 w-7" />
            </span>
            <p className="mt-4 text-sm font-semibold text-slate-900">{t('schedule.comingTitle')}</p>
            <p className="mt-1.5 max-w-md text-xs leading-relaxed text-slate-600 sm:text-sm">
              {t('schedule.comingBody')}
            </p>
            <ul className="mt-5 w-full max-w-sm space-y-2 text-left text-xs text-slate-600 sm:text-sm">
              <li className="flex items-start gap-2 rounded-lg border border-slate-100 bg-white px-3 py-2.5">
                <CheckCircleIcon className="mt-0.5 h-4 w-4 shrink-0 text-secondary-600" />
                {t('schedule.bullet1')}
              </li>
              <li className="flex items-start gap-2 rounded-lg border border-slate-100 bg-white px-3 py-2.5">
                <CheckCircleIcon className="mt-0.5 h-4 w-4 shrink-0 text-secondary-600" />
                {t('schedule.bullet2')}
              </li>
              <li className="flex items-start gap-2 rounded-lg border border-slate-100 bg-white px-3 py-2.5">
                <CheckCircleIcon className="mt-0.5 h-4 w-4 shrink-0 text-secondary-600" />
                {t('schedule.bullet3')}
              </li>
            </ul>
            <p className="mt-5 text-[11px] text-slate-400">{t('schedule.footnote')}</p>
            <Button size="sm" variant="outline" className="mt-4" onClick={() => selectTab('meds')}>
              {t('schedule.backToMeds')}
            </Button>
          </div>
        </section>
      ) : null}

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
