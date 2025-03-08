import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient()

export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status') as 'reading' | 'completed' | 'want-to-read' | null

  try {
    const userBooks = await prisma.userBook.findMany({
      where: {
        userId: params.userId,
        ...(status && { status }),
      },
      include: {
        book: true,
      },
    })

    return NextResponse.json(userBooks)
  } catch (error) {
    console.error('Error fetching user books:', error)
    return NextResponse.json(
      { error: 'Failed to fetch user books' },
      { status: 500 }
    )
  }
} 