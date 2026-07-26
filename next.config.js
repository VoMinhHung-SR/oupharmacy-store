const createNextIntlPlugin = require('next-intl/plugin')
const withPWA = require('@ducanh2912/next-pwa').default({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
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
      {
        protocol: 'https',
        hostname: 'cdn.nhathuoclongchau.com.vn',
        pathname: '/**',
      },
    ],
  },
  trailingSlash: false,
  // LAN / phone preview: scripts ship with crossorigin="anonymous" and need ACAO
  // when the page is opened via http://<lan-ip>:3000 (not only localhost).
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,HEAD,OPTIONS' },
        ],
      },
    ]
  },
}

// PWA outermost so Workbox build hooks run after next-intl plugin wrap.
module.exports = withPWA(withNextIntl(nextConfig))
