import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Trophy,
  FileText,
  MessageSquare,
  Star,
  Flame,
  CheckCircle,
  Award,
  Lock,
  UserPlus,
  TrendingUp,
  Target,
  Users,
  Sparkles,
  Brain,
  BookOpen,
  GraduationCap,
  Zap,
  Heart,
  Gem,
  Coins,
  Calendar,
  Crown,
  Sunrise,
  Moon,
  BadgeCheck
} from 'lucide-react'

const iconMap: Record<string, any> = {
  FileText,
  MessageSquare,
  Trophy,
  Star,
  Flame,
  CheckCircle,
  Award,
  UserPlus,
  TrendingUp,
  Target,
  Users,
  Sparkles,
  Brain,
  BookOpen,
  GraduationCap,
  Zap,
  Heart,
  Gem,
  Coins,
  Calendar,
  Crown,
  Sunrise,
  Moon,
  BadgeCheck,
}

export default async function AchievementsPage() {
  const session = await auth()

  if (!session?.user) {
    redirect('/login')
  }

  const achievements = await db.achievement.findMany({
    include: {
      userAchievements: {
        where: { userId: session.user.id }
      }
    }
  })

  const earnedCount = achievements.filter((a: typeof achievements[0]) => a.userAchievements.length > 0).length
  const totalPoints = achievements
    .filter((a: typeof achievements[0]) => a.userAchievements.length > 0)
    .reduce((sum: number, a: typeof achievements[0]) => sum + a.points, 0)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Achievements</h1>
        <p className="text-muted-foreground mt-1">
          Track your progress and unlock badges
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <Trophy className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{earnedCount}/{achievements.length}</p>
                <p className="text-sm text-muted-foreground">Badges Earned</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                <Star className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalPoints}</p>
                <p className="text-sm text-muted-foreground">Points Earned</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {Math.round((earnedCount / achievements.length) * 100) || 0}%
                </p>
                <p className="text-sm text-muted-foreground">Completion</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Achievements Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {achievements.map((achievement: typeof achievements[0]) => {
          const isEarned = achievement.userAchievements.length > 0
          const Icon = iconMap[achievement.icon] || Trophy

          return (
            <Card
              key={achievement.id}
              className={isEarned ? '' : 'opacity-60'}
            >
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center relative ${
                    isEarned
                      ? 'bg-gradient-to-br from-purple-500 to-purple-700 text-white shadow-lg'
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    <Icon className="h-7 w-7" />
                    {!isEarned && (
                      <div className="absolute -bottom-1 -right-1 bg-background rounded-full p-0.5">
                        <Lock className="h-3 w-3 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{achievement.name}</h3>
                      {isEarned && (
                        <Badge variant="success" className="text-xs">
                          +{achievement.points}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {achievement.description}
                    </p>
                    {isEarned && achievement.userAchievements[0] && (
                      <p className="text-xs text-muted-foreground mt-2">
                        Earned {new Date(achievement.userAchievements[0].earnedAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
