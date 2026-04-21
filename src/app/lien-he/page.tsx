'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { Card } from '@/components/cards/Card'
import { Button } from '@/components/Button'
import { submitContactMessage } from '@/lib/services/contact'
import { toastError, toastSuccess } from '@/lib/utils/toast'

type ContactFormData = {
  firstName: string
  companyName: string
  email: string
  phone: string
  subject: string
  message: string
}

const initialFormData: ContactFormData = {
  firstName: '',
  companyName: '',
  email: '',
  phone: '',
  subject: '',
  message: '',
}

export default function ContactPage() {
  const [form, setForm] = useState<ContactFormData>(initialFormData)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null)

  const subjectLabel = useMemo(() => {
    switch (form.subject) {
      case 'pricing':
        return 'Thông tin giá'
      case 'support':
        return 'Hỗ trợ kỹ thuật'
      case 'partnership':
        return 'Hợp tác'
      case 'policy':
        return 'Chính sách'
      case 'demo':
        return 'Yêu cầu demo'
      default:
        return ''
    }
  }, [form.subject])

  const requestType: 'support' | 'policy' | 'other' =
    form.subject === 'policy'
      ? 'policy'
      : form.subject === 'other'
      ? 'other'
      : 'support'

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

    const fullMessage = form.companyName.trim()
      ? `Công ty: ${form.companyName.trim()}\n\n${form.message.trim()}`
      : form.message.trim()

    const result = await submitContactMessage({
      name: form.firstName.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      subject: subjectLabel || undefined,
      message: fullMessage,
      request_type: requestType,
    })

    setIsSubmitting(false)
    if (result.error) {
      setSubmitError(result.error)
      toastError(result.error)
      return
    }

    const successMessage =
      'Cảm ơn bạn đã tin tưởng lựa chọn chúng tôi. Chúng tôi sẽ phản hồi yêu cầu của bạn trong thời gian sớm nhất.'
    setSubmitSuccess(successMessage)
    toastSuccess('Gửi yêu cầu thành công. Chúng tôi sẽ phản hồi sớm nhất.')
    setForm(initialFormData)
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-primary-600">OUPharmacy</h1>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link href="/" className="text-gray-700 hover:text-primary-600 transition-colors">
                Trang chủ
              </Link>
              <Link href="/about" className="text-gray-700 hover:text-primary-600 transition-colors">
                Giới thiệu
              </Link>
              <Link href="/lien-he" className="text-primary-600 font-semibold">
                Liên hệ
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Liên hệ với chúng tôi</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Chúng tôi luôn sẵn sàng hỗ trợ và tư vấn cho bạn về giải pháp OUPharmacy System
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            <Card>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Gửi tin nhắn</h2>
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                      Họ và tên *
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={form.firstName}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Nhập họ và tên"
                    />
                  </div>
                  <div>
                    <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-2">
                      Tên công ty
                    </label>
                    <input
                      type="text"
                      id="companyName"
                      name="companyName"
                      value={form.companyName}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Nhập tên công ty"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Nhập địa chỉ email"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Số điện thoại
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Nhập số điện thoại"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    Chủ đề *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="" className="text-gray-500">Chọn chủ đề</option>
                    <option value="demo">Yêu cầu demo</option>
                    <option value="pricing">Thông tin giá</option>
                    <option value="support">Hỗ trợ kỹ thuật</option>
                    <option value="policy">Chính sách</option>
                    <option value="partnership">Hợp tác</option>
                    <option value="other">Khác</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Nội dung tin nhắn *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    value={form.message}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Nhập nội dung tin nhắn của bạn"
                  />
                </div>

                {submitError ? (
                  <p className="text-sm text-red-600">{submitError}</p>
                ) : null}
                {submitSuccess ? (
                  <p className="text-sm text-green-600">{submitSuccess}</p>
                ) : null}

                <Button size="lg" type="submit" disabled={isSubmitting} className="w-full">
                  {isSubmitting ? 'Đang gửi...' : 'Gửi tin nhắn'}
                </Button>
              </form>
            </Card>

            <div className="space-y-8">
              <Card>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Thông tin liên hệ</h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <svg className="w-6 h-6 text-primary-600 mt-1 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <div>
                      <p className="font-medium text-gray-900">Địa chỉ</p>
                      <p className="text-gray-600">123 Đường ABC, Quận 1, TP.HCM</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <svg className="w-6 h-6 text-primary-600 mt-1 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <div>
                      <p className="font-medium text-gray-900">Điện thoại</p>
                      <p className="text-gray-600">+84 123 456 789</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <svg className="w-6 h-6 text-primary-600 mt-1 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <div>
                      <p className="font-medium text-gray-900">Email</p>
                      <p className="text-gray-600">contact@oupharmacy.com</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <svg className="w-6 h-6 text-primary-600 mt-1 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <p className="font-medium text-gray-900">Giờ làm việc</p>
                      <p className="text-gray-600">Thứ 2 - Thứ 6: 8:00 - 17:00</p>
                      <p className="text-gray-600">Thứ 7: 8:00 - 12:00</p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
