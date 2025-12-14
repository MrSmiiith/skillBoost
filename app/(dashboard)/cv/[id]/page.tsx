'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  FileText,
  ArrowLeft,
  Download,
  Copy,
  Loader2,
  Target,
  Sparkles,
  BarChart3,
  ListChecks,
  Brain,
} from 'lucide-react'
import Link from 'next/link'

interface CVResult {
  id: string
  scores: {
    clarity: number
    impact: number
    atsReadiness: number
    overall: number
  }
  feedback: {
    strengths: string[]
    improvements: string[]
  }
  optimizedSections: {
    summary: string
    bullets: string[]
  }
  targetRole: string
  version: number
  createdAt: string
}

export default function CVResultPage() {
  const params = useParams()
  const router = useRouter()
  const [result, setResult] = useState<CVResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const res = await fetch(`/api/cv/${params.id}`)
        if (!res.ok) {
          throw new Error('Failed to load CV results')
        }
        const data = await res.json()
        setResult(data)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchResult()
    }
  }, [params.id])

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent'
    if (score >= 60) return 'Good'
    if (score >= 40) return 'Fair'
    return 'Needs Work'
  }

  const getScoreBadgeColor = (score: number) => {
    if (score >= 80) return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    if (score >= 60) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
    return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
  }

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
          <p className="text-muted-foreground">Loading your results...</p>
        </div>
      </div>
    )
  }

  if (error || !result) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <AlertTriangle className="h-12 w-12 text-red-500" />
        <p className="text-lg font-medium">{error || 'Results not found'}</p>
        <Link href="/cv">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to CV Optimizer
          </Button>
        </Link>
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
            <h1 className="text-3xl font-bold">CV Analysis Results</h1>
            <p className="text-muted-foreground">
              Target Role: {result.targetRole} | Version {result.version}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link href="/cv/history">
            <Button variant="outline">View History</Button>
          </Link>
          <Link href="/cv">
            <Button variant="gradient">Optimize Another CV</Button>
          </Link>
        </div>
      </div>

      {/* Overall Score Card */}
      <Card className="bg-gradient-to-r from-purple-500/10 to-purple-600/5 border-purple-200 dark:border-purple-800">
        <CardContent className="py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-20 w-20 rounded-full bg-background flex items-center justify-center border-4 border-purple-500">
                <span className={`text-3xl font-bold ${getScoreColor(result.scores.overall)}`}>
                  {result.scores.overall}
                </span>
              </div>
              <div>
                <h2 className="text-2xl font-bold">Overall Score</h2>
                <Badge className={getScoreBadgeColor(result.scores.overall)}>
                  {getScoreLabel(result.scores.overall)}
                </Badge>
              </div>
            </div>
            <div className="text-right text-sm text-muted-foreground">
              <p>Analyzed on</p>
              <p className="font-medium">
                {new Date(result.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="scores" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="scores" className="gap-2">
            <BarChart3 className="h-4 w-4" />
            Scores
          </TabsTrigger>
          <TabsTrigger value="feedback" className="gap-2">
            <ListChecks className="h-4 w-4" />
            Feedback
          </TabsTrigger>
          <TabsTrigger value="optimized" className="gap-2">
            <Sparkles className="h-4 w-4" />
            Optimized Content
          </TabsTrigger>
        </TabsList>

        {/* Scores Tab */}
        <TabsContent value="scores" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            {/* Clarity Score */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-500" />
                  Clarity
                </CardTitle>
                <CardDescription>How clear and readable is your CV?</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-3xl font-bold ${getScoreColor(result.scores.clarity)}`}>
                    {result.scores.clarity}%
                  </span>
                  <Badge className={getScoreBadgeColor(result.scores.clarity)}>
                    {getScoreLabel(result.scores.clarity)}
                  </Badge>
                </div>
                <Progress value={result.scores.clarity} className="h-2" />
              </CardContent>
            </Card>

            {/* Impact Score */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                  Impact
                </CardTitle>
                <CardDescription>How impactful are your achievements?</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-3xl font-bold ${getScoreColor(result.scores.impact)}`}>
                    {result.scores.impact}%
                  </span>
                  <Badge className={getScoreBadgeColor(result.scores.impact)}>
                    {getScoreLabel(result.scores.impact)}
                  </Badge>
                </div>
                <Progress value={result.scores.impact} className="h-2" />
              </CardContent>
            </Card>

            {/* ATS Score */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Target className="h-5 w-5 text-purple-500" />
                  ATS Readiness
                </CardTitle>
                <CardDescription>How well will it pass ATS systems?</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-3xl font-bold ${getScoreColor(result.scores.atsReadiness)}`}>
                    {result.scores.atsReadiness}%
                  </span>
                  <Badge className={getScoreBadgeColor(result.scores.atsReadiness)}>
                    {getScoreLabel(result.scores.atsReadiness)}
                  </Badge>
                </div>
                <Progress value={result.scores.atsReadiness} className="h-2" />
              </CardContent>
            </Card>
          </div>

          {/* Score Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>What These Scores Mean</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <h4 className="font-medium text-blue-600 dark:text-blue-400">Clarity (Structure & Readability)</h4>
                  <p className="text-sm text-muted-foreground">
                    Measures how well-organized and easy to read your CV is. Includes formatting, section headers, and flow.
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-green-600 dark:text-green-400">Impact (Achievement Quality)</h4>
                  <p className="text-sm text-muted-foreground">
                    Evaluates how effectively you showcase your achievements with quantifiable results and action verbs.
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-purple-600 dark:text-purple-400">ATS Readiness (Keyword Optimization)</h4>
                  <p className="text-sm text-muted-foreground">
                    Checks if your CV contains relevant keywords and is formatted for Applicant Tracking Systems.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Feedback Tab */}
        <TabsContent value="feedback" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Strengths */}
            <Card className="border-green-200 dark:border-green-900">
              <CardHeader className="bg-green-50 dark:bg-green-900/20 rounded-t-lg">
                <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-400">
                  <CheckCircle className="h-5 w-5" />
                  Strengths
                </CardTitle>
                <CardDescription>What your CV does well</CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <ul className="space-y-3">
                  {result.feedback.strengths.map((strength, i) => (
                    <li key={i} className="flex gap-3">
                      <span className="text-green-600 font-bold">+</span>
                      <span className="text-sm">{strength}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Improvements */}
            <Card className="border-yellow-200 dark:border-yellow-900">
              <CardHeader className="bg-yellow-50 dark:bg-yellow-900/20 rounded-t-lg">
                <CardTitle className="flex items-center gap-2 text-yellow-700 dark:text-yellow-400">
                  <AlertTriangle className="h-5 w-5" />
                  Areas to Improve
                </CardTitle>
                <CardDescription>Suggestions to make your CV stronger</CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <ul className="space-y-3">
                  {result.feedback.improvements.map((improvement, i) => (
                    <li key={i} className="flex gap-3">
                      <span className="text-yellow-600 font-bold">!</span>
                      <span className="text-sm">{improvement}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Optimized Content Tab */}
        <TabsContent value="optimized" className="space-y-4">
          {/* Optimized Summary */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-purple-500" />
                    Optimized Professional Summary
                  </CardTitle>
                  <CardDescription>A stronger version of your summary section</CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(result.optimizedSections.summary)}
                >
                  {copied ? (
                    <>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="mr-2 h-4 w-4" />
                      Copy
                    </>
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm leading-relaxed">{result.optimizedSections.summary}</p>
              </div>
            </CardContent>
          </Card>

          {/* Optimized Bullets */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-500" />
                    Optimized Experience Bullets
                  </CardTitle>
                  <CardDescription>Impact-focused bullet points for your experience</CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(result.optimizedSections.bullets.join('\n'))}
                >
                  {copied ? (
                    <>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="mr-2 h-4 w-4" />
                      Copy All
                    </>
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {result.optimizedSections.bullets.map((bullet, i) => (
                  <li
                    key={i}
                    className="bg-muted p-3 rounded-lg text-sm flex items-start gap-3 group"
                  >
                    <span className="text-purple-600 font-bold mt-0.5">{i + 1}.</span>
                    <span className="flex-1">{bullet}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6"
                      onClick={() => copyToClipboard(bullet)}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Tips */}
          <Card className="bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800">
            <CardContent className="py-4">
              <div className="flex gap-3">
                <Sparkles className="h-5 w-5 text-purple-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-purple-700 dark:text-purple-300">Pro Tip</p>
                  <p className="text-sm text-muted-foreground">
                    Copy these optimized sections directly into your CV. Remember to customize them further to match the specific job description you&apos;re applying for.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Take Quiz Card */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-blue-200 dark:border-blue-800">
        <CardContent className="py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <Brain className="h-7 w-7 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold">Test Your Knowledge</h3>
                <p className="text-sm text-muted-foreground">
                  Take a quiz tailored to your target role: {result.targetRole}
                </p>
              </div>
            </div>
            <Link href={`/quiz?role=${encodeURIComponent(result.targetRole)}`}>
              <Button variant="gradient">
                <Brain className="mr-2 h-4 w-4" />
                Take Quiz
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
