// middleware for rate limiting messages sent to the chat API
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { rateLimiter } from '@/lib/rate-limiter'

export async function middleware(req: NextRequest) {
  const ip = req.ip ?? '127.0.0.1'

  console.log(`Incoming request from IP: ${ip}`)

  try {
    const { success } = await rateLimiter.limit(ip)

    if (!success) {
      console.log(`Rate limit exceeded for IP: ${ip}`)
      return new NextResponse('You are writing messages too fast.')
    } 

    console.log(`Rate limit passed for IP: ${ip}`)
    return NextResponse.next()

  } catch (error) {
    console.log(`Error processing message from IP: ${ip}: ${error}`)
    return new NextResponse(
      'Sorry, something went wrong processing your message. Please try again later.'
    )
  }
}

export const config = {
  matcher: '/api/message/:path*',
}
