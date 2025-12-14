'use client'

import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { Zap, Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/layout/theme-toggle'
import { UserMenu } from '@/components/layout/user-menu'
import { Badge } from '@/components/ui/badge'
import { NavStatusBadge } from '@/components/layout/status-badge'

interface NavbarProps {
  onMenuClick?: () => void
}

export function Navbar({ onMenuClick }: NavbarProps) {
  const { data: session } = useSession()

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-200/50 dark:border-gray-800/50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm">
      <div className="flex h-16 items-center px-4 gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={onMenuClick}
        >
          <Menu className="h-5 w-5" />
        </Button>

        <div className="flex-1" />

        <NavStatusBadge />

        {session?.user && (
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="gap-1.5 px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 border-0">
              <Zap className="w-3.5 h-3.5" />
              <span className="font-semibold">{session.user.points}</span>
              <span className="text-purple-500 dark:text-purple-500">pts</span>
            </Badge>
          </div>
        )}

        <ThemeToggle />

        {session?.user ? (
          <UserMenu user={session.user} />
        ) : (
          <Button asChild className="bg-gradient-to-r from-purple-600 to-purple-500 hover:opacity-90 text-white border-0">
            <Link href="/login">Sign In</Link>
          </Button>
        )}
      </div>
    </header>
  )
}
