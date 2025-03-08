'use client'

import { getFeaturedBooks, getNewReleases, getPopularBooks } from '@/lib/api'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'

type Book = {
  id: string
  title: string
  author: string
  coverImage: string | null
}

export default function DiscoverPage() {
  const [featured, setFeatured] = useState<Book[]>([])
  const [popular, setPopular] = useState<Book[]>([])
  const [newReleases, setNewReleases] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadBooks() {
      try {
        const [featuredBooks, popularBooks, newReleasesBooks] = await Promise.all([
          getFeaturedBooks(),
          getPopularBooks(),
          getNewReleases(),
        ])
        setFeatured(featuredBooks)
        setPopular(popularBooks)
        setNewReleases(newReleasesBooks)
      } catch (error) {
        console.error('Error loading books:', error)
      } finally {
        setLoading(false)
      }
    }

    loadBooks()
  }, [])

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
          <div className="w-64 h-10 bg-gray-200 rounded animate-pulse" />
        </div>
        {[1, 2, 3].map((section) => (
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
            className="w-64 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Featured Books Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Featured Books</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {featured.map((book) => (
            <Link key={book.id} href={`/books/${book.id}`} className="flex flex-col gap-2 group">
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
              <h3 className="font-medium line-clamp-1 group-hover:text-blue-600">{book.title}</h3>
              <p className="text-sm text-gray-600 line-clamp-1">{book.author}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Popular This Week */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Popular This Week</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {popular.map((book) => (
            <Link key={book.id} href={`/books/${book.id}`} className="flex flex-col gap-2 group">
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
              <h3 className="font-medium line-clamp-1 group-hover:text-blue-600">{book.title}</h3>
              <p className="text-sm text-gray-600 line-clamp-1">{book.author}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* New Releases */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">New Releases</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {newReleases.map((book) => (
            <Link key={book.id} href={`/books/${book.id}`} className="flex flex-col gap-2 group">
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
              <h3 className="font-medium line-clamp-1 group-hover:text-blue-600">{book.title}</h3>
              <p className="text-sm text-gray-600 line-clamp-1">{book.author}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
