import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') as 'reading' | 'completed' | 'want-to-read' | null

    const userBooks = await prisma.userBook.findMany({
      where: {
        userId: params.userId,
        ...(status ? { status } : {}),
      },
      include: {
        book: {
          select: {
            id: true,
            title: true,
            author: true,
            coverImage: true,
          },
        },
      },
      orderBy: {
        updatedAt: 'desc',
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