import { NextResponse } from 'next/server'
import { generateJSONResponse } from '@/lib/ai/client'

interface StatusCheck {
  ok: boolean
}

interface CachedStatus {
  status: 'operational' | 'maintenance'
  ai: 'online' | 'offline'
  timestamp: string
  lastCheck: number
}

// Cache the status result (in-memory, resets on server restart)
const CACHE_DURATION = 3 * 60 * 1000 // 3 minutes in milliseconds
let cachedStatus: CachedStatus | null = null

async function checkAIStatus(): Promise<CachedStatus> {
  const now = Date.now()

  try {
    const result = await generateJSONResponse<StatusCheck>(
      'Respond with exactly: {"ok": true}',
      'Status check'
    )

    if (result?.ok === true) {
      return {
        status: 'operational',
        ai: 'online',
        timestamp: new Date().toISOString(),
        lastCheck: now
      }
    }

    throw new Error('Invalid AI response')
  } catch (error) {
    console.error('[Status] AI check failed:', error)
    return {
      status: 'maintenance',
      ai: 'offline',
      timestamp: new Date().toISOString(),
      lastCheck: now
    }
  }
}

export async function GET() {
  const now = Date.now()

  // Return cached status if still valid
  if (cachedStatus && (now - cachedStatus.lastCheck) < CACHE_DURATION) {
    return NextResponse.json({
      status: cachedStatus.status,
      ai: cachedStatus.ai,
      timestamp: cachedStatus.timestamp,
      cached: true,
      nextCheck: new Date(cachedStatus.lastCheck + CACHE_DURATION).toISOString()
    })
  }

  // Fetch fresh status
  cachedStatus = await checkAIStatus()

  return NextResponse.json({
    status: cachedStatus.status,
    ai: cachedStatus.ai,
    timestamp: cachedStatus.timestamp,
    cached: false,
    nextCheck: new Date(cachedStatus.lastCheck + CACHE_DURATION).toISOString()
  })
}
