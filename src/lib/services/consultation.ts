import { apiGet, apiPatch, apiPost, type ApiResponse } from '@/lib/api'

export const CONSULTATION_SESSIONS_PATH = '/consultation-sessions/'

export type ConsultationSessionStatus =
  | 'WAITING_FOR_PROFESSIONAL'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED'

export type ConsultationSession = {
  id: number
  user_id: number
  pharmacist_id: number | null
  status: ConsultationSessionStatus
  firestore_conversation_id: string
  need_text: string
  context_json: Record<string, unknown>
  created_date: string
  updated_date: string
  active: boolean
}

export type CreateConsultationSessionInput = {
  need_text?: string
  context_json?: Record<string, unknown>
  firestore_conversation_id?: string
}

export async function createConsultationSession(
  input: CreateConsultationSessionInput = {},
): Promise<ApiResponse<ConsultationSession>> {
  return apiPost<ConsultationSession>(CONSULTATION_SESSIONS_PATH, input)
}

export async function listConsultationSessions(params?: {
  scope?: 'mine' | 'queue'
  status?: ConsultationSessionStatus
}): Promise<ApiResponse<ConsultationSession[]>> {
  const search = new URLSearchParams()
  if (params?.scope) search.set('scope', params.scope)
  if (params?.status) search.set('status', params.status)
  const qs = search.toString()
  return apiGet<ConsultationSession[]>(`${CONSULTATION_SESSIONS_PATH}${qs ? `?${qs}` : ''}`)
}

export async function patchConsultationSession(
  id: number,
  data: Partial<Pick<ConsultationSession, 'firestore_conversation_id' | 'need_text' | 'context_json'>>,
): Promise<ApiResponse<ConsultationSession>> {
  return apiPatch<ConsultationSession>(`${CONSULTATION_SESSIONS_PATH}${id}/`, data)
}

export async function completeConsultationSession(
  id: number,
): Promise<ApiResponse<ConsultationSession>> {
  return apiPost<ConsultationSession>(`${CONSULTATION_SESSIONS_PATH}${id}/complete/`, {})
}

export async function cancelConsultationSession(
  id: number,
): Promise<ApiResponse<ConsultationSession>> {
  return apiPost<ConsultationSession>(`${CONSULTATION_SESSIONS_PATH}${id}/cancel/`, {})
}
