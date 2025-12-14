import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const [user, pointRequests, cvCount, interviewCount, quizAttempts] = await Promise.all([
      db.user.findUnique({
        where: { id: session.user.id },
        select: {
          id: true,
          email: true,
          name: true,
          image: true,
          points: true,
          dailyUsage: true,
          role: true,
          createdAt: true,
          lastReset: true
        }
      }),
      db.pointRequest.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          pointsAmount: true,
          priceDA: true,
          paymentMethod: true,
          receiptImage: true,
          transactionId: true,
          status: true,
          adminNote: true,
          createdAt: true,
          processedAt: true
        }
      }),
      db.cVVersion.count({
        where: { userId: session.user.id }
      }),
      db.interview.count({
        where: { userId: session.user.id }
      }),
      db.quizAttempt.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: 'desc' },
        take: 10,
        select: {
          id: true,
          score: true,
          completed: true,
          createdAt: true
        }
      })
    ])

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Calculate total points earned from purchases
    const approvedRequests = pointRequests.filter(r => r.status === 'APPROVED')
    const totalPointsPurchased = approvedRequests.reduce((sum, r) => sum + r.pointsAmount, 0)
    const totalSpent = approvedRequests.reduce((sum, r) => sum + r.priceDA, 0)

    // Calculate quiz stats
    const completedQuizzes = quizAttempts.filter(q => q.completed)
    const totalQuizPoints = completedQuizzes.reduce((sum, q) => sum + Math.floor(q.score / 5), 0)
    const avgQuizScore = completedQuizzes.length > 0
      ? Math.round(completedQuizzes.reduce((sum, q) => sum + q.score, 0) / completedQuizzes.length * 10) / 10
      : 0

    // Calculate points used: initial(5) + purchased + quiz earnings - current balance
    const initialPoints = 5
    const totalEarned = initialPoints + totalPointsPurchased + totalQuizPoints
    const pointsUsed = Math.max(0, totalEarned - user.points)

    return NextResponse.json({
      user,
      stats: {
        cvOptimizations: cvCount,
        interviews: interviewCount,
        quizzesCompleted: completedQuizzes.length,
        avgQuizScore,
        totalPointsPurchased,
        totalQuizPoints,
        totalSpent,
        pointsUsed
      },
      pointRequests,
      recentQuizzes: quizAttempts
    })
  } catch (error) {
    console.error('Error fetching profile:', error)
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 })
  }
}
