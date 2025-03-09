import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const { userId, bookId, status } = await request.json()

    if (!userId || !bookId || !status) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if a user book record already exists
    const existingUserBook = await prisma.userBook.findUnique({
      where: {
        userId_bookId: {
          userId,
          bookId,
        },
      },
    })

    let userBook
    if (existingUserBook) {
      // Update existing record
      userBook = await prisma.userBook.update({
        where: {
          userId_bookId: {
            userId,
            bookId,
          },
        },
        data: {
          status,
          updatedAt: new Date(),
        },
      })
    } else {
      // Create new record
      userBook = await prisma.userBook.create({
        data: {
          userId,
          bookId,
          status,
        },
      })
    }

    return NextResponse.json(userBook)
  } catch (error) {
    console.error('Error updating book status:', error)
    return NextResponse.json(
      { error: 'Failed to update book status' },
      { status: 500 }
    )
  }
} 