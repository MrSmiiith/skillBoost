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

    const interview = await db.interview.findUnique({
      where: { id, userId: session.user.id }
    })

    if (!interview) {
      return NextResponse.json({ error: 'Interview not found' }, { status: 404 })
    }

    return NextResponse.json({
      id: interview.id,
      type: interview.type,
      role: interview.role,
      techStack: interview.techStack,
      messages: interview.messages,
      status: interview.status,
      createdAt: interview.createdAt.toISOString(),
      completedAt: interview.completedAt?.toISOString() || null
    })
  } catch (error) {
    console.error('Interview fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch interview' }, { status: 500 })
  }
}
