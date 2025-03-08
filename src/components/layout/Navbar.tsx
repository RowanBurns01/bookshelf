import Link from 'next/link'

export function Navbar() {
  return (
    <nav className="bg-white shadow-sm dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/" className="flex-shrink-0 flex items-center text-xl font-bold">
              📚 Bookshelf
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                href="/discover"
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 dark:text-gray-100"
              >
                Discover
              </Link>
              <Link
                href="/my-books"
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 dark:text-gray-100"
              >
                My Books
              </Link>
              <Link
                href="/lists"
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 dark:text-gray-100"
              >
                Lists
              </Link>
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <div className="ml-3 relative">
              <Link
                href="/profile"
                className="text-sm font-medium text-gray-900 dark:text-gray-100"
              >
                Profile
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
