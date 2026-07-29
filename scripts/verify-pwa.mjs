#!/usr/bin/env node
/**
 * Local / CI smoke checks for PWA installability (no real device required).
 * Usage: node scripts/verify-pwa.mjs [baseUrl]
 * Default baseUrl: http://127.0.0.1:3000
 */

const baseUrl = (process.argv[2] || 'http://127.0.0.1:3000').replace(/\/$/, '')

const requiredIconPaths = [
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/icons/icon-192-maskable.png',
  '/icons/icon-512-maskable.png',
  '/icons/apple-touch-icon.png',
]

async function fetchOk(path) {
  const url = `${baseUrl}${path}`
  const res = await fetch(url, { redirect: 'follow' })
  if (!res.ok) {
    throw new Error(`${path} → HTTP ${res.status}`)
  }
  return res
}

function assert(cond, msg) {
  if (!cond) throw new Error(msg)
}

async function main() {
  const errors = []
  const log = (ok, msg) => console.log(`${ok ? '✓' : '✗'} ${msg}`)

  try {
    const manifestRes = await fetchOk('/manifest.webmanifest')
    const ct = manifestRes.headers.get('content-type') || ''
    assert(
      ct.includes('application/manifest') || ct.includes('application/json') || ct.includes('text/json'),
      `manifest content-type unexpected: ${ct}`,
    )
    const manifest = await manifestRes.json()
    assert(manifest.name, 'manifest.name missing')
    assert(manifest.short_name, 'manifest.short_name missing')
    assert(manifest.start_url, 'manifest.start_url missing')
    assert(manifest.display === 'standalone', `manifest.display should be standalone, got ${manifest.display}`)
    assert(manifest.theme_color, 'manifest.theme_color missing')
    assert(Array.isArray(manifest.icons) && manifest.icons.length >= 2, 'manifest.icons insufficient')
    log(true, `manifest.webmanifest — ${manifest.short_name} / ${manifest.display}`)
  } catch (e) {
    errors.push(e.message)
    log(false, `manifest — ${e.message}`)
  }

  for (const path of requiredIconPaths) {
    try {
      const res = await fetchOk(path)
      const ct = res.headers.get('content-type') || ''
      assert(ct.includes('image/png') || ct.includes('octet-stream'), `${path} not PNG (${ct})`)
      log(true, path)
    } catch (e) {
      errors.push(e.message)
      log(false, e.message)
    }
  }

  try {
    const sw = await fetchOk('/sw.js')
    const text = await sw.text()
    assert(text.length > 100, 'sw.js too small')
    assert(/workbox|precache|skipWaiting/i.test(text), 'sw.js does not look like a Workbox SW')
    log(true, 'sw.js (Workbox service worker)')
  } catch (e) {
    errors.push(e.message)
    log(false, `sw.js — ${e.message}`)
  }

  try {
    await fetchOk('/~offline')
    log(true, '/~offline fallback page')
  } catch (e) {
    errors.push(e.message)
    log(false, `/~offline — ${e.message}`)
  }

  try {
    const home = await fetchOk('/')
    const html = await home.text()
    assert(
      html.includes('manifest') || html.includes('apple-mobile-web-app'),
      'home HTML missing manifest / apple-web-app hints',
    )
    log(true, 'home HTML includes PWA metadata hints')
  } catch (e) {
    errors.push(e.message)
    log(false, `home — ${e.message}`)
  }

  if (errors.length) {
    console.error(`\nPWA verify failed (${errors.length} issue(s)) against ${baseUrl}`)
    process.exit(1)
  }
  console.log(`\nPWA verify passed against ${baseUrl}`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
