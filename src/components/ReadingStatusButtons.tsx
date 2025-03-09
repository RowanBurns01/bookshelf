import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { updateBookStatus, getUserBooks, removeBook } from '@/lib/api'
import { toast } from 'react-hot-toast'

interface ReadingStatusButtonsProps {
  bookId: string
  className?: string
  onStatusChange?: () => void
}

export function ReadingStatusButtons({ 
  bookId, 
  className = '',
  onStatusChange 
}: ReadingStatusButtonsProps) {
  const { data: session } = useSession()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [currentStatus, setCurrentStatus] = useState<string | null>(null)

  useEffect(() => {
    async function fetchBookStatus() {
      if (session?.user?.id) {
        try {
          const userBooks = await getUserBooks(session.user.id)
          const book = userBooks.find((book: any) => book.bookId === bookId)
          if (book) {
            setCurrentStatus(book.status)
          }
        } catch (error) {
          console.error('Error fetching book status:', error)
        }
      }
    }

    fetchBookStatus()
  }, [session?.user?.id, bookId])

  const handleStatusUpdate = async (status: 'reading' | 'completed' | 'want-to-read') => {
    if (!session?.user?.id) {
      toast.error('Please sign in to add books to your lists')
      return
    }

    setIsUpdating(true)
    try {
      await updateBookStatus(session.user.id, bookId, status)
      setCurrentStatus(status)
      toast.success(`Added to ${status.replace(/-/g, ' ')}`)
      setIsMenuOpen(false)
      onStatusChange?.()
    } catch (error) {
      console.error('Error updating book status:', error)
      toast.error('Failed to update book status')
    } finally {
      setIsUpdating(false)
    }
  }

  const handleRemove = async () => {
    if (!session?.user?.id) return

    setIsUpdating(true)
    try {
      await removeBook(session.user.id, bookId)
      setCurrentStatus(null)
      toast.success('Book removed from your list')
      setIsMenuOpen(false)
      onStatusChange?.()
    } catch (error) {
      console.error('Error removing book:', error)
      toast.error('Failed to remove book')
    } finally {
      setIsUpdating(false)
    }
  }

  const getButtonText = () => {
    if (isUpdating) return 'Updating...'
    if (!currentStatus) return 'Add to List'
    return `${currentStatus.charAt(0).toUpperCase() + currentStatus.slice(1).replace(/-/g, ' ')}`
  }

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        disabled={isUpdating}
        className={`px-4 py-2 rounded-lg transition-colors disabled:opacity-50 ${
          currentStatus
            ? 'bg-green-500 hover:bg-green-600 text-white'
            : 'bg-blue-500 hover:bg-blue-600 text-white'
        }`}
      >
        {getButtonText()}
      </button>
      {isMenuOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10">
          <button
            onClick={() => handleStatusUpdate('reading')}
            className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded-t-lg ${
              currentStatus === 'reading' ? 'bg-gray-100 dark:bg-gray-700' : ''
            }`}
          >
            Currently Reading
          </button>
          <button
            onClick={() => handleStatusUpdate('completed')}
            className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 ${
              currentStatus === 'completed' ? 'bg-gray-100 dark:bg-gray-700' : ''
            }`}
          >
            Completed
          </button>
          <button
            onClick={() => handleStatusUpdate('want-to-read')}
            className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 ${
              currentStatus === 'want-to-read' ? 'bg-gray-100 dark:bg-gray-700' : ''
            }`}
          >
            Want to Read
          </button>
          {currentStatus && (
            <button
              onClick={handleRemove}
              className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 border-t border-gray-200 dark:border-gray-700 rounded-b-lg"
            >
              Remove from List
            </button>
          )}
        </div>
      )}
    </div>
  )
} 