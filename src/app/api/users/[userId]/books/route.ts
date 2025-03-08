import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authConfig } from '@/lib/auth'

const prisma = new PrismaClient()

export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const session = await getServerSession(authConfig)
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') as 'reading' | 'completed' | 'want-to-read' | null

    const userBooks = await prisma.userBook.findMany({
      where: {
        userId: params.userId,
        ...(status && { status }),
      },
      include: {
        book: {
          select: {
            id: true,
            title: true,
            author: true,
            description: true,
            coverImage: true,
          },
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
    })

    const books = userBooks.map(({ book }) => ({
      id: book.id,
      title: book.title,
      author: book.author,
      description: book.description,
      coverImage: book.coverImage,
    }))

    return NextResponse.json(books)
  } catch (error) {
    console.error('Error fetching user books:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export async function POST(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const session = await getServerSession(authConfig)
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const { bookId, status } = await request.json()

    const userBook = await prisma.userBook.upsert({
      where: {
        userId_bookId: {
          userId: params.userId,
          bookId,
        },
      },
      update: {
        status,
        updatedAt: new Date(),
      },
      create: {
        userId: params.userId,
        bookId,
        status,
      },
    })

    return NextResponse.json(userBook)
  } catch (error) {
    console.error('Error updating user book:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
