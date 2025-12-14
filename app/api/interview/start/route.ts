import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { generateJSONResponse } from '@/lib/ai/client'
import { buildInterviewStartPrompt } from '@/lib/ai/prompts'
import { deductPoints } from '@/lib/utils/points'

interface StartResponse {
  introduction: string
  firstQuestion: {
    type: string
    question: string
    options?: string[]
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { type, role, techStack, jobDescription, preferredLanguage } = body

    if (!type || !role) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const pointResult = await deductPoints(session.user.id, 2)
    if (!pointResult.success) {
      return NextResponse.json({ error: pointResult.error }, { status: 403 })
    }

    const stackString = Array.isArray(techStack) ? techStack.join(', ') : techStack || 'General'
    const systemPrompt = buildInterviewStartPrompt(type, role, stackString, jobDescription, preferredLanguage)

    const result = await generateJSONResponse<StartResponse>(
      systemPrompt,
      'Begin the interview.'
    )

    const interview = await db.interview.create({
      data: {
        userId: session.user.id,
        type: type as any,
        role,
        techStack: techStack || [],
        messages: [{
          role: 'assistant',
          content: result.introduction,
          question: result.firstQuestion
        }],
        status: 'IN_PROGRESS'
      }
    })

    return NextResponse.json({
      id: interview.id,
      introduction: result.introduction,
      question: result.firstQuestion
    })
  } catch (error) {
    console.error('Interview start error:', error)
    return NextResponse.json({ error: 'Failed to start interview' }, { status: 500 })
  }
}
