'use client'

import Link from 'next/link'
import { Container } from '@/components/Container'
import { Button } from '@/components/Button'
import { EMAIL_SUPPORT } from '@/lib/constant'

export function NotFoundContent() {
  return (
    <div className="min-h-[50vh] sm:min-h-[60vh] bg-gradient-to-b from-blue-50 to-white flex items-center justify-center py-4 sm:py-6 px-4">
      <Container className="text-center">
        <div className="max-w-xl mx-auto space-y-4 sm:space-y-5">
          {/* Illustration */}
          <div className="relative flex justify-center items-center">
            <div className="relative">
              {/* Robot Character */}
              <div className="relative z-10">
                <svg
                  width="140"
                  height="140"
                  viewBox="0 0 200 200"
                  className="mx-auto"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Robot Body */}
                  <rect
                    x="50"
                    y="60"
                    width="100"
                    height="120"
                    rx="10"
                    fill="#3B82F6"
                    stroke="#2563EB"
                    strokeWidth="2"
                  />
                  {/* Robot Head */}
                  <rect
                    x="60"
                    y="20"
                    width="80"
                    height="50"
                    rx="8"
                    fill="#3B82F6"
                    stroke="#2563EB"
                    strokeWidth="2"
                  />
                  {/* Eyes */}
                  <circle cx="85" cy="40" r="6" fill="white" />
                  <circle cx="115" cy="40" r="6" fill="white" />
                  {/* Mouth */}
                  <path
                    d="M 85 55 Q 100 60 115 55"
                    stroke="white"
                    strokeWidth="3"
                    strokeLinecap="round"
                    fill="none"
                  />
                  {/* Lab Coat */}
                  <rect
                    x="55"
                    y="100"
                    width="90"
                    height="80"
                    rx="5"
                    fill="white"
                    stroke="#2563EB"
                    strokeWidth="2"
                  />
                  {/* Lab Coat Collar */}
                  <path
                    d="M 70 100 L 100 110 L 130 100"
                    stroke="#2563EB"
                    strokeWidth="2"
                    fill="none"
                  />
                  {/* Buttons */}
                  <circle cx="100" cy="125" r="4" fill="#3B82F6" />
                  <circle cx="100" cy="145" r="4" fill="#3B82F6" />
                  {/* Alert Icon */}
                  <circle
                    cx="160"
                    cy="80"
                    r="20"
                    fill="#EF4444"
                    className="absolute"
                  />
                  <path
                    d="M 160 70 L 160 85 M 160 90 L 160 90"
                    stroke="white"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              
              {/* City Buildings Background */}
              <div className="absolute left-0 top-1/2 transform -translate-y-1/2 opacity-30">
                <svg
                  width="70"
                  height="60"
                  viewBox="0 0 120 100"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Building 1 */}
                  <rect x="10" y="30" width="25" height="70" fill="#93C5FD" />
                  <rect x="12" y="32" width="21" height="15" fill="#DBEAFE" />
                  <rect x="12" y="50" width="21" height="15" fill="#DBEAFE" />
                  
                  {/* Building 2 */}
                  <rect x="40" y="20" width="30" height="80" fill="#93C5FD" />
                  <rect x="42" y="22" width="26" height="18" fill="#DBEAFE" />
                  <rect x="42" y="43" width="26" height="18" fill="#DBEAFE" />

                  
                  {/* Building 3 */}
                  <rect x="75" y="40" width="20" height="60" fill="#93C5FD" />
                  <rect x="77" y="42" width="16" height="12" fill="#DBEAFE" />
                  <rect x="77" y="57" width="16" height="12" fill="#DBEAFE" />
                </svg>
              </div>
            </div>
          </div>

          {/* Error Message */}
          <div className="space-y-2 sm:space-y-3 px-2 sm:px-0">
            <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-blue-900 leading-tight">
              Đường dẫn đã hết hạn truy cập hoặc không tồn tại
            </h1>
            <p className="text-sm sm:text-base text-gray-700">
              Quý khách có thể liên hệ admin để được hỗ trợ{' '}
              <a
                href={`mailto:${EMAIL_SUPPORT}`}
                className="text-blue-600 hover:text-blue-800 font-semibold underline break-words"
              >
                tại đây
              </a>
            </p>
          </div>

          {/* Call to Action */}
          <div className="pt-1 sm:pt-2">
            <Link href="/">
              <Button
                variant="primary"
                size="md"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 sm:px-6 text-sm sm:text-base w-full sm:w-auto"
              >
                Về trang chủ
              </Button>
            </Link>
          </div>
        </div>
      </Container>
    </div>
  )
}
