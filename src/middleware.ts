import { NextRequest, NextResponse } from 'next/server'
import { getUrl } from './lib/get-url'

export function middleware(request: NextRequest) {
   const {url, cookies, nextUrl} = request
  const token = cookies.get('authjs.session-token')
  const authURL = new URL(getUrl('/auth'))
  const mainURL = new URL(getUrl('/'))
   const isLoginPage = nextUrl.pathname.startsWith("/auth")

   if (isLoginPage && token) {
      return NextResponse.redirect(mainURL)
    }
  
    if (!isLoginPage && !token) {
      return NextResponse.redirect(authURL)
    }
  }



export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}