import { z } from 'zod'

export const cvOptimizeSchema = z.object({
  cvText: z.string().min(50).max(50000),
  targetRole: z.string().min(2).max(100),
  experienceLevel: z.enum(['entry', 'mid', 'senior', 'lead'])
})

export const interviewStartSchema = z.object({
  type: z.enum(['TECHNICAL', 'BEHAVIORAL', 'SYSTEM_DESIGN', 'MIXED']),
  role: z.string().min(2).max(100),
  techStack: z.array(z.string().max(50)).max(10).optional()
})

export const interviewRespondSchema = z.object({
  answer: z.string().min(1).max(2000)
})

export const pointRequestSchema = z.object({
  pointsAmount: z.number().positive().max(1000),
  priceDA: z.number().positive(),
  paymentMethod: z.enum(['BARIDIMOB', 'CCP', 'FLEXY']),
  transactionId: z.string().min(5).max(100)
})

export function validateInput<T>(schema: z.ZodSchema<T>, data: unknown): { success: true; data: T } | { success: false; error: string } {
  try {
    const result = schema.parse(data)
    return { success: true, data: result }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const firstError = error.issues[0]
      return { success: false, error: firstError?.message || 'Invalid input' }
    }
    return { success: false, error: 'Validation failed' }
  }
}
