import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { checkAndResetDailyPoints } from '@/lib/utils/points'
import { checkAndAwardAchievements } from '@/lib/utils/achievements'

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await checkAndResetDailyPoints(session.user.id)

    // Check for achievements in background (newbie, time-based, etc.)
    checkAndAwardAchievements(session.user.id).catch(console.error)

    // Fetch fresh data from database (not cached session)
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        email: true,
        name: true,
        image: true,
        role: true,
        points: true,
        dailyUsage: true
      }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error('Error fetching user:', error)
    return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 })
  }
}
