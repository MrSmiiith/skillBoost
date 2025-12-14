import { db } from '@/lib/db'

const DAILY_POINTS = 5
const RESET_HOURS = 24

export async function checkAndResetDailyPoints(userId: string) {
  const user = await db.user.findUnique({
    where: { id: userId },
    select: { lastReset: true, dailyUsage: true, points: true }
  })

  if (!user) return null

  const now = new Date()
  const lastReset = new Date(user.lastReset)
  const hoursSinceReset = (now.getTime() - lastReset.getTime()) / (1000 * 60 * 60)

  if (hoursSinceReset >= RESET_HOURS) {
    await db.user.update({
      where: { id: userId },
      data: {
        dailyUsage: 0,
        lastReset: now,
        points: user.points + DAILY_POINTS
      }
    })
    return { reset: true, points: user.points + DAILY_POINTS }
  }

  return { reset: false, points: user.points }
}

export async function deductPoints(userId: string, amount: number = 1): Promise<{ success: boolean; error?: string; remaining?: number }> {
  try {
    await checkAndResetDailyPoints(userId)

    const user = await db.user.findUnique({
      where: { id: userId },
      select: { points: true, dailyUsage: true }
    })

    if (!user) {
      return { success: false, error: 'User not found' }
    }

    if (user.points < amount) {
      return { success: false, error: `Insufficient points. Need ${amount}, have ${user.points}` }
    }

    const updated = await db.user.update({
      where: { id: userId },
      data: {
        points: { decrement: amount },
        dailyUsage: { increment: 1 }
      }
    })

    return { success: true, remaining: updated.points }
  } catch (error) {
    console.error(`[Points] Error deducting points for user ${userId}:`, error)
    return { success: false, error: 'Failed to deduct points' }
  }
}

// Legacy function for backwards compatibility
export async function deductPoint(userId: string): Promise<{ success: boolean; error?: string }> {
  return deductPoints(userId, 1)
}

export async function addPoints(userId: string, amount: number): Promise<void> {
  await db.user.update({
    where: { id: userId },
    data: { points: { increment: amount } }
  })
}
