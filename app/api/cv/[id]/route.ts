import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    const cvVersion = await db.cVVersion.findUnique({
      where: { id },
    })

    if (!cvVersion) {
      return NextResponse.json({ error: 'CV not found' }, { status: 404 })
    }

    if (cvVersion.userId !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // Parse the stored JSON data (feedback is stored inside scores)
    const scoresData = cvVersion.scores as any
    const result = {
      id: cvVersion.id,
      scores: {
        clarity: scoresData?.clarity || 0,
        impact: scoresData?.impact || 0,
        atsReadiness: scoresData?.atsReadiness || 0,
        overall: scoresData?.overall || 0,
      },
      feedback: scoresData?.feedback || { strengths: [], improvements: [] },
      optimizedSections: cvVersion.optimized ? JSON.parse(cvVersion.optimized) : null,
      targetRole: cvVersion.targetRole,
      version: cvVersion.version,
      createdAt: cvVersion.createdAt.toISOString(),
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('CV fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch CV' }, { status: 500 })
  }
}
