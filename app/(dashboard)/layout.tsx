'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Navbar } from '@/components/layout/navbar'
import { Sidebar } from '@/components/layout/sidebar'
import { Loader2 } from 'lucide-react'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    )
  }

  if (status === 'unauthenticated') {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Grid Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gray-50 dark:bg-gray-950" />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(156, 163, 175, 0.15) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(156, 163, 175, 0.15) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px'
          }}
        />
        <div
          className="absolute inset-0 dark:block hidden"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(75, 85, 99, 0.2) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(75, 85, 99, 0.2) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px'
          }}
        />
        {/* Gradient overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-gray-50/50 dark:to-gray-950/50" />
      </div>

      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="md:ml-64">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="p-4 sm:p-6 lg:p-8 animate-fade-in">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
