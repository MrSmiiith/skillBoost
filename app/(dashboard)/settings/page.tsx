import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { ThemeToggle } from '@/components/layout/theme-toggle'

export default async function SettingsPage() {
  const session = await auth()

  if (!session?.user) {
    redirect('/login')
  }

  const initials = session.user.name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase() || 'U'

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage your account settings
        </p>
      </div>

      {/* Profile */}
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Your account information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={session.user.image || undefined} />
              <AvatarFallback className="text-lg bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-lg">{session.user.name}</h3>
              <p className="text-muted-foreground">{session.user.email}</p>
              <Badge className="mt-1" variant={session.user.role === 'ADMIN' ? 'default' : 'secondary'}>
                {session.user.role}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Appearance */}
      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>Customize the look of the app</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Theme</p>
              <p className="text-sm text-muted-foreground">
                Switch between light and dark mode
              </p>
            </div>
            <ThemeToggle />
          </div>
        </CardContent>
      </Card>

      {/* Account Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Account Stats</CardTitle>
          <CardDescription>Your usage statistics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="text-center p-4 bg-muted rounded-lg">
              <p className="text-2xl font-bold">{session.user.points}</p>
              <p className="text-sm text-muted-foreground">Points</p>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <p className="text-2xl font-bold">{5 - session.user.dailyUsage}</p>
              <p className="text-sm text-muted-foreground">Tasks Left Today</p>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <p className="text-2xl font-bold">0</p>
              <p className="text-sm text-muted-foreground">Total Sessions</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
