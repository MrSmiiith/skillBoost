import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const todayAttempt = await db.quizAttempt.findFirst({
      where: {
        userId: session.user.id,
        createdAt: { gte: today }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({
      canPlayToday: !todayAttempt?.completed,
      lastPlayed: todayAttempt?.createdAt?.toISOString() || null,
      todayScore: todayAttempt?.score || 0,
      completed: todayAttempt?.completed || false
    })
  } catch (error) {
    console.error('Quiz status error:', error)
    return NextResponse.json({ error: 'Failed to get quiz status' }, { status: 500 })
  }
}
