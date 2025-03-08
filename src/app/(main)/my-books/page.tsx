'use client'

import { getUserBooks } from '@/lib/api'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import { useState, useEffect } from 'react'

type Book = Awaited<ReturnType<typeof getUserBooks>>[0]

export default function MyBooksPage() {
  const { data: session } = useSession()
  const [activeTab, setActiveTab] = useState<'reading' | 'completed' | 'want-to-read'>('reading')
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadBooks() {
      if (session?.user?.id) {
        setLoading(true)
        const userBooks = await getUserBooks(session.user.id, activeTab)
        setBooks(userBooks)
        setLoading(false)
      }
    }

    loadBooks()
  }, [session?.user?.id, activeTab])

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Books</h1>
        <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
          Add Book
        </button>
      </div>

      {/* Reading Status Tabs */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('reading')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'reading'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Currently Reading
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'completed'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Completed
          </button>
          <button
            onClick={() => setActiveTab('want-to-read')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'want-to-read'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Want to Read
          </button>
        </nav>
      </div>

      {/* Book Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          // Loading skeletons
          [...Array(6)].map((_, i) => (
            <div
              key={i}
              className="flex gap-4 p-4 border border-gray-200 rounded-lg"
            >
              <div className="w-24 aspect-[2/3] bg-gray-200 rounded animate-pulse" />
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2 animate-pulse" />
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4 animate-pulse" />
                <div className="h-20 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
          ))
        ) : books.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-500">
            No books found in this category.
          </div>
        ) : (
          books.map((book) => (
            <div
              key={book.id}
              className="flex gap-4 p-4 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow"
            >
              <div className="w-24 aspect-[2/3] relative overflow-hidden rounded">
                {book.coverImage ? (
                  <Image
                    src={book.coverImage}
                    alt={book.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    📚
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-medium">{book.title}</h3>
                <p className="text-sm text-gray-600 mb-2">{book.author}</p>
                <p className="text-sm text-gray-500 line-clamp-3">
                  {book.description}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
} 