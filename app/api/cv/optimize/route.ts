import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { processFileWithClaudeJSON, generateJSONResponse } from '@/lib/ai/client'
import { buildCVPrompt } from '@/lib/ai/prompts'
import { sanitizeCV, wrapUserContent, validateJSONStructure } from '@/lib/ai/sanitize'
import { deductPoint } from '@/lib/utils/points'
import { checkAndAwardAchievements } from '@/lib/utils/achievements'

interface CVResult {
  scores: {
    clarity: number
    impact: number
    atsReadiness: number
    overall: number
  }
  feedback: {
    strengths: string[]
    improvements: string[]
  }
  optimizedSections: {
    summary: string
    bullets: string[]
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const contentType = req.headers.get('content-type') || ''

    let targetRole: string
    let experienceLevel: string
    let fileBuffer: Buffer | null = null
    let fileName: string | null = null
    let cvText: string | null = null

    // Handle file upload (FormData) or JSON
    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData()
      const file = formData.get('file') as File | null
      targetRole = formData.get('targetRole') as string
      experienceLevel = formData.get('experienceLevel') as string

      if (file) {
        const bytes = await file.arrayBuffer()
        fileBuffer = Buffer.from(bytes)
        fileName = file.name
      }
    } else {
      const body = await req.json()
      cvText = body.cvText
      targetRole = body.targetRole
      experienceLevel = body.experienceLevel
    }

    if (!targetRole || !experienceLevel) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    if (!fileBuffer && !cvText) {
      return NextResponse.json({ error: 'Please provide a CV file or text' }, { status: 400 })
    }

    // Deduct point before processing
    const pointResult = await deductPoint(session.user.id)
    if (!pointResult.success) {
      return NextResponse.json({ error: pointResult.error }, { status: 403 })
    }

    const systemPrompt = buildCVPrompt(targetRole, experienceLevel)

    let result: CVResult

    if (fileBuffer && fileName) {
      // Process file directly with Claude CLI - use the system prompt from prompts.ts
      result = await processFileWithClaudeJSON<CVResult>(fileBuffer, fileName, systemPrompt)
    } else if (cvText) {
      // Process text with Claude CLI
      const sanitizedCV = sanitizeCV(cvText)
      const wrappedCV = wrapUserContent(sanitizedCV, 'user_cv')
      result = await generateJSONResponse<CVResult>(systemPrompt, wrappedCV)
    } else {
      return NextResponse.json({ error: 'No CV content provided' }, { status: 400 })
    }

    const requiredFields = ['scores', 'feedback', 'optimizedSections']
    if (!validateJSONStructure(result, requiredFields)) {
      throw new Error('Invalid AI response structure')
    }

    // Save CV version to database
    const existingVersions = await db.cVVersion.count({
      where: { userId: session.user.id }
    })

    const cvVersion = await db.cVVersion.create({
      data: {
        userId: session.user.id,
        rawText: `[File: ${fileName}]`,
        optimized: JSON.stringify(result.optimizedSections),
        scores: {
          ...result.scores,
          feedback: result.feedback
        },
        targetRole,
        version: existingVersions + 1
      }
    })

    // Check for new achievements
    const newAchievements = await checkAndAwardAchievements(session.user.id)

    return NextResponse.json({ ...result, id: cvVersion.id, newAchievements })
  } catch (error) {
    console.error('CV optimization error:', error)
    return NextResponse.json({ error: 'Failed to optimize CV' }, { status: 500 })
  }
}
