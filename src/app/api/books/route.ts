import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

type NYTBook = {
  title: string
  author: string
  description: string
  book_image: string
  primary_isbn13: string
  rank: number
  rank_last_week: number | null
  weeks_on_list: number
}

type GoogleBook = {
  id: string
  volumeInfo: {
    title: string
    authors?: string[]
    description?: string
    imageLinks?: {
      thumbnail: string
    }
    industryIdentifiers?: Array<{
      type: string
      identifier: string
    }>
    pageCount?: number
    publishedDate?: string
  }
}

async function getNYTBestsellers(): Promise<NYTBook[]> {
  if (!process.env.NYT_API_KEY) {
    console.error('NYT_API_KEY is not set')
    return []
  }

  try {
    console.log('Fetching NYT bestsellers...')
    const response = await fetch(
      `https://api.nytimes.com/svc/books/v3/lists/current/combined-print-and-e-book-fiction.json?api-key=${process.env.NYT_API_KEY}`
    )
    
    if (!response.ok) {
      const errorData = await response.json()
      console.error('NYT API error:', errorData)
      return []
    }

    const data = await response.json()
    console.log(`Found ${data.results.books.length} NYT bestsellers`)
    return data.results.books
  } catch (error) {
    console.error('Error fetching NYT bestsellers:', error)
    return []
  }
}

async function getGoogleBooksTrending(): Promise<GoogleBook[]> {
  if (!process.env.GOOGLE_BOOKS_API_KEY) {
    console.error('GOOGLE_BOOKS_API_KEY is not set')
    return []
  }

  try {
    console.log('Fetching trending books from Google Books...')
    const response = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=subject:fiction&orderBy=relevance&maxResults=40&key=${process.env.GOOGLE_BOOKS_API_KEY}&filter=partial`
    )
    
    if (!response.ok) {
      const errorData = await response.json()
      console.error('Google Books API error:', errorData)
      return []
    }

    const data = await response.json()
    console.log(`Found ${data.items?.length || 0} Google Books results`)
    return data.items || []
  } catch (error) {
    console.error('Error fetching Google Books trending:', error)
    return []
  }
}

function calculateTrendingScore(book: {
  rank?: number
  rank_last_week?: number | null
  weeks_on_list?: number
  publishDate?: Date | null
}): number {
  let score = 0

  // NYT Bestseller scoring
  if (book.rank) {
    // Base score from rank (100 - rank, so #1 gets 99 points)
    score += Math.max(0, 100 - book.rank)

    // Momentum bonus: if rank improved from last week
    if (book.rank_last_week && book.rank < book.rank_last_week) {
      score += 20
    }

    // Consistency bonus: books that stay on the list
    if (book.weeks_on_list) {
      score += Math.min(20, book.weeks_on_list)
    }
  }

  // Google Books scoring (for non-NYT books)
  if (!book.rank) {
    score += 60 // Base score for Google Books trending
    
    // Add recency bonus if it's a recent publication
    if (book.publishDate) {
      const daysSincePublish = Math.max(0, 
        (Date.now() - book.publishDate.getTime()) / (1000 * 60 * 60 * 24)
      )
      if (daysSincePublish <= 90) { // Extra points for books from last 3 months
        score += Math.max(0, 30 - (daysSincePublish / 3))
      }
    }
  }

  return score
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const type = searchParams.get('type')
  const query = searchParams.get('q')
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '12')
  const offset = (page - 1) * limit

  try {
    if (query) {
      const books = await prisma.book.findMany({
        where: {
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { author: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
          ],
        },
        orderBy: {
          trendingScore: 'desc',
        },
        skip: offset,
        take: limit,
      })

      const total = await prisma.book.count({
        where: {
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { author: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
          ],
        },
      })

      return NextResponse.json({
        books,
        pagination: {
          total,
          pages: Math.ceil(total / limit),
          currentPage: page,
        },
      })
    }

    switch (type) {
      case 'trending': {
        console.log('Processing trending books request...')
        
        // Fetch trending books from external APIs
        const [nytBooks, googleBooks] = await Promise.all([
          getNYTBestsellers(),
          getGoogleBooksTrending(),
        ])

        let processedCount = 0
        console.log('Processing NYT books...')
        
        // Process NYT books
        for (const nytBook of nytBooks) {
          try {
            await prisma.book.upsert({
              where: {
                isbn: nytBook.primary_isbn13,
              },
              update: {
                trendingScore: calculateTrendingScore({
                  rank: nytBook.rank,
                  rank_last_week: nytBook.rank_last_week,
                  weeks_on_list: nytBook.weeks_on_list,
                }),
                updatedAt: new Date(),
              },
              create: {
                title: nytBook.title,
                author: nytBook.author,
                description: nytBook.description,
                coverImage: nytBook.book_image,
                isbn: nytBook.primary_isbn13,
                trendingScore: calculateTrendingScore({
                  rank: nytBook.rank,
                  rank_last_week: nytBook.rank_last_week,
                  weeks_on_list: nytBook.weeks_on_list,
                }),
              },
            })
            processedCount++
          } catch (error) {
            console.error(`Error processing NYT book ${nytBook.title}:`, error)
          }
        }

        console.log('Processing Google Books...')
        
        // Process Google Books
        for (const googleBook of googleBooks) {
          const volumeInfo = googleBook.volumeInfo
          if (volumeInfo?.title && volumeInfo.authors?.[0]) {
            try {
              const isbn = volumeInfo.industryIdentifiers?.find(id => id.type === 'ISBN_13')?.identifier
              const publishDate = volumeInfo.publishedDate ? new Date(volumeInfo.publishedDate) : null
              
              await prisma.book.upsert({
                where: {
                  googleBooksId: googleBook.id,
                },
                update: {
                  trendingScore: calculateTrendingScore({
                    publishDate,
                  }),
                  updatedAt: new Date(),
                },
                create: {
                  title: volumeInfo.title,
                  author: volumeInfo.authors[0],
                  description: volumeInfo.description,
                  coverImage: volumeInfo.imageLinks?.thumbnail,
                  isbn: isbn,
                  pageCount: volumeInfo.pageCount,
                  publishDate,
                  googleBooksId: googleBook.id,
                  trendingScore: calculateTrendingScore({
                    publishDate,
                  }),
                },
              })
              processedCount++
            } catch (error) {
              console.error(`Error processing Google book ${volumeInfo.title}:`, error)
            }
          }
        }

        console.log(`Successfully processed ${processedCount} books`)

        // Get final trending books list from the last week
        const oneWeekAgo = new Date()
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)

        const trendingBooks = await prisma.book.findMany({
          where: {
            updatedAt: {
              gte: oneWeekAgo,
            },
          },
          orderBy: {
            trendingScore: 'desc',
          },
          take: limit,
        })

        console.log(`Returning ${trendingBooks.length} trending books`)
        return NextResponse.json(trendingBooks)
      }

      case 'featured':
        const featuredBooks = await prisma.book.findMany({
          where: {
            averageRating: {
              gte: 4.0,
            },
            reviewCount: {
              gte: 1,
            },
          },
          orderBy: {
            averageRating: 'desc',
          },
          take: limit,
          skip: offset,
        })
        return NextResponse.json(featuredBooks)

      case 'popular':
        const popularBooks = await prisma.book.findMany({
          orderBy: {
            viewCount: 'desc',
          },
          take: limit,
          skip: offset,
        })
        return NextResponse.json(popularBooks)

      case 'new':
        const newReleases = await prisma.book.findMany({
          where: {
            publishDate: {
              gte: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), // Last 90 days
            },
          },
          orderBy: {
            publishDate: 'desc',
          },
          take: limit,
          skip: offset,
        })
        return NextResponse.json(newReleases)

      default:
        return NextResponse.json({ error: 'Invalid type parameter' }, { status: 400 })
    }
  } catch (error) {
    console.error('Error in GET handler:', error)
    return NextResponse.json({ error: 'Failed to fetch books' }, { status: 500 })
  }
} 