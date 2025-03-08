import { PrismaClient } from '@prisma/client'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { BookStatusButton } from '@/components/BookStatusButton'
import { formatDate } from '@/lib/utils'

const prisma = new PrismaClient()

function getGoogleBooksCover(googleBooksId: string | null, isbn: string | null) {
  if (googleBooksId) {
    return `https://books.google.com/books/content?id=${googleBooksId}&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api`
  }
  if (isbn) {
    return `https://books.google.com/books/content?vid=ISBN${isbn}&printsec=frontcover&img=1&zoom=1`
  }
  return `https://books.google.com/googlebooks/images/no_cover_thumb.gif`
}

function getAvatarUrl(name: string | null, image: string | null) {
  if (image) return image
  const encodedName = encodeURIComponent(name || 'Anonymous')
  return `https://ui-avatars.com/api/?name=${encodedName}&background=random`
}

async function getBook(bookId: string) {
  const book = await prisma.book.findUnique({
    where: { id: bookId },
    include: {
      reviews: {
        include: {
          user: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      },
    },
  })

  if (!book) {
    notFound()
  }

  return book
}

export default async function BookPage({ params }: { params: { bookId: string } }) {
  const book = await getBook(params.bookId)
  const coverImage = book.coverImage || getGoogleBooksCover(book.googleBooksId, book.isbn)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Book Cover */}
        <div className="md:col-span-1">
          <div className="relative aspect-[2/3] w-full">
            <Image
              src={coverImage}
              alt={`Cover of ${book.title}`}
              fill
              className="object-cover rounded-lg shadow-lg"
              priority
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          </div>
        </div>

        {/* Book Details */}
        <div className="md:col-span-2">
          <h1 className="text-3xl font-bold mb-2">{book.title}</h1>
          <h2 className="text-xl text-gray-600 mb-4">by {book.author}</h2>

          <div className="flex items-center gap-4 mb-6">
            <BookStatusButton bookId={book.id} />
            {book.averageRating && (
              <div className="flex items-center">
                <span className="text-yellow-400">★</span>
                <span className="ml-1">{book.averageRating.toFixed(1)}</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <h3 className="text-sm font-semibold text-gray-500">ISBN</h3>
              <p>{book.isbn || 'Not available'}</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-500">Pages</h3>
              <p>{book.pageCount || 'Unknown'}</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-500">Published</h3>
              <p>{book.publishDate ? formatDate(book.publishDate) : 'Unknown'}</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-500">Reviews</h3>
              <p>{book.reviewCount}</p>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-2">Description</h3>
            <p className="text-gray-600 whitespace-pre-line">
              {book.description || 'No description available.'}
            </p>
          </div>

          {/* Reviews Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Reviews</h3>
            {book.reviews.length > 0 ? (
              <div className="space-y-4">
                {book.reviews.map((review) => (
                  <div key={review.id} className="border-b pb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Image
                        src={getAvatarUrl(review.user.name, review.user.image)}
                        alt={review.user.name || 'Anonymous'}
                        width={32}
                        height={32}
                        className="rounded-full"
                      />
                      <div>
                        <p className="font-semibold">{review.user.name || 'Anonymous'}</p>
                        <p className="text-sm text-gray-500">{formatDate(review.createdAt)}</p>
                      </div>
                    </div>
                    <div className="flex items-center mb-2">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span
                          key={i}
                          className={`text-lg ${
                            i < review.rating ? 'text-yellow-400' : 'text-gray-300'
                          }`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    {review.content && <p className="text-gray-600">{review.content}</p>}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No reviews yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
