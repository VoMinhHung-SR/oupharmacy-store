import { apiPost } from '../api'


export const CONTACT_SUBMIT_PATH = '/contact/'

export interface ContactSubmissionPayload {
  name: string
  email: string
  phone?: string
  subject?: string
  message: string
  request_type?: 'support' | 'policy' | 'other'
}

export type ContactSubmitResult =
  | { data: unknown; error?: undefined }
  | { data?: undefined; error: string }

export async function submitContactMessage(
  payload: ContactSubmissionPayload
): Promise<ContactSubmitResult> {
  return submitContactMessageViaApi(payload)
}

export async function submitContactMessageViaApi(
  payload: ContactSubmissionPayload
): Promise<ContactSubmitResult> {
  const res = await apiPost<unknown>(CONTACT_SUBMIT_PATH, payload)
  if (res.error) return { error: res.error }
  return { data: res.data }
}
