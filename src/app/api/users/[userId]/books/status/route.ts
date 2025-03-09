import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { userId, bookId, status } = await request.json()

    if (!userId || !bookId || !status) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Update or create the user book entry
    const userBook = await prisma.userBook.upsert({
      where: {
        userId_bookId: {
          userId,
          bookId,
        },
      },
      update: {
        status,
        startDate: status === 'reading' ? new Date() : undefined,
        endDate: status === 'completed' ? new Date() : undefined,
      },
      create: {
        userId,
        bookId,
        status,
        startDate: status === 'reading' ? new Date() : undefined,
        endDate: status === 'completed' ? new Date() : undefined,
      },
    })

    return NextResponse.json(userBook)
  } catch (error) {
    console.error('Error updating book status:', error)
    return NextResponse.json(
      { error: 'Failed to update book status' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const { bookId } = await request.json()
    const userId = params.userId

    if (!userId || !bookId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    await prisma.userBook.delete({
      where: {
        userId_bookId: {
          userId,
          bookId,
        },
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error removing book:', error)
    return NextResponse.json(
      { error: 'Failed to remove book' },
      { status: 500 }
    )
  }
} 