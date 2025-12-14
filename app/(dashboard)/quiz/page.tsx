'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  Brain,
  Trophy,
  Zap,
  CheckCircle,
  XCircle,
  Loader2,
  Clock,
  Target,
  Gift,
  Briefcase,
  FileText,
  ArrowRight
} from 'lucide-react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'

interface Question {
  id: string
  question: string
  options: string[]
  category: string
  difficulty: 'easy' | 'medium' | 'hard'
}

interface QuizState {
  questions: Question[]
  currentIndex: number
  answers: Record<string, string>
  results: Record<string, boolean> | null
  score: number
  completed: boolean
  canPlayToday: boolean
  lastPlayed: string | null
}

const difficultyColors = {
  easy: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  hard: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
}

function DailyQuizContent() {
  const { data: session } = useSession()
  const searchParams = useSearchParams()
  const targetRole = searchParams.get('role')
  const skills = searchParams.get('skills')

  const [quiz, setQuiz] = useState<QuizState>({
    questions: [],
    currentIndex: 0,
    answers: {},
    results: null,
    score: 0,
    completed: false,
    canPlayToday: true,
    lastPlayed: null,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [currentResult, setCurrentResult] = useState<boolean | null>(null)
  const [hasCV, setHasCV] = useState<boolean | null>(null)

  useEffect(() => {
    checkCVStatus()
    fetchQuizStatus()
  }, [])

  const checkCVStatus = async () => {
    try {
      const res = await fetch('/api/cv/status')
      if (res.ok) {
        const data = await res.json()
        setHasCV(data.hasCV)
      }
    } catch {
      setHasCV(false)
    }
  }

  if (hasCV === false) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardContent className="py-12 text-center">
            <div className="w-16 h-16 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mx-auto mb-6">
              <FileText className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-2xl font-bold mb-3">Upload Your CV First</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
              To access the Daily Quiz, you need to upload your CV first. The quiz questions will be personalized based on your skills and target role.
            </p>
            <Link href="/cv">
              <Button className="bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600">
                Upload Your CV
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  const fetchQuizStatus = async () => {
    try {
      const res = await fetch('/api/quiz/status')
      if (res.ok) {
        const data = await res.json()
        setQuiz(prev => ({
          ...prev,
          canPlayToday: data.canPlayToday,
          lastPlayed: data.lastPlayed,
          completed: !data.canPlayToday,
          score: data.todayScore || 0,
        }))
      }
    } catch (err) {
      console.error('Failed to fetch quiz status')
    } finally {
      setIsLoading(false)
    }
  }

  const startQuiz = async () => {
    setIsLoading(true)
    try {
      const body: { targetRole?: string; skills?: string } = {}
      if (targetRole) body.targetRole = targetRole
      if (skills) body.skills = skills

      const res = await fetch('/api/quiz/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (!res.ok) throw new Error('Failed to start quiz')
      const data = await res.json()
      setQuiz(prev => ({
        ...prev,
        questions: data.questions,
        currentIndex: 0,
        answers: {},
        results: null,
        completed: false,
      }))
    } catch (err) {
      console.error('Failed to start quiz')
    } finally {
      setIsLoading(false)
    }
  }

  const submitAnswer = async () => {
    if (!selectedAnswer) return
    setIsSubmitting(true)

    const currentQuestion = quiz.questions[quiz.currentIndex]

    try {
      const res = await fetch('/api/quiz/answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionId: currentQuestion.id,
          answer: selectedAnswer,
        }),
      })

      if (!res.ok) throw new Error('Failed to submit answer')

      const data = await res.json()
      setCurrentResult(data.correct)
      setShowResult(true)

      setQuiz(prev => ({
        ...prev,
        answers: { ...prev.answers, [currentQuestion.id]: selectedAnswer },
        results: { ...prev.results, [currentQuestion.id]: data.correct },
        score: data.correct ? prev.score + 1 : prev.score,
      }))
    } catch (err) {
      console.error('Failed to submit answer')
    } finally {
      setIsSubmitting(false)
    }
  }

  const nextQuestion = () => {
    setShowResult(false)
    setSelectedAnswer(null)
    setCurrentResult(null)

    if (quiz.currentIndex < quiz.questions.length - 1) {
      setQuiz(prev => ({
        ...prev,
        currentIndex: prev.currentIndex + 1,
      }))
    } else {
      completeQuiz()
    }
  }

  const completeQuiz = async () => {
    try {
      await fetch('/api/quiz/complete', { method: 'POST' })
      setQuiz(prev => ({
        ...prev,
        completed: true,
        canPlayToday: false,
      }))
    } catch (err) {
      console.error('Failed to complete quiz')
    }
  }

  const currentQuestion = quiz.questions[quiz.currentIndex]
  const progress = quiz.questions.length > 0
    ? ((quiz.currentIndex + (showResult ? 1 : 0)) / quiz.questions.length) * 100
    : 0

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
      </div>
    )
  }

  if (quiz.completed || !quiz.canPlayToday) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Daily Quiz</h1>
          <p className="text-muted-foreground mt-1">
            Test your knowledge and earn points
          </p>
        </div>

        <Card className="text-center">
          <CardContent className="py-12 space-y-6">
            <div className="w-20 h-20 mx-auto rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
              <Trophy className="h-10 w-10 text-purple-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Quiz Completed!</h2>
              <p className="text-muted-foreground mt-2">
                You've already completed today's quiz
              </p>
            </div>
            <div className="flex items-center justify-center gap-4">
              <div className="text-center">
                <p className="text-3xl font-bold text-purple-600">{quiz.score}/10</p>
                <p className="text-sm text-muted-foreground">Correct Answers</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-green-600">+{Math.floor(quiz.score / 5)}</p>
                <p className="text-sm text-muted-foreground">Points Earned</p>
              </div>
            </div>
            <div className="pt-4">
              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>Come back tomorrow for a new quiz!</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (quiz.questions.length === 0) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold">
            {targetRole ? 'Role-Based Quiz' : 'Daily Quiz'}
          </h1>
          <p className="text-muted-foreground mt-1">
            {targetRole
              ? `Test your knowledge for ${targetRole} position`
              : 'Test your knowledge and earn points'}
          </p>
        </div>

        {targetRole && (
          <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
            <CardContent className="flex items-center gap-3 py-3">
              <Briefcase className="h-5 w-5 text-blue-600" />
              <span className="text-sm">
                <strong>Tailored for:</strong> {targetRole}
                {skills && ` | Skills: ${skills}`}
              </span>
            </CardContent>
          </Card>
        )}

        <Card className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border-purple-200 dark:border-purple-800">
          <CardContent className="py-8">
            <div className="text-center space-y-6">
              <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center shadow-lg">
                <Brain className="h-10 w-10 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">
                  {targetRole ? `${targetRole} Quiz` : 'Daily Quiz Challenge'}
                </h2>
                <p className="text-muted-foreground mt-2">
                  {targetRole
                    ? 'Answer 10 questions tailored to your target role'
                    : 'Answer 10 questions to test your tech knowledge'}
                </p>
              </div>
              <div className="flex items-center justify-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-purple-600" />
                  <span>10 Questions</span>
                </div>
                <div className="flex items-center gap-2">
                  <Gift className="h-4 w-4 text-green-600" />
                  <span>5 correct = 1 point</span>
                </div>
              </div>
              <Button onClick={startQuiz} variant="gradient" size="lg">
                Start Quiz
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">How it works</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-bold text-purple-600">1</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Answer 10 multiple-choice questions about programming, tech concepts, and best practices.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-bold text-purple-600">2</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Earn 1 point for every 5 correct answers. Get all 10 right for 2 points!
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-bold text-purple-600">3</span>
              </div>
              <p className="text-sm text-muted-foreground">
                The quiz resets daily at midnight. Come back every day to earn more points!
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Daily Quiz</h1>
          <p className="text-muted-foreground mt-1">
            Question {quiz.currentIndex + 1} of {quiz.questions.length}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="gap-1">
            <Zap className="h-3 w-3" />
            {quiz.score} pts
          </Badge>
        </div>
      </div>

      <Progress value={progress} className="h-2" />

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <Badge className={difficultyColors[currentQuestion.difficulty]}>
              {currentQuestion.difficulty}
            </Badge>
            <Badge variant="outline">{currentQuestion.category}</Badge>
          </div>
          <CardTitle className="text-xl mt-4">{currentQuestion.question}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {currentQuestion.options.map((option, index) => {
            const isSelected = selectedAnswer === option
            const showCorrect = showResult && currentResult !== null
            const isCorrectAnswer = showCorrect && currentResult && isSelected
            const isWrongAnswer = showCorrect && !currentResult && isSelected

            return (
              <button
                key={index}
                onClick={() => !showResult && setSelectedAnswer(option)}
                disabled={showResult}
                className={`w-full p-4 text-left rounded-lg border transition-all ${
                  isCorrectAnswer
                    ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                    : isWrongAnswer
                    ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                    : isSelected
                    ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                    : 'hover:border-purple-300 hover:bg-muted/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{option}</span>
                  {isCorrectAnswer && <CheckCircle className="h-5 w-5 text-green-600" />}
                  {isWrongAnswer && <XCircle className="h-5 w-5 text-red-600" />}
                </div>
              </button>
            )
          })}

          {showResult && (
            <div className={`p-4 rounded-lg mt-4 ${
              currentResult
                ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400'
            }`}>
              <div className="flex items-center gap-2">
                {currentResult ? (
                  <>
                    <CheckCircle className="h-5 w-5" />
                    <span className="font-medium">Correct!</span>
                  </>
                ) : (
                  <>
                    <XCircle className="h-5 w-5" />
                    <span className="font-medium">Incorrect</span>
                  </>
                )}
              </div>
            </div>
          )}

          <div className="pt-4">
            {!showResult ? (
              <Button
                onClick={submitAnswer}
                disabled={!selectedAnswer || isSubmitting}
                variant="gradient"
                className="w-full"
              >
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : null}
                Submit Answer
              </Button>
            ) : (
              <Button onClick={nextQuestion} variant="gradient" className="w-full">
                {quiz.currentIndex < quiz.questions.length - 1 ? 'Next Question' : 'See Results'}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function DailyQuizPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
      </div>
    }>
      <DailyQuizContent />
    </Suspense>
  )
}
