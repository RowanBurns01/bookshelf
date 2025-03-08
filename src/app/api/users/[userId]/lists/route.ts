import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient()

export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const lists = await prisma.list.findMany({
      where: {
        userId: params.userId,
      },
      include: {
        books: {
          include: {
            book: true,
          },
        },
      },
    })

    return NextResponse.json(lists)
  } catch (error) {
    console.error('Error fetching user lists:', error)
    return NextResponse.json(
      { error: 'Failed to fetch user lists' },
      { status: 500 }
    )
  }
} 