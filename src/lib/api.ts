// Book-related API calls
export async function getFeaturedBooks() {
  const response = await fetch('/api/books?type=featured')
  if (!response.ok) {
    throw new Error('Failed to fetch featured books')
  }
  return response.json()
}

export async function getTrendingBooks() {
  const response = await fetch('/api/books?type=trending')
  if (!response.ok) {
    throw new Error('Failed to fetch trending books')
  }
  return response.json()
}

export async function getNewReleases() {
  const response = await fetch('/api/books?type=new')
  if (!response.ok) {
    throw new Error('Failed to fetch new releases')
  }
  return response.json()
}

export async function searchBooks(query: string, page = 1, limit = 12) {
  const response = await fetch(`/api/books?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`)
  if (!response.ok) {
    throw new Error('Failed to search books')
  }
  return response.json()
}

// User-related API calls
export async function getUserBooks(
  userId: string,
  status?: 'reading' | 'completed' | 'want-to-read'
) {
  try {
    const response = await fetch(`/api/users/${userId}/books${status ? `?status=${status}` : ''}`)
    if (!response.ok) {
      console.error('Failed to fetch user books:', response.statusText)
      return []
    }
    return response.json()
  } catch (error) {
    console.error('Error fetching user books:', error)
    return []
  }
}

export async function getUserProfile(userId: string) {
  try {
    const response = await fetch(`/api/users/${userId}/profile`)
    if (!response.ok) {
      console.error('Failed to fetch user profile:', response.statusText)
      return {
        user: null,
        stats: {
          booksCount: 0,
        }
      }
    }
    return response.json()
  } catch (error) {
    console.error('Error fetching user profile:', error)
    return {
      user: null,
      stats: {
        booksCount: 0,
      }
    }
  }
}

export async function getRecentActivity(userId: string) {
  try {
    const response = await fetch(`/api/users/${userId}/activity`)
    if (!response.ok) {
      console.error('Failed to fetch recent activity:', response.statusText)
      return []
    }
    return response.json()
  } catch (error) {
    console.error('Error fetching recent activity:', error)
    return []
  }
}

export async function updateBookStatus(
  userId: string,
  bookId: string,
  status: 'reading' | 'completed' | 'want-to-read'
) {
  const response = await fetch(`/api/users/${userId}/books/status`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userId, bookId, status }),
  })

  if (!response.ok) {
    throw new Error('Failed to update book status')
  }

  return response.json()
}

export async function removeBook(userId: string, bookId: string) {
  const response = await fetch(`/api/users/${userId}/books/status`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ bookId }),
  })

  if (!response.ok) {
    throw new Error('Failed to remove book')
  }

  return response.json()
}
