import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { addPoints } from '@/lib/utils/points'
import { checkAndAwardAchievements } from '@/lib/utils/achievements'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { role: true }
    })

    if (user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { id } = await params

    const request = await db.pointRequest.findUnique({
      where: { id }
    })

    if (!request) {
      return NextResponse.json({ error: 'Request not found' }, { status: 404 })
    }

    if (request.status !== 'PENDING') {
      return NextResponse.json({ error: 'Request already processed' }, { status: 400 })
    }

    await addPoints(request.userId, request.pointsAmount)

    await db.pointRequest.update({
      where: { id },
      data: {
        status: 'APPROVED',
        processedAt: new Date(),
        processedBy: session.user.id
      }
    })

    // Check for purchase-related achievements
    await checkAndAwardAchievements(request.userId)

    return NextResponse.json({ success: true, message: 'Request approved' })
  } catch (error) {
    console.error('Error approving request:', error)
    return NextResponse.json({ error: 'Failed to approve request' }, { status: 500 })
  }
}
