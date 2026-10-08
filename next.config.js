const createNextIntlPlugin = require('next-intl/plugin')

/** Opt-in only — set NEXT_PUBLIC_ENABLE_PWA=true in container/staging/production. */
const enablePwa = process.env.NEXT_PUBLIC_ENABLE_PWA === 'true'

const withPWA = require('@ducanh2912/next-pwa').default({
  dest: 'public',
  disable: !enablePwa,
  // Custom client register — auto-register crashes on http://LAN-IP (no secure context).
  register: false,
  // Keep Workbox defaults (static CacheFirst, etc.) and append overrides below.
  extendDefaultRuntimeCaching: true,
  workboxOptions: {
    disableDevLogs: true,
    runtimeCaching: [
      {
        // Prefer fresh SSR HTML for catalog/cart/checkout.
        urlPattern: ({ request }) => request.destination === 'document',
        handler: 'NetworkFirst',
        options: {
          cacheName: 'documents',
          networkTimeoutSeconds: 10,
          expiration: {
            maxEntries: 32,
            maxAgeSeconds: 60 * 60,
          },
        },
      },
      {
        // Never cache auth / store API responses in the SW.
        urlPattern: ({ url }) =>
          url.pathname.startsWith('/api/') ||
          url.pathname.includes('/auth') ||
          /\/api\/store\//.test(url.pathname),
        handler: 'NetworkOnly',
        options: {
          cacheName: 'api-bypass',
        },
      },
    ],
  },
})

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
      // Catalog packshots from import pipeline (legacy host in store DB until Cloudinary cutover).
      {
        protocol: 'https',
        hostname: 'cdn.nhathuoclongchau.com.vn',
        pathname: '/**',
      },
    ],
  },
  trailingSlash: false,
  async redirects() {
    return [
      {
        source: '/tu-thuoc-thong-minh',
        destination: '/tai-khoan/tu-thuoc',
        permanent: false,
      },
      {
        source: '/nhac-uong-thuoc',
        destination: '/tai-khoan/tu-thuoc?tab=lich-uong-thuoc',
        permanent: true,
      },
      {
        source: '/about',
        destination: '/gioi-thieu',
        permanent: true,
      },
      {
        source: '/register',
        destination: '/dang-ky',
        permanent: true,
      },
      {
        source: '/forgot-password',
        destination: '/quen-mat-khau',
        permanent: true,
      },
      {
        source: '/products',
        destination: '/tim-kiem',
        permanent: true,
      },
      {
        source: '/tiem-vac-xin',
        destination: '/tro-giup',
        permanent: true,
      },
      {
        source: '/tra-cuu-thuoc-chinh-hang',
        destination: '/tro-giup',
        permanent: true,
      },
      {
        source: '/tim-nha-thuoc',
        destination: '/tro-giup',
        permanent: true,
      },
    ]
  },
  async headers() {
    const security = [
      {
        key: 'Content-Security-Policy-Report-Only',
        value: [
          "default-src 'self'",
          "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.googleapis.com https://*.gstatic.com https://www.googletagmanager.com https://apis.google.com",
          "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
          "img-src 'self' data: blob: https: http:",
          "font-src 'self' data: https://fonts.gstatic.com",
          "connect-src 'self' http://localhost:* http://127.0.0.1:* https: wss: ws:",
          "frame-src 'self' https://*.firebaseapp.com https://accounts.google.com https://www.google.com",
          "object-src 'none'",
          "base-uri 'self'",
          "form-action 'self'",
        ].join('; '),
      },
      { key: 'X-Frame-Options', value: 'DENY' },
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
    ]

    // LAN / phone preview only — scripts need ACAO when opened via http://<lan-ip>:3000.
    const lanCors =
      process.env.NODE_ENV !== 'production'
        ? [
            { key: 'Access-Control-Allow-Origin', value: '*' },
            { key: 'Access-Control-Allow-Methods', value: 'GET,HEAD,OPTIONS' },
          ]
        : []

    return [
      {
        source: '/:path*',
        headers: [...security, ...lanCors],
      },
    ]
  },
}

// PWA outermost so Workbox build hooks run after next-intl plugin wrap.
module.exports = withPWA(withNextIntl(nextConfig))
