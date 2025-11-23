// Middleware: Redirect /vi và /en về / (chỉ dùng tiếng Việt)
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  
  if (pathname.startsWith('/vi') || pathname.startsWith('/en')) {
    const url = request.nextUrl.clone()
    url.pathname = pathname.replace(/^\/(vi|en)/, '') || '/'
    return NextResponse.redirect(url)
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: ['/(vi|en)/:path*']
}

