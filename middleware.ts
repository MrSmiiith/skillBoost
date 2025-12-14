import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

const rateLimit = new Map<string, { count: number; resetTime: number }>()
const RATE_LIMIT_WINDOW = 60 * 1000
const MAX_REQUESTS = 60

function getRateLimitKey(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for')
  const ip = forwarded ? forwarded.split(',')[0] : 'unknown'
  return ip
}

function checkRateLimit(key: string): boolean {
  const now = Date.now()
  const entry = rateLimit.get(key)

  if (!entry || now > entry.resetTime) {
    rateLimit.set(key, { count: 1, resetTime: now + RATE_LIMIT_WINDOW })
    return true
  }

  if (entry.count >= MAX_REQUESTS) {
    return false
  }

  entry.count++
  return true
}

const protectedRoutes = ['/cv', '/interview', '/achievements', '/points', '/settings', '/admin']
const authRoutes = ['/login']

export async function middleware(req: NextRequest) {
  const { nextUrl } = req

  const response = NextResponse.next()

  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')

  // Rate limit API routes
  if (nextUrl.pathname.startsWith('/api/')) {
    const key = getRateLimitKey(req)

    if (!checkRateLimit(key)) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429 }
      )
    }
    return response
  }

  // Check for session token
  const useSecureCookies = process.env.NEXTAUTH_URL?.startsWith('https://')
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
    secureCookie: useSecureCookies,
    cookieName: useSecureCookies ? '__Secure-authjs.session-token' : 'authjs.session-token'
  })
  const isLoggedIn = !!token

  const isProtectedRoute = protectedRoutes.some(route =>
    nextUrl.pathname === route || nextUrl.pathname.startsWith(route + '/')
  )
  const isAuthRoute = authRoutes.includes(nextUrl.pathname)

  if (isProtectedRoute && !isLoggedIn) {
    const loginUrl = new URL('/login', nextUrl)
    loginUrl.searchParams.set('callbackUrl', nextUrl.pathname)
    return NextResponse.redirect(loginUrl)
  }

  if (isAuthRoute && isLoggedIn) {
    return NextResponse.redirect(new URL('/cv', nextUrl))
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|api/auth|.*\\.svg|.*\\.png|.*\\.jpg).*)',
  ],
}
