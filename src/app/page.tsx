import Link from 'next/link'

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold text-center mb-8">
          Welcome to Bookshelf
        </h1>
        <p className="text-center mb-8 text-lg">
          Your personal space to track and share your reading journey.
        </p>
        <div className="flex justify-center gap-4">
          <Link
            href="/login"
            className="rounded-lg px-4 py-2 bg-blue-500 text-white hover:bg-blue-600 transition-colors"
          >
            Login
          </Link>
          <Link
            href="/signup"
            className="rounded-lg px-4 py-2 bg-green-500 text-white hover:bg-green-600 transition-colors"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  )
}
