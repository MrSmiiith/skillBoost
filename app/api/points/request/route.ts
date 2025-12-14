import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await req.formData()
    const pointsAmount = parseInt(formData.get('pointsAmount') as string)
    const priceDA = parseInt(formData.get('priceDA') as string)
    const paymentMethod = formData.get('paymentMethod') as string
    let transactionId = formData.get('transactionId') as string
    const sentTime = formData.get('sentTime') as string | null
    const proofFile = formData.get('proof') as File | null

    if (!pointsAmount || !priceDA || !paymentMethod || !transactionId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // For Flexy, include the sent time in transaction info
    if (paymentMethod === 'FLEXY' && sentTime) {
      const sentDate = new Date(sentTime)
      transactionId = `${transactionId} | Sent: ${sentDate.toLocaleString('en-GB')}`
    }

    const validMethods = ['BARIDIMOB', 'CCP', 'FLEXY']
    if (!validMethods.includes(paymentMethod)) {
      return NextResponse.json({ error: 'Invalid payment method' }, { status: 400 })
    }

    let receiptImage: string | null = null

    if (proofFile && proofFile.size > 0) {
      const bytes = await proofFile.arrayBuffer()
      const buffer = Buffer.from(bytes)

      const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'receipts')
      await mkdir(uploadsDir, { recursive: true })

      const ext = proofFile.name.split('.').pop() || 'jpg'
      const fileName = `${session.user.id}-${Date.now()}.${ext}`
      const filePath = path.join(uploadsDir, fileName)

      await writeFile(filePath, buffer)
      receiptImage = `/uploads/receipts/${fileName}`
    }

    const request = await db.pointRequest.create({
      data: {
        userId: session.user.id,
        pointsAmount,
        priceDA,
        paymentMethod: paymentMethod as 'BARIDIMOB' | 'CCP' | 'FLEXY',
        transactionId,
        receiptImage,
        status: 'PENDING'
      }
    })

    return NextResponse.json({
      id: request.id,
      status: 'PENDING',
      message: 'Request submitted successfully'
    })
  } catch (error) {
    console.error('Point request error:', error)
    return NextResponse.json({ error: 'Failed to submit request' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const requests = await db.pointRequest.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        pointsAmount: true,
        priceDA: true,
        paymentMethod: true,
        status: true,
        createdAt: true,
        processedAt: true
      }
    })

    return NextResponse.json(requests)
  } catch (error) {
    console.error('Error fetching requests:', error)
    return NextResponse.json({ error: 'Failed to fetch requests' }, { status: 500 })
  }
}
