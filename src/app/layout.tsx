import { Suspense } from 'react'
import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import './globals.css'
import StoreNavShell from '@/layouts/StoreNavShell'
import { StoreNavFallback } from '@/layouts/StoreNavFallback'
import Footer from '@/layouts/Footer'
import { CartProvider } from '@/contexts/CartContext'
import { AuthProvider } from '@/contexts/AuthContext'
import { WishlistProvider } from '@/contexts/WishlistContext'
import dynamic from 'next/dynamic'
import { LoginModalProvider } from '@/contexts/LoginModalContext'
import { ConsultUiProvider } from '@/contexts/ConsultUiContext'
import { PwaServiceWorkerRegister } from '@/components/pwa/PwaServiceWorkerRegister'
import { ChunkLoadRecovery } from '@/components/pwa/ChunkLoadRecovery'
import { Providers } from './providers'
import { fetchCommonCitiesServer } from '@/lib/services/location.server'
import { JsonLd } from '@/components/seo/JsonLd'
import { getSiteOrigin } from '@/lib/siteUrls'

const inter = Inter({ subsets: ['latin', 'vietnamese'] })

/** Login/consult off critical path. */
const LoginModal = dynamic(
  () =>
    import('@/components/modals/LoginModal').then((m) => ({ default: m.LoginModal })),
  { ssr: false }
)
const ConsultChatbox = dynamic(
  () =>
    import('@/components/consultation/ConsultChatbox').then((m) => ({
      default: m.ConsultChatbox,
    })),
  { ssr: false }
)

const APP_NAME = 'OUPharmacy'
const APP_TITLE = 'OUPharmacy Store'
const APP_DESCRIPTION = 'Nhà thuốc OUPharmacy — mua thuốc, tư vấn và đặt hàng trực tuyến'
const SITE_ORIGIN = getSiteOrigin()

export const metadata: Metadata = {
  metadataBase: new URL(SITE_ORIGIN),
  applicationName: APP_NAME,
  title: APP_TITLE,
  description: APP_DESCRIPTION,
  manifest: '/manifest.webmanifest',
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    siteName: APP_NAME,
    title: APP_TITLE,
    description: APP_DESCRIPTION,
    url: SITE_ORIGIN,
  },
  twitter: {
    card: 'summary_large_image',
    title: APP_TITLE,
    description: APP_DESCRIPTION,
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: APP_NAME,
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: [
      { url: '/assets/logo_oupharmacy.ico', sizes: 'any' },
      { url: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    shortcut: '/assets/logo_oupharmacy.ico',
    apple: [{ url: '/icons/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
}

export const viewport: Viewport = {
  themeColor: '#0369a1',
  viewportFit: 'cover',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const messages = await getMessages()
  const { cities: initialCities, error: initialCitiesError } = await fetchCommonCitiesServer()

  const organizationLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: APP_NAME,
    url: SITE_ORIGIN,
    logo: `${SITE_ORIGIN}/icons/icon-512.png`,
    description: APP_DESCRIPTION,
  }

  return (
    <html lang="vi" className="h-full">
      <body className={`${inter.className} flex min-h-full flex-col overflow-x-hidden bg-[#ededed]`}>
        <JsonLd data={organizationLd} />
        <NextIntlClientProvider messages={messages}>
          <Providers initialCities={initialCities} initialCitiesError={initialCitiesError}>
            <AuthProvider>
              <LoginModalProvider>
                <ConsultUiProvider>
                  <CartProvider>
                    <WishlistProvider>
                      <ChunkLoadRecovery />
                      <Suspense fallback={<StoreNavFallback />}>
                        <StoreNavShell />
                      </Suspense>
                      <main className="relative z-0 flex min-h-0 w-full flex-1 flex-col border-0 bg-[#ededed]">
                        {children}
                      </main>
                      <Footer />
                      <LoginModal />
                      <Suspense fallback={null}>
                        <ConsultChatbox />
                      </Suspense>
                      <PwaServiceWorkerRegister />
                    </WishlistProvider>
                  </CartProvider>
                </ConsultUiProvider>
              </LoginModalProvider>
            </AuthProvider>
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
