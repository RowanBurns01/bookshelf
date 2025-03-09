import { PrismaClient } from '@prisma/client'
import fetch from 'node-fetch'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import * as dotenv from 'dotenv'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
dotenv.config({ path: new URL('../../.env', import.meta.url).pathname })

const prisma = new PrismaClient()

interface GoogleBook {
  id: string
  volumeInfo: {
    title: string
    authors?: string[]
    description?: string
    publishedDate?: string
    pageCount?: number
    imageLinks?: {
      thumbnail: string
    }
    industryIdentifiers?: Array<{
      type: string
      identifier: string
    }>
  }
}

interface GoogleBooksResponse {
  items?: GoogleBook[]
  totalItems?: number
  error?: {
    message: string
  }
}

const GOOGLE_BOOKS_API_KEY = process.env.GOOGLE_BOOKS_API_KEY
const queries = [
  'subject:fiction bestseller',
  'subject:science bestseller',
  'subject:history bestseller',
  'subject:philosophy bestseller',
  'subject:technology bestseller',
]

async function fetchGoogleBooks(query: string) {
  const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
    query
  )}&key=${GOOGLE_BOOKS_API_KEY}&maxResults=40`

  console.log('Fetching from URL:', url)

  try {
    const response = await fetch(url)
    const data = (await response.json()) as GoogleBooksResponse
    
    if (data.error) {
      console.error('Google Books API Error:', data.error.message)
      return []
    }

    console.log(`Found ${data.totalItems} total books for query "${query}"`)
    console.log(`Received ${data.items?.length || 0} books in this response`)
    
    return data.items || []
  } catch (error) {
    console.error(`Error fetching books for query "${query}":`, error)
    return []
  }
}

async function populateBooks() {
  try {
    console.log('Starting database population...')
    console.log('Google Books API Key:', GOOGLE_BOOKS_API_KEY ? 'Present' : 'Missing')

    let totalBooksProcessed = 0
    let successfullyAdded = 0

    for (const query of queries) {
      console.log(`\nProcessing query: ${query}`)
      const books = await fetchGoogleBooks(query)

      if (!books || books.length === 0) {
        console.log(`No books found for query: ${query}`)
        continue
      }

      console.log(`Processing ${books.length} books...`)

      for (const book of books) {
        const { volumeInfo } = book
        totalBooksProcessed++

        const isbn = volumeInfo.industryIdentifiers?.find(
          (id) => id.type === 'ISBN_13' || id.type === 'ISBN_10'
        )?.identifier

        if (!volumeInfo.title || !volumeInfo.authors?.[0]) {
          console.log(`Skipping book: missing title or author`)
          continue
        }

        try {
          const result = await prisma.book.upsert({
            where: {
              googleBooksId: book.id,
            },
            update: {
              title: volumeInfo.title,
              author: volumeInfo.authors[0],
              description: volumeInfo.description,
              pageCount: volumeInfo.pageCount,
              publishDate: volumeInfo.publishedDate ? new Date(volumeInfo.publishedDate) : null,
              coverImage: volumeInfo.imageLinks?.thumbnail.replace('http:', 'https:'),
              isbn: isbn,
              viewCount: 0,
              reviewCount: 0,
              trendingScore: 0,
            },
            create: {
              googleBooksId: book.id,
              title: volumeInfo.title,
              author: volumeInfo.authors[0],
              description: volumeInfo.description,
              pageCount: volumeInfo.pageCount,
              publishDate: volumeInfo.publishedDate ? new Date(volumeInfo.publishedDate) : null,
              coverImage: volumeInfo.imageLinks?.thumbnail.replace('http:', 'https:'),
              isbn: isbn,
              viewCount: 0,
              reviewCount: 0,
              trendingScore: 0,
            },
          })
          console.log(`Successfully upserted book: ${volumeInfo.title}`)
          successfullyAdded++
        } catch (error) {
          console.error(`Error upserting book "${volumeInfo.title}":`, error)
        }
      }
    }

    console.log('\nDatabase population completed!')
    console.log(`Total books processed: ${totalBooksProcessed}`)
    console.log(`Successfully added/updated: ${successfullyAdded}`)

    // Verify the books were added
    const count = await prisma.book.count()
    console.log(`Total books in database: ${count}`)

  } catch (error) {
    console.error('Error populating database:', error)
  } finally {
    await prisma.$disconnect()
  }
}

populateBooks().catch(console.error) 