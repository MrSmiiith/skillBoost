'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  ArrowLeft,
  FileText,
  Loader2,
  AlertTriangle,
  Eye,
  Trash2,
  TrendingUp,
  Calendar,
} from 'lucide-react'

interface CVHistoryItem {
  id: string
  targetRole: string
  version: number
  scores: {
    clarity: number
    impact: number
    atsReadiness: number
    overall: number
  }
  createdAt: string
}

export default function CVHistoryPage() {
  const [history, setHistory] = useState<CVHistoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch('/api/cv/history')
        if (!res.ok) {
          throw new Error('Failed to load history')
        }
        const data = await res.json()
        setHistory(data)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchHistory()
  }, [])

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreBadge = (score: number) => {
    if (score >= 80) return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Excellent</Badge>
    if (score >= 60) return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">Good</Badge>
    if (score >= 40) return <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">Fair</Badge>
    return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">Needs Work</Badge>
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
          <p className="text-muted-foreground">Loading your CV history...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/cv">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">CV History</h1>
            <p className="text-muted-foreground">
              View all your previous CV optimizations
            </p>
          </div>
        </div>
        <Link href="/cv">
          <Button variant="gradient">Optimize New CV</Button>
        </Link>
      </div>

      {error ? (
        <Card className="border-red-200 dark:border-red-900">
          <CardContent className="flex flex-col items-center justify-center py-10 gap-4">
            <AlertTriangle className="h-12 w-12 text-red-500" />
            <p className="text-lg font-medium">{error}</p>
            <Button variant="outline" onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </CardContent>
        </Card>
      ) : history.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 gap-4">
            <FileText className="h-16 w-16 text-muted-foreground/50" />
            <div className="text-center">
              <h3 className="text-lg font-medium">No CV History Yet</h3>
              <p className="text-muted-foreground mt-1">
                Optimize your first CV to see it here
              </p>
            </div>
            <Link href="/cv">
              <Button variant="gradient" className="mt-4">
                Optimize Your First CV
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Summary Stats */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                    <FileText className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{history.length}</p>
                    <p className="text-sm text-muted-foreground">Total Optimizations</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">
                      {history.length > 0
                        ? Math.round(history.reduce((acc, cv) => acc + cv.scores.overall, 0) / history.length)
                        : 0}
                    </p>
                    <p className="text-sm text-muted-foreground">Avg. Score</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">
                      {history.length > 0 ? Math.max(...history.map((cv) => cv.scores.overall)) : 0}
                    </p>
                    <p className="text-sm text-muted-foreground">Best Score</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                    <Calendar className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">
                      {history.length > 0
                        ? new Date(history[0].createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                        : '-'}
                    </p>
                    <p className="text-sm text-muted-foreground">Last Optimized</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* History Table */}
          <Card>
            <CardHeader>
              <CardTitle>All CV Versions</CardTitle>
              <CardDescription>Click on any row to view the full analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Version</TableHead>
                    <TableHead>Target Role</TableHead>
                    <TableHead className="text-center">Clarity</TableHead>
                    <TableHead className="text-center">Impact</TableHead>
                    <TableHead className="text-center">ATS</TableHead>
                    <TableHead className="text-center">Overall</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {history.map((cv) => (
                    <TableRow key={cv.id} className="cursor-pointer hover:bg-muted/50">
                      <TableCell className="font-medium">v{cv.version}</TableCell>
                      <TableCell>{cv.targetRole || 'Not specified'}</TableCell>
                      <TableCell className="text-center">
                        <span className={getScoreColor(cv.scores.clarity)}>{cv.scores.clarity}</span>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className={getScoreColor(cv.scores.impact)}>{cv.scores.impact}</span>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className={getScoreColor(cv.scores.atsReadiness)}>{cv.scores.atsReadiness}</span>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-2">
                          <span className={`font-bold ${getScoreColor(cv.scores.overall)}`}>
                            {cv.scores.overall}
                          </span>
                          {getScoreBadge(cv.scores.overall)}
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {formatDate(cv.createdAt)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Link href={`/cv/${cv.id}`}>
                          <Button variant="ghost" size="sm" className="gap-2">
                            <Eye className="h-4 w-4" />
                            View
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
