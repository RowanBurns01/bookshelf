import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient()

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const type = searchParams.get('type')

  try {
    let books
    switch (type) {
      case 'featured':
        books = await prisma.book.findMany({
          take: 6,
          orderBy: {
            reviewCount: 'desc',
          },
        })
        break
      case 'popular':
        books = await prisma.book.findMany({
          take: 6,
          orderBy: {
            trendingScore: 'desc',
          },
        })
        break
      case 'new':
        books = await prisma.book.findMany({
          take: 6,
          where: {
            publishDate: {
              gte: new Date(new Date().setMonth(new Date().getMonth() - 3)),
            },
          },
          orderBy: {
            publishDate: 'desc',
          },
        })
        break
      default:
        return NextResponse.json({ error: 'Invalid type parameter' }, { status: 400 })
    }

    return NextResponse.json(books)
  } catch (error) {
    console.error('Error fetching books:', error)
    return NextResponse.json(
      { error: 'Failed to fetch books' },
      { status: 500 }
    )
  }
} 