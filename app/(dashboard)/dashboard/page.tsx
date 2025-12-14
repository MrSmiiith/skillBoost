import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import {
  FileText,
  MessageSquare,
  Trophy,
  Zap,
  ArrowRight,
  TrendingUp,
  Target,
  Calendar,
  Clock,
  ChevronRight
} from 'lucide-react'

export default async function DashboardPage() {
  const session = await auth()

  if (!session?.user) {
    redirect('/login')
  }

  const userPoints = Math.max(0, session.user.points || 0)
  const dailyUsage = session.user.dailyUsage || 0
  const dailyLimit = 5
  const remainingTasks = Math.max(0, dailyLimit - dailyUsage)

  // Fetch user stats
  const [cvCount, interviewCount, recentCVs, achievements] = await Promise.all([
    db.cVVersion.count({ where: { userId: session.user.id } }),
    db.interview.count({ where: { userId: session.user.id } }),
    db.cVVersion.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
      take: 3,
      select: {
        id: true,
        targetRole: true,
        scores: true,
        createdAt: true,
      },
    }),
    db.userAchievement.count({ where: { userId: session.user.id } }),
  ])

  // Calculate best CV score
  const bestScore = recentCVs.reduce((max: number, cv: typeof recentCVs[0]) => {
    const scores = cv.scores as { overall?: number } | null
    return (scores?.overall || 0) > max ? scores?.overall || 0 : max
  }, 0)

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Welcome back, {session.user.name?.split(' ')[0] || 'there'}!
          </h1>
          <p className="text-muted-foreground mt-1">
            Ready to boost your skills today?
          </p>
        </div>
        <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          {new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-200 dark:border-purple-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Points Balance</CardTitle>
            <div className="h-8 w-8 rounded-full bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center">
              <Zap className="h-4 w-4 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{userPoints}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Available for tasks
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">CV Optimizations</CardTitle>
            <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
              <FileText className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{cvCount}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Total CVs analyzed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Interviews</CardTitle>
            <div className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center">
              <MessageSquare className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{interviewCount}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Practice sessions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Best CV Score</CardTitle>
            <div className="h-8 w-8 rounded-full bg-yellow-100 dark:bg-yellow-900/50 flex items-center justify-center">
              <TrendingUp className="h-4 w-4 text-yellow-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{bestScore || '-'}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Highest overall score
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Progress Section */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Daily Usage</CardTitle>
            <CardDescription>Tasks remaining for today</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-purple-600" />
                <span className="font-medium">{remainingTasks} of {dailyLimit} tasks left</span>
              </div>
              <Badge variant={remainingTasks > 2 ? 'default' : 'destructive'}>
                {remainingTasks > 0 ? 'Available' : 'Limit Reached'}
              </Badge>
            </div>
            <Progress value={((dailyLimit - remainingTasks) / dailyLimit) * 100} className="h-3" />
            <p className="text-sm text-muted-foreground">
              Daily limit resets at midnight. Use your tasks wisely!
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Achievements</CardTitle>
            <CardDescription>Your accomplishments</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-600" />
                <span className="font-medium">{achievements} badges earned</span>
              </div>
              <Link href="/achievements">
                <Button variant="ghost" size="sm" className="gap-1">
                  View All <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
            <Progress value={Math.min((achievements / 10) * 100, 100)} className="h-3" />
            <p className="text-sm text-muted-foreground">
              {10 - achievements > 0 ? `${10 - achievements} more to reach next milestone` : 'Great job! Keep going!'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent CVs */}
      {recentCVs.length > 0 && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg">Recent CV Optimizations</CardTitle>
              <CardDescription>Your latest analyzed CVs</CardDescription>
            </div>
            <Link href="/cv/history">
              <Button variant="outline" size="sm" className="gap-1">
                View All <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentCVs.map((cv: typeof recentCVs[0]) => {
                const scores = cv.scores as { overall?: number } | null
                return (
                  <Link key={cv.id} href={`/cv/${cv.id}`}>
                    <div className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                          <FileText className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                          <p className="font-medium">{cv.targetRole || 'Untitled CV'}</p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {new Date(cv.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p className={`text-lg font-bold ${
                            (scores?.overall ?? 0) >= 80 ? 'text-green-600' :
                            (scores?.overall ?? 0) >= 60 ? 'text-yellow-600' : 'text-red-600'
                          }`}>
                            {scores?.overall ?? 0}%
                          </p>
                          <p className="text-xs text-muted-foreground">Overall</p>
                        </div>
                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="hover:border-purple-500/50 transition-colors group">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/20 group-hover:shadow-purple-500/30 transition-shadow">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle>CV Optimizer</CardTitle>
                <CardDescription>Enhance your resume with AI</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Upload your CV and get instant feedback on clarity, impact, and ATS readiness.
            </p>
            <Button asChild className="w-full" variant="gradient">
              <Link href="/cv">
                Optimize CV <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:border-purple-500/50 transition-colors group">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg shadow-green-500/20 group-hover:shadow-green-500/30 transition-shadow">
                <MessageSquare className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle>Interview Practice</CardTitle>
                <CardDescription>Simulate real interviews</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Practice with AI-powered mock interviews tailored to your target role.
            </p>
            <Button asChild className="w-full" variant="gradient">
              <Link href="/interview">
                Start Interview <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Low Points Warning */}
      {userPoints < 3 && (
        <Card className="border-yellow-500/50 bg-yellow-50 dark:bg-yellow-900/10">
          <CardContent className="flex items-center justify-between py-4">
            <div className="flex items-center gap-3">
              <Zap className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="font-medium">Running low on points!</p>
                <p className="text-sm text-muted-foreground">
                  Get more points to continue using AI features.
                </p>
              </div>
            </div>
            <Button asChild variant="outline">
              <Link href="/points">Get Points</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
