import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { Navbar } from '@/components/layout/navbar'
import Link from 'next/link'
import { Shield, Users, CreditCard, LayoutDashboard } from 'lucide-react'

const adminNav = [
  { name: 'Overview', href: '/admin', icon: LayoutDashboard },
  { name: 'Users', href: '/admin/users', icon: Users },
  { name: 'Requests', href: '/admin/requests', icon: CreditCard },
]

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session?.user) {
    redirect('/login')
  }

  if (session.user.role !== 'ADMIN') {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex">
        <aside className="w-64 border-r min-h-[calc(100vh-4rem)] p-4">
          <div className="flex items-center gap-2 mb-6 px-3">
            <Shield className="h-5 w-5 text-purple-600" />
            <span className="font-semibold">Admin Panel</span>
          </div>
          <nav className="space-y-1">
            {adminNav.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            ))}
          </nav>
        </aside>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}
