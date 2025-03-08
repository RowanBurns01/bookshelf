'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'

type Status = 'want-to-read' | 'reading' | 'completed'

interface BookStatusButtonProps {
  bookId: string
}

export function BookStatusButton({ bookId }: BookStatusButtonProps) {
  const { data: session } = useSession()
  const [status, setStatus] = useState<Status | null>(null)
  const [isOpen, setIsOpen] = useState(false)

  const statusOptions: { value: Status; label: string }[] = [
    { value: 'want-to-read', label: 'Want to Read' },
    { value: 'reading', label: 'Currently Reading' },
    { value: 'completed', label: 'Completed' },
  ]

  async function updateStatus(newStatus: Status) {
    if (!session?.user) return

    try {
      const response = await fetch(`/api/users/${session.user.id}/books`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookId,
          status: newStatus,
        }),
      })

      if (response.ok) {
        setStatus(newStatus)
      }
    } catch (error) {
      console.error('Error updating book status:', error)
    }

    setIsOpen(false)
  }

  if (!session?.user) {
    return (
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
        onClick={() => alert('Please sign in to track your reading progress')}
      >
        Want to Read
      </button>
    )
  }

  return (
    <div className="relative">
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        {status ? statusOptions.find(opt => opt.value === status)?.label : 'Want to Read'}
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
          <div className="py-1" role="menu">
            {statusOptions.map((option) => (
              <button
                key={option.value}
                className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                  status === option.value ? 'bg-gray-50' : ''
                }`}
                onClick={() => updateStatus(option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
} 