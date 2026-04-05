import { apiPost } from '../api'


export const CONTACT_SUBMIT_PATH = '/contact/'

export interface ContactSubmissionPayload {
  name: string
  email: string
  phone?: string
  subject?: string
  message: string
}

export type ContactSubmitResult =
  | { data: unknown; error?: undefined }
  | { data?: undefined; error: string }

export async function submitContactMessage(
  _payload: ContactSubmissionPayload
): Promise<ContactSubmitResult> {
  return {
    error:
      'Yêu cầu thất bại. Vui lòng liên hệ hỗ trợ hoặc thử lại sau.',
  }
}

export async function submitContactMessageViaApi(
  payload: ContactSubmissionPayload
): Promise<ContactSubmitResult> {
  const res = await apiPost<unknown>(CONTACT_SUBMIT_PATH, payload)
  if (res.error) return { error: res.error }
  return { data: res.data }
}
