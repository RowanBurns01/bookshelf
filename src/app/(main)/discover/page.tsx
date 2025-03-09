'use client'

import { getNewReleases, getTrendingBooks, searchBooks } from '@/lib/api'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useDebounce } from '@/lib/hooks'
import { ReadingStatusButtons } from '@/components/ReadingStatusButtons'

type Book = {
  id: string
  title: string
  author: string
  coverImage: string | null
}

type SearchResults = {
  books: Book[]
  pagination: {
    total: number
    pages: number
    currentPage: number
  }
}

export default function DiscoverPage() {
  const [trending, setTrending] = useState<Book[]>([])
  const [newReleases, setNewReleases] = useState<Book[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<SearchResults | null>(null)
  const [loading, setLoading] = useState(true)
  const [searching, setSearching] = useState(false)
  const debouncedSearch = useDebounce(searchQuery, 100)

  useEffect(() => {
    async function loadBooks() {
      try {
        const [trendingBooks, newReleasesBooks] = await Promise.all([
          getTrendingBooks(),
          getNewReleases(),
        ])
        setTrending(trendingBooks)
        setNewReleases(newReleasesBooks)
      } catch (error) {
        console.error('Error loading books:', error)
      } finally {
        setLoading(false)
      }
    }

    loadBooks()
  }, [])

  useEffect(() => {
    async function performSearch() {
      if (!debouncedSearch.trim()) {
        setSearchResults(null)
        setSearching(false)
        return
      }

      setSearching(true)
      try {
        const results = await searchBooks(debouncedSearch)
        setSearchResults(results)
      } catch (error) {
        console.error('Error searching books:', error)
      } finally {
        setSearching(false)
      }
    }

    performSearch()
  }, [debouncedSearch])

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
          <div className="w-64 h-10 bg-gray-200 rounded animate-pulse" />
        </div>
        {[1, 2].map((section) => (
          <section key={section} className="mb-12">
            <div className="h-6 w-36 bg-gray-200 rounded mb-4 animate-pulse" />
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="flex flex-col gap-2">
                  <div className="aspect-[2/3] bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
                  <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Discover Books</h1>
        <div className="relative">
          <input
            type="search"
            placeholder="Search books..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-64 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          />
          {searching && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent" />
            </div>
          )}
        </div>
      </div>

      {searchResults ? (
        <div>
          <h2 className="text-2xl font-semibold mb-4">
            Search Results
            {searchResults.pagination.total > 0 && (
              <span className="text-gray-500 text-lg ml-2">
                ({searchResults.pagination.total} books found)
              </span>
            )}
          </h2>
          {searchResults.books.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {searchResults.books.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-12">No books found matching your search.</p>
          )}
        </div>
      ) : (
        <>
          {/* Trending This Week */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">Trending This Week</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {trending.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          </section>

          {/* New Releases */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">New Releases</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {newReleases.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  )
}

function BookCard({ book }: { book: Book }) {
  return (
    <div className="flex flex-col gap-2">
      <Link href={`/books/${book.id}`} className="group">
        <div className="aspect-[2/3] relative overflow-hidden rounded-lg">
          {book.coverImage ? (
            <Image
              src={book.coverImage}
              alt={book.title}
              fill
              className="object-cover transition-transform group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              📚
            </div>
          )}
        </div>
        <h3 className="font-medium line-clamp-1 group-hover:text-blue-600 mt-2">{book.title}</h3>
        <p className="text-sm text-gray-600 line-clamp-1">{book.author}</p>
      </Link>
      <ReadingStatusButtons bookId={book.id} />
    </div>
  )
}
