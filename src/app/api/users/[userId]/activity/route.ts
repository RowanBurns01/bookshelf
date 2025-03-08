import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient()

export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const recentActivity = await prisma.userBook.findMany({
      where: {
        userId: params.userId,
      },
      orderBy: {
        updatedAt: 'desc',
      },
      take: 10,
      include: {
        book: true,
      },
    })

    return NextResponse.json(recentActivity)
  } catch (error) {
    console.error('Error fetching user activity:', error)
    return NextResponse.json(
      { error: 'Failed to fetch user activity' },
      { status: 500 }
    )
  }
} 