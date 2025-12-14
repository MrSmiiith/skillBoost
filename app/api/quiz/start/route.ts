import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { generateJSONResponse } from '@/lib/ai/client'

interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correctAnswer: string
  category: string
  difficulty: 'easy' | 'medium' | 'hard'
}

interface GeneratedQuiz {
  questions: QuizQuestion[]
}

function buildQuizPrompt(targetRole?: string, skills?: string): string {
  if (targetRole || skills) {
    const roleSection = targetRole ? `Target Role: ${targetRole}` : ''
    const skillsSection = skills ? `Key Skills: ${skills}` : ''

    return `You are a tech quiz generator. Generate 10 multiple-choice questions tailored to the following profile:
${roleSection}
${skillsSection}

Requirements:
- Mix of difficulties: 4 easy, 4 medium, 2 hard
- Questions should be relevant to the target role and skills
- Each question must have exactly 4 options
- Questions should test practical knowledge needed for this role
- Include both technical and conceptual questions
- Generate exactly 10 questions with IDs q1 through q10

Response format (JSON only):
{
  "questions": [
    {
      "id": "q1",
      "question": "Your question here",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": "The correct option exactly as written",
      "category": "Category name",
      "difficulty": "easy"
    }
  ]
}`
  }

  return `You are a tech quiz generator. Generate 10 multiple-choice questions about programming, web development, and technology concepts.

Requirements:
- Mix of difficulties: 4 easy, 4 medium, 2 hard
- Categories: JavaScript, React, Python, Web Dev, Databases, CS Fundamentals, DevOps
- Each question must have exactly 4 options
- Questions should be educational and practical
- Generate exactly 10 questions with IDs q1 through q10

Response format (JSON only):
{
  "questions": [
    {
      "id": "q1",
      "question": "What does CSS stand for?",
      "options": ["Computer Style Sheets", "Cascading Style Sheets", "Creative Style Sheets", "Colorful Style Sheets"],
      "correctAnswer": "Cascading Style Sheets",
      "category": "Web Dev",
      "difficulty": "easy"
    }
  ]
}`
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    let targetRole: string | undefined
    let skills: string | undefined

    try {
      const body = await req.json()
      targetRole = body.targetRole
      skills = body.skills
    } catch {
      // No body provided, use default quiz
    }

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const existingAttempt = await db.quizAttempt.findFirst({
      where: {
        userId: session.user.id,
        createdAt: { gte: today },
        completed: true
      }
    })

    if (existingAttempt) {
      return NextResponse.json({ error: 'Already completed today\'s quiz' }, { status: 403 })
    }

    const inProgressAttempt = await db.quizAttempt.findFirst({
      where: {
        userId: session.user.id,
        createdAt: { gte: today },
        completed: false
      }
    })

    if (inProgressAttempt) {
      const questions = inProgressAttempt.questions as unknown as QuizQuestion[]
      return NextResponse.json({
        questions: questions.map(q => ({
          id: q.id,
          question: q.question,
          options: q.options,
          category: q.category,
          difficulty: q.difficulty
        }))
      })
    }

    const quizPrompt = buildQuizPrompt(targetRole, skills)
    const result = await generateJSONResponse<GeneratedQuiz>(
      quizPrompt,
      targetRole ? `Generate 10 quiz questions for a ${targetRole} role.` : 'Generate 10 quiz questions for today\'s daily quiz.'
    )

    const quiz = await db.quizAttempt.create({
      data: {
        userId: session.user.id,
        questions: JSON.parse(JSON.stringify(result.questions)),
        answers: {},
        score: 0,
        completed: false
      }
    })

    return NextResponse.json({
      questions: result.questions.map(q => ({
        id: q.id,
        question: q.question,
        options: q.options,
        category: q.category,
        difficulty: q.difficulty
      }))
    })
  } catch (error) {
    console.error('Quiz start error:', error)
    return NextResponse.json({ error: 'Failed to start quiz' }, { status: 500 })
  }
}
