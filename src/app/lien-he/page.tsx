'use client'

import { useMemo, useState } from 'react'
import { Button } from '@/components/Button'
import { ClockIcon, MailIcon, PhoneIcon } from '@/components/icons'
import {
  SupportDoc,
  SupportPanel,
  supportBodyClass,
  supportMutedClass,
  supportSectionClass,
  supportTitleClass,
} from '@/components/support/SupportDoc'
import { STORE_SUPPORT } from '@/lib/constant'
import { submitContactMessage } from '@/lib/services/contact'
import { toastError, toastSuccess } from '@/lib/utils/toast'

type ContactFormData = {
  firstName: string
  email: string
  phone: string
  subject: string
  message: string
}

const initialFormData: ContactFormData = {
  firstName: '',
  email: '',
  phone: '',
  subject: '',
  message: '',
}

const fieldClass =
  'w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20'

export default function ContactPage() {
  const [form, setForm] = useState<ContactFormData>(initialFormData)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null)

  const subjectLabel = useMemo(() => {
    switch (form.subject) {
      case 'order':
        return 'Đơn hàng / giao nhận'
      case 'medicine':
        return 'Tư vấn thuốc / sản phẩm'
      case 'complaint':
        return 'Khiếu nại'
      case 'policy':
        return 'Chính sách'
      case 'other':
        return 'Khác'
      default:
        return ''
    }
  }, [form.subject])

  const requestType: 'support' | 'policy' | 'other' =
    form.subject === 'policy' ? 'policy' : form.subject === 'other' ? 'other' : 'support'

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitError(null)
    setSubmitSuccess(null)
    setIsSubmitting(true)

    const result = await submitContactMessage({
      name: form.firstName.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      subject: subjectLabel || undefined,
      message: form.message.trim(),
      request_type: requestType,
    })

    setIsSubmitting(false)
    if (result.error) {
      setSubmitError(result.error)
      toastError(result.error)
      return
    }

    setSubmitSuccess('Cảm ơn bạn đã liên hệ. Chúng tôi sẽ phản hồi sớm nhất có thể.')
    toastSuccess('Gửi yêu cầu thành công.')
    setForm(initialFormData)
  }

  return (
    <SupportDoc activeHref="/lien-he">
      <div className="space-y-4 sm:space-y-5">
        <SupportPanel>
          <h1 className={supportTitleClass}>Liên hệ với chúng tôi</h1>
          <p className={`mt-2 max-w-2xl ${supportBodyClass}`}>
            Hỗ trợ đơn hàng, sản phẩm và chính sách tại Nhà thuốc OUPharmacy. Chọn chủ đề phù hợp để
            đội ngũ xử lý nhanh hơn.
          </p>
        </SupportPanel>

        <div className="grid gap-4 lg:grid-cols-5 lg:gap-5">
          <SupportPanel className="lg:col-span-3">
            <h2 className={`mb-4 ${supportSectionClass}`}>Gửi tin nhắn</h2>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="firstName" className="mb-1.5 block text-sm font-medium text-slate-700">
                    Họ và tên <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={form.firstName}
                    onChange={handleChange}
                    required
                    className={fieldClass}
                    placeholder="Nhập họ và tên"
                    autoComplete="name"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="mb-1.5 block text-sm font-medium text-slate-700">
                    Số điện thoại
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    className={fieldClass}
                    placeholder="Nhập số điện thoại"
                    autoComplete="tel"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-slate-700">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className={fieldClass}
                  placeholder="Nhập địa chỉ email"
                  autoComplete="email"
                />
              </div>

              <div>
                <label htmlFor="subject" className="mb-1.5 block text-sm font-medium text-slate-700">
                  Chủ đề <span className="text-red-500">*</span>
                </label>
                <select
                  id="subject"
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  required
                  className={fieldClass}
                >
                  <option value="">Chọn chủ đề</option>
                  <option value="order">Đơn hàng / giao nhận</option>
                  <option value="medicine">Tư vấn thuốc / sản phẩm</option>
                  <option value="complaint">Khiếu nại</option>
                  <option value="policy">Chính sách</option>
                  <option value="other">Khác</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-slate-700">
                  Nội dung tin nhắn <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  value={form.message}
                  onChange={handleChange}
                  required
                  className={fieldClass}
                  placeholder="Mô tả ngắn gọn vấn đề (kèm mã đơn nếu có)"
                />
              </div>

              {submitError ? <p className="text-sm text-red-600">{submitError}</p> : null}
              {submitSuccess ? <p className="text-sm text-green-700">{submitSuccess}</p> : null}

              <div className="flex justify-end pt-1">
                <Button type="submit" disabled={isSubmitting} className="min-w-[10rem]">
                  {isSubmitting ? 'Đang gửi...' : 'Gửi tin nhắn'}
                </Button>
              </div>
            </form>
          </SupportPanel>

          <div className="space-y-4 lg:col-span-2">
            <SupportPanel>
              <h2 className={`mb-4 ${supportSectionClass}`}>Thông tin liên hệ</h2>
              <ul className="space-y-4">
                <li className="flex gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-700">
                    <PhoneIcon className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-sm font-medium text-slate-900">Hotline</p>
                    <a
                      href={`tel:${STORE_SUPPORT.HOTLINE_TEL}`}
                      className="text-sm font-semibold text-primary-700 hover:underline"
                    >
                      {STORE_SUPPORT.HOTLINE_DISPLAY}
                    </a>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-700">
                    <MailIcon className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-sm font-medium text-slate-900">Email</p>
                    <p className="text-sm text-slate-600">contact@oupharmacy.com</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-700">
                    <ClockIcon className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-sm font-medium text-slate-900">Giờ hỗ trợ</p>
                    <p className="text-sm text-slate-600">Thứ 2 – Thứ 6: 8:00 – 17:00</p>
                    <p className="text-sm text-slate-600">Thứ 7: 8:00 – 12:00</p>
                  </div>
                </li>
              </ul>
            </SupportPanel>

            <SupportPanel>
              <p className="text-sm font-semibold text-slate-900">Cần đổi trả?</p>
              <p className={`mt-1 ${supportMutedClass}`}>
                Xem điều kiện và quy trình trước khi gửi yêu cầu để được xử lý nhanh hơn.
              </p>
              <a
                href="/chinh-sach-doi-tra"
                className="mt-3 inline-flex text-sm font-semibold text-primary-800 hover:underline"
              >
                Chính sách đổi trả →
              </a>
            </SupportPanel>
          </div>
        </div>
      </div>
    </SupportDoc>
  )
}
