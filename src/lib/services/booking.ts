import axios from 'axios'
import { STORAGE_KEY } from '@/lib/constant'

const MAIN_API_URL = process.env.NEXT_PUBLIC_MAIN_API_URL || 'http://localhost:8000'

function authHeaders(): Record<string, string> {
  if (typeof window === 'undefined') return {}
  const token = localStorage.getItem(STORAGE_KEY.TOKEN)
  return token ? { Authorization: `Bearer ${token}` } : {}
}

function errMsg(error: unknown, fallback: string): string {
  const err = error as {
    response?: { data?: { detail?: string; errMsg?: string; message?: string } }
    message?: string
  }
  return (
    err.response?.data?.errMsg ||
    err.response?.data?.detail ||
    err.response?.data?.message ||
    err.message ||
    fallback
  )
}

export type BookingDoctor = {
  profileId: number
  userId: number
  label: string
}

export type BookingPatient = {
  id: number
  first_name?: string
  last_name?: string
  email?: string
  phone_number?: string
}

export type DoctorScheduleRow = {
  id: number
  session: 'morning' | 'afternoon' | string
  is_off: boolean
  time_slots: Array<{ start_time: string; end_time: string }>
}

export type BookingSlotOption = {
  key: string
  label: string
  start: string
  end: string
  scheduleId: number
  session: string
}

export type CreatePatientInput = {
  user: number
  first_name: string
  last_name: string
  email: string
  phone_number: string
  gender?: number
  date_of_birth?: string
  address?: string
  allergies?: string
}

type ApiResult<T> = { data?: T; error?: string; status?: number }

export async function fetchBookingDoctors(): Promise<ApiResult<BookingDoctor[]>> {
  try {
    const res = await axios.get<{ doctors?: Array<Record<string, unknown>> }>(
      `${MAIN_API_URL}/common-configs/`,
      { headers: authHeaders() },
    )
    const raw = Array.isArray(res.data?.doctors) ? res.data.doctors : []
    const doctors: BookingDoctor[] = raw
      .map((row) => {
        const userDisplay = (row.user_display || {}) as Record<string, unknown>
        const userId = Number(userDisplay.id)
        if (!userId) return null
        const first = String(userDisplay.first_name || '')
        const last = String(userDisplay.last_name || '')
        const email = String(userDisplay.email || '')
        const label = [first, last].filter(Boolean).join(' ').trim() || email || `BS #${userId}`
        return {
          profileId: Number(row.id) || userId,
          userId,
          label,
        }
      })
      .filter(Boolean) as BookingDoctor[]
    return { data: doctors, status: res.status }
  } catch (error) {
    return { error: errMsg(error, 'Không tải được danh sách bác sĩ') }
  }
}

export async function fetchUserPatients(userId: number): Promise<ApiResult<BookingPatient[]>> {
  try {
    const res = await axios.get<BookingPatient[] | { results?: BookingPatient[] }>(
      `${MAIN_API_URL}/users/${userId}/get-patients/`,
      { headers: authHeaders() },
    )
    const data = Array.isArray(res.data)
      ? res.data
      : Array.isArray(res.data?.results)
        ? res.data.results
        : []
    return { data, status: res.status }
  } catch (error) {
    return { error: errMsg(error, 'Không tải được danh sách bệnh nhân') }
  }
}

export async function createPatient(input: CreatePatientInput): Promise<ApiResult<BookingPatient>> {
  try {
    const res = await axios.post<BookingPatient>(`${MAIN_API_URL}/patients/`, input, {
      headers: authHeaders(),
    })
    return { data: res.data, status: res.status }
  } catch (error) {
    return { error: errMsg(error, 'Không tạo được hồ sơ bệnh nhân') }
  }
}

export async function fetchDoctorScheduleByDate(
  date: string,
  doctorUserId: number,
): Promise<ApiResult<DoctorScheduleRow[]>> {
  try {
    const res = await axios.post<DoctorScheduleRow[]>(
      `${MAIN_API_URL}/doctor-schedules/schedule/`,
      { date, doctor: doctorUserId },
      { headers: authHeaders() },
    )
    return { data: Array.isArray(res.data) ? res.data : [], status: res.status }
  } catch (error) {
    return { error: errMsg(error, 'Không tải được lịch bác sĩ'), data: [] }
  }
}

const MORNING_HOURS = [8, 9, 10, 11]
const AFTERNOON_HOURS = [13, 14, 15, 16]

function padHour(h: number) {
  return `${String(h).padStart(2, '0')}:00:00`
}

/** Same bookable hour radios as Clinic DoctorAvailabilityTime. */
export function buildAvailableSlots(schedule: DoctorScheduleRow[]): BookingSlotOption[] {
  if (!Array.isArray(schedule) || schedule.length === 0) return []
  const out: BookingSlotOption[] = []

  const pushSession = (hours: number[], session: 'morning' | 'afternoon') => {
    for (const hour of hours) {
      const start = padHour(hour)
      const end = padHour(hour + 1)
      const scheduleItem = schedule.find((row) => row.session === session && row.is_off === false)
      if (!scheduleItem) continue
      const taken = (scheduleItem.time_slots || []).some(
        (slot) => slot.start_time === start && slot.end_time === end,
      )
      if (taken) continue
      out.push({
        key: `${session}-${start}`,
        label: `${String(hour).padStart(2, '0')}:00 – ${String(hour + 1).padStart(2, '0')}:00`,
        start,
        end,
        scheduleId: scheduleItem.id,
        session,
      })
    }
  }

  pushSession(MORNING_HOURS, 'morning')
  pushSession(AFTERNOON_HOURS, 'afternoon')
  return out
}

export async function createTimeSlot(input: {
  schedule: number
  start_time: string
  end_time: string
}): Promise<ApiResult<{ id: number }>> {
  try {
    const res = await axios.post<{ id: number }>(`${MAIN_API_URL}/time-slots/`, input, {
      headers: authHeaders(),
    })
    return { data: res.data, status: res.status }
  } catch (error) {
    return { error: errMsg(error, 'Khung giờ không khả dụng') }
  }
}

export async function createExamination(input: {
  patient: number
  time_slot: number
  description?: string
  created_date?: string
}): Promise<ApiResult<Record<string, unknown>>> {
  try {
    const body = {
      patient: input.patient,
      time_slot: input.time_slot,
      description: (input.description || '').trim(),
      ...(input.created_date ? { created_date: input.created_date } : {}),
    }
    const res = await axios.post(`${MAIN_API_URL}/examinations/`, body, {
      headers: authHeaders(),
    })
    return { data: res.data as Record<string, unknown>, status: res.status }
  } catch (error) {
    return { error: errMsg(error, 'Không tạo được phiếu khám') }
  }
}

/** Full book flow: create time slot → examination (patient already resolved). */
export async function bookExamination(input: {
  patientId: number
  description?: string
  date: string
  slot: BookingSlotOption
}): Promise<ApiResult<{ examinationId?: number }>> {
  const slotRes = await createTimeSlot({
    schedule: input.slot.scheduleId,
    start_time: input.slot.start,
    end_time: input.slot.end,
  })
  if (slotRes.error || !slotRes.data?.id) {
    return { error: slotRes.error || 'Không giữ được khung giờ' }
  }

  const examRes = await createExamination({
    patient: input.patientId,
    time_slot: slotRes.data.id,
    description: input.description,
    created_date: new Date(`${input.date}T${input.slot.start}`).toISOString(),
  })
  if (examRes.error || !examRes.data) {
    return { error: examRes.error || 'Không tạo được phiếu khám' }
  }

  const id = Number((examRes.data as { id?: number }).id)
  return { data: { examinationId: Number.isFinite(id) ? id : undefined }, status: 201 }
}
