import { Navbar } from '@/components/layout/Navbar'

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  )
}
