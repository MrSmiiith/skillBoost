import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ hasCV: false })
    }

    const cvCount = await db.cVVersion.count({
      where: { userId: session.user.id }
    })

    return NextResponse.json({ hasCV: cvCount > 0 })
  } catch (error) {
    return NextResponse.json({ hasCV: false })
  }
}
