import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  
  if (pathname.startsWith('/vi') || pathname.startsWith('/en')) {
    const url = request.nextUrl.clone()
    url.pathname = pathname.replace(/^\/(vi|en)/, '') || '/'
    return NextResponse.redirect(url)
  }
  
  // Protected routes - authentication
  const protectedPaths = ['/checkout', '/tai-khoan']
  const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path))
  
  if (isProtectedPath) {

    const token = request.cookies.get('token')?.value
    
    if (!token) {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('returnUrl', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/(vi|en)/:path*',
    '/checkout/:path*', // Protected checkout routes
    '/tai-khoan/:path*',  // Protected account routes
  ]
}

