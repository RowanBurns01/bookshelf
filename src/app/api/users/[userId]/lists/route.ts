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

    const lists = await prisma.list.findMany({
      where: {
        userId: params.userId,
        OR: [
          { isPublic: true },
          { userId: session.user.id },
        ],
      },
      include: {
        books: {
          select: {
            book: {
              select: {
                id: true,
                title: true,
                coverImage: true,
              },
            },
            order: true,
          },
          orderBy: {
            order: 'asc',
          },
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
    })

    return NextResponse.json(lists)
  } catch (error) {
    console.error('Error fetching user lists:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export async function POST(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const session = await getServerSession(authConfig)
    if (!session?.user?.id || session.user.id !== params.userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const { name, description, isPublic = false } = await request.json()

    const list = await prisma.list.create({
      data: {
        name,
        description,
        isPublic,
        userId: params.userId,
      },
    })

    return NextResponse.json(list)
  } catch (error) {
    console.error('Error creating list:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
} 