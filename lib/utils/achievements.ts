import { db } from '@/lib/db'

interface AchievementCondition {
  type: string
  value: number
}

export async function checkAndAwardAchievements(userId: string): Promise<string[]> {
  const awarded: string[] = []

  // Get user data
  const user = await db.user.findUnique({
    where: { id: userId },
    include: {
      cvVersions: true,
      interviews: { where: { status: 'COMPLETED' } },
      pointRequests: { where: { status: 'APPROVED' } },
      achievements: true,
      quizAttempts: { where: { completed: true } }
    }
  })

  if (!user) return awarded

  // Get all achievements
  const allAchievements = await db.achievement.findMany()

  // Get already earned achievement codes
  const earnedCodes = user.achievements.map(a => a.achievementId)
  const earnedAchievements = await db.achievement.findMany({
    where: { id: { in: earnedCodes } }
  })
  const earnedCodesSet = new Set(earnedAchievements.map(a => a.code))

  for (const achievement of allAchievements) {
    // Skip if already earned
    if (earnedCodesSet.has(achievement.code)) continue

    const condition = achievement.condition as AchievementCondition
    let shouldAward = false

    switch (condition.type) {
      case 'signup':
        // Always award on first check (user exists)
        shouldAward = true
        break

      case 'cv_count':
        shouldAward = user.cvVersions.length >= condition.value
        break

      case 'cv_score':
        // Check if any CV has this score or higher
        shouldAward = user.cvVersions.some(cv => {
          const scores = cv.scores as { overall?: number } | null
          return scores?.overall && scores.overall >= condition.value
        })
        break

      case 'interview_count':
        shouldAward = user.interviews.length >= condition.value
        break

      case 'interview_types':
        const types = new Set(user.interviews.map(i => i.type))
        shouldAward = types.size >= condition.value
        break

      case 'interview_avg':
        if (user.interviews.length > 0) {
          const scores = user.interviews.map(i => {
            const summary = i.summary as { overallScore?: number } | null
            return summary?.overallScore || 0
          })
          const avg = scores.reduce((a, b) => a + b, 0) / scores.length
          shouldAward = avg >= condition.value
        }
        break

      case 'quiz_count':
        shouldAward = user.quizAttempts.length >= condition.value
        break

      case 'quiz_perfect':
        shouldAward = user.quizAttempts.some(q => q.score >= condition.value)
        break

      case 'purchase_count':
        shouldAward = user.pointRequests.length >= condition.value
        break

      case 'purchase_total':
        const totalPurchased = user.pointRequests.reduce((sum, r) => sum + r.pointsAmount, 0)
        shouldAward = totalPurchased >= condition.value
        break

      case 'points_balance':
        shouldAward = user.points >= condition.value
        break

      case 'time_morning':
        // Check if current hour is before the value (e.g., before 8 AM)
        const morningHour = new Date().getHours()
        shouldAward = morningHour < condition.value
        break

      case 'time_night':
        // Check if current hour is after the value (e.g., after 11 PM)
        const nightHour = new Date().getHours()
        shouldAward = nightHour >= condition.value
        break

      case 'all_features':
        // Check if user has used CV, interview, and quiz
        const usedCV = user.cvVersions.length > 0
        const usedInterview = user.interviews.length > 0
        const usedQuiz = user.quizAttempts.length > 0
        shouldAward = usedCV && usedInterview && usedQuiz
        break

      // Streak achievements would need additional tracking
      case 'streak':
      case 'quiz_streak':
        // These require daily login tracking - skip for now
        break
    }

    if (shouldAward) {
      await db.userAchievement.create({
        data: {
          userId,
          achievementId: achievement.id
        }
      })

      // Award bonus points if any
      if (achievement.points > 0) {
        await db.user.update({
          where: { id: userId },
          data: { points: { increment: achievement.points } }
        })
      }

      awarded.push(achievement.name)
    }
  }

  return awarded
}

// Check achievements after specific actions
export async function checkCVAchievements(userId: string, cvScore?: number): Promise<string[]> {
  return checkAndAwardAchievements(userId)
}

export async function checkInterviewAchievements(userId: string): Promise<string[]> {
  return checkAndAwardAchievements(userId)
}

export async function checkQuizAchievements(userId: string): Promise<string[]> {
  return checkAndAwardAchievements(userId)
}

export async function checkPurchaseAchievements(userId: string): Promise<string[]> {
  return checkAndAwardAchievements(userId)
}
