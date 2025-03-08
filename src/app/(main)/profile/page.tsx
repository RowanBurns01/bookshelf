'use client'

import { getRecentActivity, getUserProfile } from '@/lib/api'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import { useState, useEffect } from 'react'

interface Book {
  id: string
  title: string
  author: string
  coverImage: string | null
}

interface Review {
  id: string
  book: Book
  rating: number
  content: string | null
  createdAt: string
}

type Profile = Awaited<ReturnType<typeof getUserProfile>>
type Activity = Review[]

export default function ProfilePage() {
  const { data: session } = useSession()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [activity, setActivity] = useState<Activity>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadProfile() {
      if (session?.user?.id) {
        setLoading(true)
        const [userProfile, recentActivity] = await Promise.all([
          getUserProfile(session.user.id),
          getRecentActivity(session.user.id),
        ])
        setProfile(userProfile)
        setActivity(recentActivity)
        setLoading(false)
      }
    }

    loadProfile()
  }, [session?.user?.id])

  if (loading || !profile) {
    return <ProfileSkeleton />
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Profile Header */}
      <div className="mb-8">
        <div className="flex items-center gap-6">
          <div className="h-24 w-24 relative rounded-full overflow-hidden">
            {profile.user?.image ? (
              <Image
                src={profile.user.image}
                alt={profile.user.name || ''}
                fill
                className="object-cover"
              />
            ) : (
              <div className="h-full w-full bg-gray-200 flex items-center justify-center">👤</div>
            )}
          </div>
          <div>
            <h1 className="text-3xl font-bold">{profile.user?.name}</h1>
            <p className="text-gray-600">{profile.user?.email}</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Books Read', value: profile.stats.booksCount },
          { label: 'Reading Now', value: '0' },
          { label: 'Want to Read', value: '0' },
          { label: 'Lists Created', value: profile.stats.listsCount },
        ].map((stat, i) => (
          <div key={i} className="p-4 bg-white rounded-lg shadow">
            <div className="text-sm text-gray-500">{stat.label}</div>
            <div className="text-2xl font-semibold">{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Reading Activity */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Reading Activity</h2>
        <div className="space-y-4">
          {activity.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No recent activity to show.</p>
          ) : (
            activity.map((review: Review) => (
              <div key={review.id} className="flex gap-4 p-4 bg-white rounded-lg shadow">
                <div className="w-16 aspect-[2/3] relative overflow-hidden rounded">
                  {review.book.coverImage ? (
                    <Image
                      src={review.book.coverImage}
                      alt={review.book.title}
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
                  <h3 className="font-medium">{review.book.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">{review.book.author}</p>
                  <p className="text-sm text-gray-500">
                    {review.content || `Rated ${review.rating} stars`}
                  </p>
                </div>
                <div className="text-sm text-gray-500 whitespace-nowrap">
                  {new Date(review.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Reading Stats */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Reading Stats</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Books per Month */}
          <div className="p-4 bg-white rounded-lg shadow">
            <h3 className="text-lg font-medium mb-4">Books per Month</h3>
            <div className="h-64 bg-gray-100 rounded flex items-center justify-center text-gray-500">
              Coming soon
            </div>
          </div>

          {/* Genre Distribution */}
          <div className="p-4 bg-white rounded-lg shadow">
            <h3 className="text-lg font-medium mb-4">Genre Distribution</h3>
            <div className="h-64 bg-gray-100 rounded flex items-center justify-center text-gray-500">
              Coming soon
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ProfileSkeleton() {
  return (
    <div className="max-w-7xl mx-auto animate-pulse">
      <div className="mb-8">
        <div className="flex items-center gap-6">
          <div className="h-24 w-24 bg-gray-200 rounded-full" />
          <div>
            <div className="h-8 bg-gray-200 rounded w-48 mb-2" />
            <div className="h-4 bg-gray-200 rounded w-32" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="p-4 bg-white rounded-lg shadow">
            <div className="text-sm text-gray-500">Loading...</div>
            <div className="h-8 bg-gray-200 rounded w-12 mt-1" />
          </div>
        ))}
      </div>

      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex gap-4 p-4 bg-white rounded-lg shadow">
            <div className="w-16 aspect-[2/3] bg-gray-200 rounded" />
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-4" />
              <div className="h-4 bg-gray-200 rounded w-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
