'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  FileText,
  MessageSquare,
  Trophy,
  Coins,
  Settings,
  Shield,
  X,
  Zap,
  LayoutDashboard,
  Brain,
  User
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useSession } from 'next-auth/react'

const baseNavigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'CV Optimizer', href: '/cv', icon: FileText },
  { name: 'Interview', href: '/interview', icon: MessageSquare },
  { name: 'Daily Quiz', href: '/quiz', icon: Brain, requiresCV: true },
  { name: 'Achievements', href: '/achievements', icon: Trophy },
  { name: 'Points', href: '/points', icon: Coins },
  { name: 'Profile', href: '/profile', icon: User },
  { name: 'Settings', href: '/settings', icon: Settings },
]

const adminNavigation = [
  { name: 'Admin Panel', href: '/admin', icon: Shield },
]

interface SidebarProps {
  open?: boolean
  onClose?: () => void
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname()
  const { data: session } = useSession()
  const isAdmin = session?.user?.role === 'ADMIN'
  const [hasCV, setHasCV] = useState(false)

  useEffect(() => {
    const checkCVStatus = async () => {
      try {
        const res = await fetch('/api/cv/status')
        if (res.ok) {
          const data = await res.json()
          setHasCV(data.hasCV)
        }
      } catch {
        // Ignore errors
      }
    }
    if (session?.user) {
      checkCVStatus()
    }
  }, [session?.user])

  const navigation = baseNavigation.filter(item =>
    !item.requiresCV || hasCV
  )

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 z-50 w-64 h-screen bg-white dark:bg-gray-950 border-r border-gray-200 dark:border-gray-800 transform transition-transform duration-200 md:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo Header */}
          <div className="h-16 flex items-center px-4 border-b border-gray-200 dark:border-gray-800">
            <Link href="/dashboard" className="flex items-center gap-3 group">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center shadow-lg shadow-purple-500/20 group-hover:shadow-purple-500/30 transition-shadow">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl">SkillBoost</span>
            </Link>
          </div>

          {/* Mobile close button */}
          <div className="absolute top-4 right-4 md:hidden">
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Link>
              )
            })}

            {isAdmin && (
              <>
                <div className="pt-4 pb-2">
                  <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Admin
                  </p>
                </div>
                {adminNavigation.map((item) => {
                  const isActive = pathname.startsWith(item.href)
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={onClose}
                      className={cn(
                        'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                        isActive
                          ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
                          : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                      )}
                    >
                      <item.icon className="h-5 w-5" />
                      {item.name}
                    </Link>
                  )
                })}
              </>
            )}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t space-y-1">
            <p className="text-xs text-muted-foreground text-center">
              SkillBoost v1.0
            </p>
            <p className="text-xs text-muted-foreground text-center">
              by{' '}
              <a
                href="https://merzougrayane.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-600 hover:underline"
              >
                MrSmith
              </a>
            </p>
          </div>
        </div>
      </aside>
    </>
  )
}
