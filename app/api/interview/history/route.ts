import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const interviews = await db.interview.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
      take: 10,
      select: {
        id: true,
        type: true,
        role: true,
        status: true,
        summary: true,
        createdAt: true,
        completedAt: true
      }
    })

    const formatted = interviews.map(i => ({
      ...i,
      createdAt: i.createdAt.toISOString(),
      completedAt: i.completedAt?.toISOString() || null
    }))

    return NextResponse.json(formatted)
  } catch (error) {
    console.error('Error fetching interview history:', error)
    return NextResponse.json({ error: 'Failed to fetch history' }, { status: 500 })
  }
}
