'use client'

import { getUserLists } from '@/lib/api'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'

interface Book {
  id: string
  title: string
  coverImage: string | null
}

interface ListBook {
  book: Book
}

interface List {
  id: string
  name: string
  description: string | null
  isPublic: boolean
  books: ListBook[]
}

type Lists = List[]

export default function ListsPage() {
  const { data: session } = useSession()
  const [lists, setLists] = useState<Lists>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadLists() {
      if (session?.user?.id) {
        setLoading(true)
        const userLists = await getUserLists(session.user.id)
        setLists(userLists)
        setLoading(false)
      }
    }

    loadLists()
  }, [session?.user?.id])

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Lists</h1>
        <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
          Create New List
        </button>
      </div>

      {/* Lists Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          // Loading skeletons
          [...Array(6)].map((_, i) => (
            <div
              key={i}
              className="p-6 border border-gray-200 rounded-lg"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="h-6 bg-gray-200 rounded w-48 mb-2 animate-pulse" />
                  <div className="h-4 bg-gray-200 rounded w-24 animate-pulse" />
                </div>
                <div className="h-6 w-6 bg-gray-200 rounded-full animate-pulse" />
              </div>
              
              <div className="mb-4">
                <div className="h-4 bg-gray-200 rounded w-full mb-2 animate-pulse" />
                <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
              </div>

              <div className="flex gap-2">
                {[...Array(4)].map((_, j) => (
                  <div
                    key={j}
                    className="w-16 aspect-[2/3] bg-gray-200 rounded animate-pulse"
                  />
                ))}
              </div>
            </div>
          ))
        ) : lists.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-500">
            No lists found. Create your first list!
          </div>
        ) : (
          lists.map((list: List) => (
            <Link
              key={list.id}
              href={`/lists/${list.id}`}
              className="p-6 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-medium mb-1">{list.name}</h3>
                  <p className="text-sm text-gray-500">
                    {list.books.length} books
                  </p>
                </div>
                {!list.isPublic && (
                  <span className="text-sm text-gray-500">🔒 Private</span>
                )}
              </div>
              
              {list.description && (
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {list.description}
                </p>
              )}

              <div className="flex gap-2">
                {list.books.slice(0, 4).map(({ book }) => (
                  <div
                    key={book.id}
                    className="w-16 aspect-[2/3] relative overflow-hidden rounded"
                  >
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
                ))}
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  )
} 