import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { generateJSONResponse } from '@/lib/ai/client'

interface HintResponse {
  hint: string
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await req.json()
    const { question } = body

    if (!question) {
      return NextResponse.json({ error: 'Question is required' }, { status: 400 })
    }

    const interview = await db.interview.findUnique({
      where: { id, userId: session.user.id }
    })

    if (!interview) {
      return NextResponse.json({ error: 'Interview not found' }, { status: 404 })
    }

    const systemPrompt = `You are a helpful interview coach. The candidate is stuck on an interview question and needs a hint.

RULES:
1. Provide a helpful hint that guides them toward the answer WITHOUT giving the full answer
2. Keep the hint concise (1-2 sentences)
3. Focus on the approach or key concept they should consider
4. Do NOT provide the complete answer

Question: ${question}

Response format (JSON only):
{
  "hint": "Your helpful hint here"
}`

    const result = await generateJSONResponse<HintResponse>(
      systemPrompt,
      'Provide a hint for this question.'
    )

    return NextResponse.json({ hint: result.hint })
  } catch (error) {
    console.error('Hint error:', error)
    return NextResponse.json({ error: 'Failed to generate hint' }, { status: 500 })
  }
}
