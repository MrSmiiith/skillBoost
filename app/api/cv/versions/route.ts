import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const versions = await db.cVVersion.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        version: true,
        targetRole: true,
        scores: true,
        createdAt: true
      }
    })

    return NextResponse.json(versions)
  } catch (error) {
    console.error('Error fetching CV versions:', error)
    return NextResponse.json({ error: 'Failed to fetch versions' }, { status: 500 })
  }
}
