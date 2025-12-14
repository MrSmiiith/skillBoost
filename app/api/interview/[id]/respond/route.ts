import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { generateJSONResponse } from '@/lib/ai/client'
import { buildInterviewPrompt } from '@/lib/ai/prompts'
import { sanitizeMessage, wrapUserContent } from '@/lib/ai/sanitize'

interface InterviewResponse {
  evaluation: {
    score: number
    strengths: string[]
    gaps: string[]
  }
  nextQuestion: {
    type: string
    question: string
    options?: string[]
  }
  isComplete: boolean
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
    const { answer } = body

    if (!answer) {
      return NextResponse.json({ error: 'Answer is required' }, { status: 400 })
    }

    const interview = await db.interview.findUnique({
      where: { id, userId: session.user.id }
    })

    if (!interview) {
      return NextResponse.json({ error: 'Interview not found' }, { status: 404 })
    }

    if (interview.status !== 'IN_PROGRESS') {
      return NextResponse.json({ error: 'Interview already completed' }, { status: 400 })
    }

    const sanitizedAnswer = sanitizeMessage(answer)
    const wrappedAnswer = wrapUserContent(sanitizedAnswer, 'user_answer')
    const stackString = Array.isArray(interview.techStack)
      ? (interview.techStack as string[]).join(', ')
      : 'General'

    const systemPrompt = buildInterviewPrompt(interview.type, interview.role, stackString)

    const messages = interview.messages as any[]
    const conversationContext = messages
      .map((m: any) => `${m.role}: ${m.content || m.question?.question || ''}`)
      .join('\n')

    const result = await generateJSONResponse<InterviewResponse>(
      systemPrompt,
      `${conversationContext}\n\nuser: ${wrappedAnswer}`
    )

    const updatedMessages = [
      ...messages,
      { role: 'user', content: sanitizedAnswer },
      {
        role: 'assistant',
        evaluation: result.evaluation,
        question: result.nextQuestion
      }
    ]

    await db.interview.update({
      where: { id },
      data: {
        messages: updatedMessages,
        ...(result.isComplete && {
          status: 'COMPLETED',
          completedAt: new Date()
        })
      }
    })

    return NextResponse.json({
      evaluation: result.evaluation,
      nextQuestion: result.isComplete ? null : result.nextQuestion,
      isComplete: result.isComplete
    })
  } catch (error) {
    console.error('Interview respond error:', error)
    return NextResponse.json({ error: 'Failed to process response' }, { status: 500 })
  }
}
