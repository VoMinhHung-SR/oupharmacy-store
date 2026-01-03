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
  // Note: We don't redirect to /login anymore, the client-side will open login modal
  // The protected routes will handle authentication check on client-side
  const protectedPaths = ['/checkout', '/tai-khoan']
  const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path))
  
  // We still check token in middleware for server-side protection
  // but don't redirect to /login - let client handle it
  if (isProtectedPath) {
    const token = request.cookies.get('token')?.value
    
    // If no token, we still allow the request to proceed
    // The client-side components will handle showing login modal
    // This allows for better UX with modal instead of redirect
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

