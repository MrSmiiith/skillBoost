import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { addPoints } from '@/lib/utils/points'
import { checkAndAwardAchievements } from '@/lib/utils/achievements'

export async function POST() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const attempt = await db.quizAttempt.findFirst({
      where: {
        userId: session.user.id,
        createdAt: { gte: today },
        completed: false
      }
    })

    if (!attempt) {
      return NextResponse.json({ error: 'No active quiz found' }, { status: 404 })
    }

    await db.quizAttempt.update({
      where: { id: attempt.id },
      data: { completed: true }
    })

    // 1 point for every 5 correct answers
    const pointsEarned = Math.floor(attempt.score / 5)

    if (pointsEarned > 0) {
      await addPoints(session.user.id, pointsEarned)
    }

    // Check for new achievements
    const newAchievements = await checkAndAwardAchievements(session.user.id)

    return NextResponse.json({
      score: attempt.score,
      pointsEarned,
      newAchievements
    })
  } catch (error) {
    console.error('Quiz complete error:', error)
    return NextResponse.json({ error: 'Failed to complete quiz' }, { status: 500 })
  }
}
