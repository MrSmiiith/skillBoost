import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'

interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correctAnswer: string
  category: string
  difficulty: 'easy' | 'medium' | 'hard'
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { questionId, answer } = body

    if (!questionId || !answer) {
      return NextResponse.json({ error: 'Missing questionId or answer' }, { status: 400 })
    }

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const attempt = await db.quizAttempt.findFirst({
      where: {
        userId: session.user.id,
        createdAt: { gte: today },
        completed: false
      }
    })

    if (!attempt) {
      return NextResponse.json({ error: 'No active quiz found' }, { status: 404 })
    }

    const questions = attempt.questions as unknown as QuizQuestion[]
    const question = questions.find(q => q.id === questionId)

    if (!question) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 })
    }

    const answers = attempt.answers as Record<string, { answer: string; correct: boolean }>

    if (answers[questionId]) {
      return NextResponse.json({ error: 'Question already answered' }, { status: 400 })
    }

    const isCorrect = answer === question.correctAnswer
    const newAnswers = {
      ...answers,
      [questionId]: { answer, correct: isCorrect }
    }

    await db.quizAttempt.update({
      where: { id: attempt.id },
      data: {
        answers: newAnswers,
        score: isCorrect ? attempt.score + 1 : attempt.score
      }
    })

    return NextResponse.json({
      correct: isCorrect,
      correctAnswer: question.correctAnswer
    })
  } catch (error) {
    console.error('Quiz answer error:', error)
    return NextResponse.json({ error: 'Failed to submit answer' }, { status: 500 })
  }
}
