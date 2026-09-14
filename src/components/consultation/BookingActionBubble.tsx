'use client'

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/Button'
import { useAuth } from '@/contexts/AuthContext'
import { useLoginModal } from '@/contexts/LoginModalContext'
import { getClinicBookingUrl } from '@/lib/siteUrls'
import {
  bookExamination,
  buildAvailableSlots,
  createPatient,
  fetchBookingDoctors,
  fetchDoctorScheduleByDate,
  fetchUserPatients,
  type BookingDoctor,
  type BookingPatient,
  type BookingSlotOption,
} from '@/lib/services/booking'

type BookingActionBubbleProps = {
  onBack: () => void
}

type Phase = 'form' | 'submitting' | 'success' | 'error'

function patientLabel(p: BookingPatient): string {
  const name = [p.first_name, p.last_name].filter(Boolean).join(' ').trim()
  return name || p.email || `BN #${p.id}`
}

function todayIsoDate(): string {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function BookingActionBubble({ onBack }: BookingActionBubbleProps) {
  const t = useTranslations('consultation.branch.doctor')
  const tRoot = useTranslations('consultation')
  const { user, isAuthenticated, loading: authLoading } = useAuth()
  const { openModal } = useLoginModal()

  const [phase, setPhase] = useState<Phase>('form')
  const [error, setError] = useState<string | null>(null)
  const [examId, setExamId] = useState<number | undefined>()

  const [doctors, setDoctors] = useState<BookingDoctor[]>([])
  const [patients, setPatients] = useState<BookingPatient[]>([])
  const [slots, setSlots] = useState<BookingSlotOption[]>([])
  const [loadingMeta, setLoadingMeta] = useState(false)
  const [loadingSlots, setLoadingSlots] = useState(false)

  const [description, setDescription] = useState('')
  const [doctorUserId, setDoctorUserId] = useState<number | ''>('')
  const [date, setDate] = useState(todayIsoDate())
  const [slotKey, setSlotKey] = useState('')
  const [patientId, setPatientId] = useState<number | 'new' | ''>('')
  const [newPatient, setNewPatient] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
  })

  const bookingFallbackUrl = useMemo(() => getClinicBookingUrl(), [])
  const selectedSlot = useMemo(
    () => slots.find((s) => s.key === slotKey) || null,
    [slots, slotKey],
  )

  useEffect(() => {
    if (authLoading) return
    if (!isAuthenticated || !user) {
      openModal()
      return
    }

    let cancelled = false
    setLoadingMeta(true)
    ;(async () => {
      const [docRes, patRes] = await Promise.all([
        fetchBookingDoctors(),
        fetchUserPatients(user.id),
      ])
      if (cancelled) return
      if (docRes.error) setError(docRes.error)
      setDoctors(docRes.data || [])
      const list = patRes.data || []
      setPatients(list)
      if (list.length === 1) setPatientId(list[0].id)
      setNewPatient((prev) => ({
        ...prev,
        first_name: prev.first_name || user.first_name || '',
        last_name: prev.last_name || user.last_name || '',
        email: prev.email || user.email || '',
        phone_number: prev.phone_number || user.phone_number || '',
      }))
      setLoadingMeta(false)
    })()

    return () => {
      cancelled = true
    }
  }, [authLoading, isAuthenticated, user, openModal])

  useEffect(() => {
    if (!doctorUserId || !date) {
      setSlots([])
      setSlotKey('')
      return
    }
    let cancelled = false
    setLoadingSlots(true)
    setSlotKey('')
    ;(async () => {
      const res = await fetchDoctorScheduleByDate(date, Number(doctorUserId))
      if (cancelled) return
      if (res.error) {
        setSlots([])
        setError(res.error)
      } else {
        setError(null)
        setSlots(buildAvailableSlots(res.data || []))
      }
      setLoadingSlots(false)
    })()
    return () => {
      cancelled = true
    }
  }, [doctorUserId, date])

  const resolvePatientId = useCallback(async (): Promise<number | null> => {
    if (!user) return null
    if (patientId === 'new') {
      const email = newPatient.email.trim()
      if (!newPatient.first_name.trim() || !email || !newPatient.phone_number.trim()) {
        setError(t('patientRequired'))
        return null
      }
      const created = await createPatient({
        user: user.id,
        first_name: newPatient.first_name.trim(),
        last_name: newPatient.last_name.trim(),
        email,
        phone_number: newPatient.phone_number.trim(),
      })
      if (created.error || !created.data?.id) {
        setError(created.error || t('errorGeneric'))
        return null
      }
      setPatients((prev) => [...prev, created.data!])
      setPatientId(created.data.id)
      return created.data.id
    }
    if (typeof patientId === 'number') return patientId
    setError(t('patientRequired'))
    return null
  }, [user, patientId, newPatient, t])

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!isAuthenticated || !user) {
      openModal()
      return
    }
    if (!doctorUserId || !date || !selectedSlot) {
      setError(t('slotRequired'))
      return
    }

    setPhase('submitting')
    const resolvedPatient = await resolvePatientId()
    if (!resolvedPatient) {
      setPhase('error')
      return
    }

    const res = await bookExamination({
      patientId: resolvedPatient,
      description,
      date,
      slot: selectedSlot,
    })

    if (res.error || !res.data) {
      setError(res.error || t('errorGeneric'))
      setPhase('error')
      return
    }
    setExamId(res.data.examinationId)
    setPhase('success')
  }

  if (authLoading) {
    return <p className="text-sm text-slate-600">{t('loading')}</p>
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="flex flex-col gap-3">
        <p className="text-sm font-semibold text-slate-900">{t('title')}</p>
        <p className="text-sm text-slate-600">{t('loginRequired')}</p>
        <div className="flex flex-wrap gap-2">
          <Button type="button" size="sm" onClick={() => openModal()}>
            {t('loginCta')}
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={onBack}>
            {tRoot('backToMenu')}
          </Button>
        </div>
        <a
          href={bookingFallbackUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-primary-700 underline"
        >
          {t('fallbackLink')}
        </a>
      </div>
    )
  }

  if (phase === 'success') {
    return (
      <div className="flex flex-col gap-3">
        <p className="text-sm font-semibold text-slate-900">{t('title')}</p>
        <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-900">
          {examId ? t('successWithId', { id: examId }) : t('success')}
        </p>
        <Button type="button" variant="outline" size="sm" onClick={onBack} className="self-start">
          {tRoot('backToMenu')}
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-sm font-semibold text-slate-900">{t('title')}</p>
          <p className="text-xs text-slate-500">{t('hint')}</p>
        </div>
        <Button type="button" variant="outline" size="sm" onClick={onBack}>
          {tRoot('backToMenu')}
        </Button>
      </div>

      {(phase === 'error' || error) && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
          <p>{error || t('errorGeneric')}</p>
          <a
            href={bookingFallbackUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 inline-block text-xs font-medium underline"
          >
            {t('fallbackLink')}
          </a>
        </div>
      )}

      <form className="flex flex-col gap-2.5" onSubmit={onSubmit}>
        <label className="flex flex-col gap-1 text-xs text-slate-600">
          {t('descriptionLabel')}
          <textarea
            value={description}
            onChange={(ev) => setDescription(ev.target.value)}
            rows={2}
            maxLength={254}
            placeholder={t('descriptionPlaceholder')}
            className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-sm text-slate-900 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          />
        </label>

        <label className="flex flex-col gap-1 text-xs text-slate-600">
          {t('doctorLabel')}
          <select
            value={doctorUserId === '' ? '' : String(doctorUserId)}
            onChange={(ev) =>
              setDoctorUserId(ev.target.value ? Number(ev.target.value) : '')
            }
            disabled={loadingMeta || doctors.length === 0}
            required
            className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-sm text-slate-900 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          >
            <option value="">{loadingMeta ? t('loading') : t('doctorPlaceholder')}</option>
            {doctors.map((d) => (
              <option key={d.userId} value={d.userId}>
                {d.label}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1 text-xs text-slate-600">
          {t('dateLabel')}
          <input
            type="date"
            value={date}
            min={todayIsoDate()}
            onChange={(ev) => setDate(ev.target.value)}
            required
            className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-sm text-slate-900 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          />
        </label>

        <fieldset className="flex flex-col gap-1.5">
          <legend className="text-xs text-slate-600">{t('slotLabel')}</legend>
          {loadingSlots ? (
            <p className="text-xs text-slate-500">{t('loadingSlots')}</p>
          ) : !doctorUserId ? (
            <p className="text-xs text-slate-500">{t('pickDoctorFirst')}</p>
          ) : slots.length === 0 ? (
            <p className="text-xs text-slate-500">{t('noSlots')}</p>
          ) : (
            <div className="grid max-h-36 grid-cols-2 gap-1.5 overflow-y-auto">
              {slots.map((s) => {
                const selected = s.key === slotKey
                return (
                  <button
                    key={s.key}
                    type="button"
                    onClick={() => setSlotKey(s.key)}
                    className={`rounded-lg border px-2 py-1.5 text-left text-xs ${
                      selected
                        ? 'border-primary-600 bg-primary-50 text-primary-800'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-primary-300'
                    }`}
                  >
                    {s.label}
                  </button>
                )
              })}
            </div>
          )}
        </fieldset>

        <label className="flex flex-col gap-1 text-xs text-slate-600">
          {t('patientLabel')}
          <select
            value={patientId === '' ? '' : String(patientId)}
            onChange={(ev) => {
              const v = ev.target.value
              if (v === 'new') setPatientId('new')
              else if (v) setPatientId(Number(v))
              else setPatientId('')
            }}
            required
            className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-sm text-slate-900 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          >
            <option value="">{t('patientPlaceholder')}</option>
            {patients.map((p) => (
              <option key={p.id} value={p.id}>
                {patientLabel(p)}
              </option>
            ))}
            <option value="new">{t('patientNew')}</option>
          </select>
        </label>

        {patientId === 'new' ? (
          <div className="grid grid-cols-2 gap-2">
            <input
              value={newPatient.first_name}
              onChange={(ev) => setNewPatient((p) => ({ ...p, first_name: ev.target.value }))}
              placeholder={t('firstName')}
              required
              className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-sm"
            />
            <input
              value={newPatient.last_name}
              onChange={(ev) => setNewPatient((p) => ({ ...p, last_name: ev.target.value }))}
              placeholder={t('lastName')}
              className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-sm"
            />
            <input
              type="email"
              value={newPatient.email}
              onChange={(ev) => setNewPatient((p) => ({ ...p, email: ev.target.value }))}
              placeholder={t('email')}
              required
              className="col-span-2 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-sm"
            />
            <input
              value={newPatient.phone_number}
              onChange={(ev) => setNewPatient((p) => ({ ...p, phone_number: ev.target.value }))}
              placeholder={t('phone')}
              required
              className="col-span-2 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-sm"
            />
          </div>
        ) : null}

        <Button
          type="submit"
          size="sm"
          disabled={phase === 'submitting' || loadingMeta || !selectedSlot}
          className="self-start"
        >
          {phase === 'submitting' ? t('submitting') : t('submit')}
        </Button>
      </form>
    </div>
  )
}
