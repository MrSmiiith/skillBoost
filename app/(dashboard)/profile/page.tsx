'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import {
  User,
  Zap,
  FileText,
  MessageSquare,
  Brain,
  Trophy,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
  CreditCard,
  Receipt,
  TrendingUp,
  History,
  ImageIcon,
  ExternalLink
} from 'lucide-react'
import { format } from 'date-fns'

interface ProfileData {
  user: {
    id: string
    email: string
    name: string | null
    image: string | null
    points: number
    dailyUsage: number
    role: string
    createdAt: string
    lastReset: string
  }
  stats: {
    cvOptimizations: number
    interviews: number
    quizzesCompleted: number
    avgQuizScore: number
    totalPointsPurchased: number
    totalQuizPoints: number
    totalSpent: number
    pointsUsed: number
  }
  pointRequests: {
    id: string
    pointsAmount: number
    priceDA: number
    paymentMethod: string
    receiptImage: string | null
    transactionId: string | null
    status: 'PENDING' | 'APPROVED' | 'REJECTED'
    adminNote: string | null
    createdAt: string
    processedAt: string | null
  }[]
  recentQuizzes: {
    id: string
    score: number
    completed: boolean
    createdAt: string
  }[]
}

const statusColors = {
  PENDING: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  APPROVED: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  REJECTED: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
}

const statusIcons = {
  PENDING: Clock,
  APPROVED: CheckCircle,
  REJECTED: XCircle
}

const paymentMethodLabels = {
  BARIDIMOB: 'BaridiMob',
  CCP: 'CCP',
  FLEXY: 'Flexy'
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const res = await fetch('/api/user/profile')
      if (res.ok) {
        const data = await res.json()
        setProfile(data)
      }
    } catch (err) {
      console.error('Failed to fetch profile')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Failed to load profile</p>
      </div>
    )
  }

  const { user, stats, pointRequests, recentQuizzes } = profile

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Profile</h1>
        <p className="text-muted-foreground mt-1">
          Your account details and activity history
        </p>
      </div>

      {/* User Info Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src={user.image || ''} />
              <AvatarFallback className="text-2xl bg-purple-100 text-purple-600">
                {user.name?.charAt(0) || user.email.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-2xl font-bold">{user.name || 'User'}</h2>
              <p className="text-muted-foreground">{user.email}</p>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-3">
                <Badge variant="outline" className="gap-1">
                  <User className="h-3 w-3" />
                  {user.role}
                </Badge>
                <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 gap-1">
                  <Zap className="h-3 w-3" />
                  {user.points} points
                </Badge>
                <Badge variant="outline" className="gap-1">
                  <Calendar className="h-3 w-3" />
                  Joined {format(new Date(user.createdAt), 'MMM yyyy')}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <FileText className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.cvOptimizations}</p>
                <p className="text-xs text-muted-foreground">CVs Optimized</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <MessageSquare className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.interviews}</p>
                <p className="text-xs text-muted-foreground">Interviews</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <Brain className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.quizzesCompleted}</p>
                <p className="text-xs text-muted-foreground">Quizzes Done</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                <Trophy className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.avgQuizScore}/10</p>
                <p className="text-xs text-muted-foreground">Avg Quiz Score</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Points Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Points Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center p-4 rounded-lg bg-muted/50">
              <p className="text-2xl font-bold text-purple-600">{user.points}</p>
              <p className="text-xs text-muted-foreground">Current Balance</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-muted/50">
              <p className="text-2xl font-bold text-green-600">+{stats.totalPointsPurchased}</p>
              <p className="text-xs text-muted-foreground">Purchased</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-muted/50">
              <p className="text-2xl font-bold text-blue-600">+{stats.totalQuizPoints}</p>
              <p className="text-xs text-muted-foreground">From Quizzes</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-muted/50">
              <p className="text-2xl font-bold text-red-600">-{stats.pointsUsed}</p>
              <p className="text-xs text-muted-foreground">Used</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-muted/50">
              <p className="text-2xl font-bold">{stats.totalSpent} DA</p>
              <p className="text-xs text-muted-foreground">Total Spent</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs for History */}
      <Tabs defaultValue="purchases" className="space-y-4">
        <TabsList>
          <TabsTrigger value="purchases" className="gap-2">
            <Receipt className="h-4 w-4" />
            Purchase History
          </TabsTrigger>
          <TabsTrigger value="quizzes" className="gap-2">
            <Brain className="h-4 w-4" />
            Quiz History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="purchases">
          <Card>
            <CardHeader>
              <CardTitle>Purchase History</CardTitle>
              <CardDescription>
                All your point purchase requests and their status
              </CardDescription>
            </CardHeader>
            <CardContent>
              {pointRequests.length === 0 ? (
                <div className="text-center py-8">
                  <CreditCard className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
                  <p className="text-muted-foreground">No purchase history yet</p>
                  <Button variant="link" className="mt-2" asChild>
                    <a href="/points">Buy Points</a>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {pointRequests.map((request) => {
                    const StatusIcon = statusIcons[request.status]
                    return (
                      <div
                        key={request.id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg border gap-4"
                      >
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0">
                            <Zap className="h-5 w-5 text-purple-600" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-semibold">{request.pointsAmount} Points</p>
                              <Badge className={statusColors[request.status]}>
                                <StatusIcon className="h-3 w-3 mr-1" />
                                {request.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {request.priceDA} DA via {paymentMethodLabels[request.paymentMethod as keyof typeof paymentMethodLabels]}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {format(new Date(request.createdAt), 'PPp')}
                            </p>
                            {request.transactionId && (
                              <p className="text-xs text-muted-foreground">
                                Transaction: {request.transactionId}
                              </p>
                            )}
                            {request.adminNote && (
                              <p className="text-xs mt-1 text-amber-600 dark:text-amber-400">
                                Note: {request.adminNote}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 sm:flex-col sm:items-end">
                          {request.receiptImage && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedImage(request.receiptImage)}
                              className="gap-1"
                            >
                              <ImageIcon className="h-3 w-3" />
                              View Proof
                            </Button>
                          )}
                          {request.status === 'APPROVED' && (
                            <p className="text-xs text-green-600">
                              +{request.pointsAmount} pts added
                            </p>
                          )}
                          {request.processedAt && (
                            <p className="text-xs text-muted-foreground">
                              Processed: {format(new Date(request.processedAt), 'PP')}
                            </p>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quizzes">
          <Card>
            <CardHeader>
              <CardTitle>Quiz History</CardTitle>
              <CardDescription>
                Your recent quiz attempts and scores
              </CardDescription>
            </CardHeader>
            <CardContent>
              {recentQuizzes.length === 0 ? (
                <div className="text-center py-8">
                  <Brain className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
                  <p className="text-muted-foreground">No quiz history yet</p>
                  <Button variant="link" className="mt-2" asChild>
                    <a href="/quiz">Take a Quiz</a>
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentQuizzes.map((quiz) => {
                    const pointsEarned = Math.floor(quiz.score / 5)
                    return (
                      <div
                        key={quiz.id}
                        className="flex items-center justify-between p-4 rounded-lg border"
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            quiz.score >= 8
                              ? 'bg-green-100 dark:bg-green-900/30'
                              : quiz.score >= 5
                              ? 'bg-yellow-100 dark:bg-yellow-900/30'
                              : 'bg-red-100 dark:bg-red-900/30'
                          }`}>
                            <Brain className={`h-5 w-5 ${
                              quiz.score >= 8
                                ? 'text-green-600'
                                : quiz.score >= 5
                                ? 'text-yellow-600'
                                : 'text-red-600'
                            }`} />
                          </div>
                          <div>
                            <p className="font-semibold">Daily Quiz</p>
                            <p className="text-xs text-muted-foreground">
                              {format(new Date(quiz.createdAt), 'PPp')}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-lg">{quiz.score}/10</p>
                          {quiz.completed && pointsEarned > 0 && (
                            <p className="text-xs text-green-600">+{pointsEarned} pts</p>
                          )}
                          {!quiz.completed && (
                            <Badge variant="outline" className="text-xs">Incomplete</Badge>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-3xl max-h-[90vh]">
            <img
              src={selectedImage}
              alt="Receipt proof"
              className="max-w-full max-h-[90vh] rounded-lg"
            />
            <Button
              variant="secondary"
              size="sm"
              className="absolute top-2 right-2"
              onClick={() => setSelectedImage(null)}
            >
              Close
            </Button>
            <a
              href={selectedImage}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute bottom-2 right-2"
              onClick={(e) => e.stopPropagation()}
            >
              <Button variant="secondary" size="sm" className="gap-1">
                <ExternalLink className="h-3 w-3" />
                Open Full
              </Button>
            </a>
          </div>
        </div>
      )}
    </div>
  )
}
