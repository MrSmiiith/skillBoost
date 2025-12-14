import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const cvVersions = await db.cVVersion.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        targetRole: true,
        version: true,
        scores: true,
        createdAt: true,
      },
    })

    const history = cvVersions.map((cv) => {
      const scoresData = cv.scores as any
      return {
        id: cv.id,
        targetRole: cv.targetRole,
        version: cv.version,
        scores: {
          clarity: scoresData?.clarity || 0,
          impact: scoresData?.impact || 0,
          atsReadiness: scoresData?.atsReadiness || 0,
          overall: scoresData?.overall || 0,
        },
        createdAt: cv.createdAt.toISOString(),
      }
    })

    return NextResponse.json(history)
  } catch (error) {
    console.error('CV history error:', error)
    return NextResponse.json({ error: 'Failed to fetch history' }, { status: 500 })
  }
}
