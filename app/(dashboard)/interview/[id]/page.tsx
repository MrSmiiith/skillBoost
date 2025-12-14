'use client'

import { useState, useEffect, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { ArrowLeft, Send, Loader2, CheckCircle, AlertCircle, Lightbulb, Target, Code, Users, Brain, MessageSquare } from 'lucide-react'
import Link from 'next/link'

interface Message {
  role: 'assistant' | 'user'
  content?: string
  question?: {
    type: string
    question: string
    options?: string[]
    difficulty?: string
  }
  evaluation?: {
    score: number
    strengths: string[]
    gaps: string[]
  }
  hint?: string
}

interface InterviewData {
  id: string
  type: string
  role: string
  techStack: string[]
  messages: Message[]
  status: string
}

const difficultyColors: Record<string, string> = {
  easy: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  hard: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
}

const typeIcons: Record<string, any> = {
  TECHNICAL: Code,
  BEHAVIORAL: Users,
  SYSTEM_DESIGN: Brain,
  MIXED: MessageSquare,
}

export default function InterviewSessionPage() {
  const params = useParams()
  const router = useRouter()
  const [interview, setInterview] = useState<InterviewData | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(true)
  const [isComplete, setIsComplete] = useState(false)
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [currentHint, setCurrentHint] = useState<string | null>(null)
  const [isLoadingHint, setIsLoadingHint] = useState(false)
  const [hintsUsed, setHintsUsed] = useState(0)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const questionCount = messages.filter(m => m.role === 'assistant' && m.question).length
  const userAnswerCount = messages.filter(m => m.role === 'user').length
  const avgScore = messages
    .filter(m => m.evaluation?.score)
    .reduce((acc, m, _, arr) => acc + (m.evaluation?.score || 0) / arr.length, 0)

  const TypeIcon = interview?.type ? typeIcons[interview.type] || MessageSquare : MessageSquare

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    const fetchInterview = async () => {
      try {
        const res = await fetch(`/api/interview/${params.id}`)
        if (!res.ok) {
          throw new Error('Failed to load interview')
        }
        const data = await res.json()
        setInterview(data)
        setMessages(data.messages || [])
        setIsComplete(data.status === 'COMPLETED')
      } catch (err: any) {
        setError(err.message || 'Failed to load interview')
      } finally {
        setIsFetching(false)
      }
    }
    fetchInterview()
  }, [params.id])

  const handleSubmit = async () => {
    const answer = selectedOption || input
    if (!answer.trim() || isSending) return

    setMessages(prev => [...prev, { role: 'user', content: answer }])
    setInput('')
    setSelectedOption(null)
    setIsSending(true)

    try {
      const res = await fetch(`/api/interview/${params.id}/respond`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answer })
      })

      if (!res.ok) throw new Error('Failed to submit response')

      const data = await res.json()

      setMessages(prev => [...prev, {
        role: 'assistant',
        evaluation: data.evaluation,
        question: data.nextQuestion
      }])

      if (data.isComplete) {
        setIsComplete(true)
      }
    } catch (err) {
      console.error(err)
      setError('Failed to send your answer. Please try again.')
    } finally {
      setIsSending(false)
    }
  }

  const currentQuestion = messages.length > 0
    ? messages[messages.length - 1].question
    : null

  const requestHint = async () => {
    if (!currentQuestion || isLoadingHint) return
    setIsLoadingHint(true)
    setCurrentHint(null)

    try {
      const res = await fetch(`/api/interview/${params.id}/hint`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: currentQuestion.question })
      })

      if (!res.ok) throw new Error('Failed to get hint')

      const data = await res.json()
      setCurrentHint(data.hint)
      setHintsUsed(prev => prev + 1)
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoadingHint(false)
    }
  }

  if (isFetching) {
    return (
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardContent className="flex items-center justify-center py-20">
            <div className="text-center space-y-4">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-purple-600" />
              <p className="text-muted-foreground">Loading interview...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error && !interview) {
    return (
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardContent className="flex items-center justify-center py-20">
            <div className="text-center space-y-4">
              <AlertCircle className="h-8 w-8 mx-auto text-destructive" />
              <p className="text-destructive">{error}</p>
              <Button asChild variant="outline">
                <Link href="/interview">Back to Interviews</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <Link href="/interview" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" />
          Back to Interviews
        </Link>
        <div className="flex items-center gap-2">
          {interview && (
            <>
              <Badge variant="outline" className="gap-1">
                <TypeIcon className="h-3 w-3" />
                {interview.type.replace('_', ' ')}
              </Badge>
              <Badge variant="outline">{interview.role}</Badge>
            </>
          )}
          {isComplete && (
            <Badge variant="secondary" className="gap-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
              <CheckCircle className="h-3 w-3" />
              Completed
            </Badge>
          )}
        </div>
      </div>

      {/* Progress Stats */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border-purple-200 dark:border-purple-800">
        <CardContent className="py-3">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-purple-600" />
                <span><strong>{questionCount}</strong> Questions</span>
              </div>
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-blue-600" />
                <span><strong>{userAnswerCount}</strong> Answers</span>
              </div>
              {avgScore > 0 && (
                <div className="flex items-center gap-2">
                  <span>Avg Score: <strong>{avgScore.toFixed(1)}/10</strong></span>
                </div>
              )}
            </div>
            {hintsUsed > 0 && (
              <div className="flex items-center gap-1 text-muted-foreground">
                <Lightbulb className="h-4 w-4" />
                <span>{hintsUsed} hints used</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <div className="h-[500px] overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && (
              <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground">No messages yet...</p>
              </div>
            )}
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-lg p-4 ${
                  msg.role === 'user'
                    ? 'bg-purple-600 text-white'
                    : 'bg-muted'
                }`}>
                  {msg.content && <p>{msg.content}</p>}

                  {msg.evaluation && (
                    <div className="space-y-2 mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-sm">Score:</span>
                        <Progress value={msg.evaluation.score * 10} className="w-20 h-2" />
                        <span className="text-sm font-medium">{msg.evaluation.score}/10</span>
                      </div>
                      {msg.evaluation.strengths.length > 0 && (
                        <div className="text-sm">
                          <span className="text-green-600">+</span> {msg.evaluation.strengths[0]}
                        </div>
                      )}
                      {msg.evaluation.gaps.length > 0 && (
                        <div className="text-sm">
                          <span className="text-yellow-600">!</span> {msg.evaluation.gaps[0]}
                        </div>
                      )}
                    </div>
                  )}

                  {msg.question && (
                    <div className="mt-2">
                      <p className="font-medium">{msg.question.question}</p>
                      {msg.question.options && msg.question.options.length > 0 && (
                        <div className="mt-3 space-y-2">
                          {msg.question.options.map((opt, j) => (
                            <button
                              key={j}
                              onClick={() => setSelectedOption(opt)}
                              className={`w-full text-left p-2 rounded border transition ${
                                selectedOption === opt
                                  ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                                  : 'hover:bg-muted/50'
                              }`}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isSending && (
              <div className="flex justify-start">
                <div className="bg-muted rounded-lg p-4">
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin text-purple-600" />
                    <span className="text-sm text-muted-foreground">AI is thinking...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {error && interview && (
            <div className="px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 text-sm">
              {error}
            </div>
          )}

          {!isComplete && (
            <div className="border-t p-4 space-y-3">
              {/* Hint Display */}
              {currentHint && (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
                  <div className="flex items-start gap-2">
                    <Lightbulb className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">Hint</p>
                      <p className="text-sm text-yellow-700 dark:text-yellow-300">{currentHint}</p>
                    </div>
                  </div>
                </div>
              )}

              {currentQuestion?.type !== 'MCQ' && (
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Textarea
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Type your answer..."
                      className="min-h-[80px]"
                      disabled={isSending}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault()
                          handleSubmit()
                        }
                      }}
                    />
                    <div className="flex flex-col gap-2">
                      <Button
                        onClick={handleSubmit}
                        disabled={(!input.trim() && !selectedOption) || isSending}
                        variant="gradient"
                      >
                        {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                      </Button>
                      <Button
                        onClick={requestHint}
                        disabled={isLoadingHint || !currentQuestion}
                        variant="outline"
                        size="icon"
                        title="Get a hint"
                      >
                        {isLoadingHint ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lightbulb className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                </div>
              )}
              {currentQuestion?.type === 'MCQ' && (
                <div className="flex gap-2">
                  <Button
                    onClick={handleSubmit}
                    disabled={!selectedOption || isSending}
                    variant="gradient"
                    className="flex-1"
                  >
                    {isSending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                    Submit Answer
                  </Button>
                  <Button
                    onClick={requestHint}
                    disabled={isLoadingHint || !currentQuestion}
                    variant="outline"
                    title="Get a hint"
                  >
                    {isLoadingHint ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lightbulb className="h-4 w-4" />}
                  </Button>
                </div>
              )}
            </div>
          )}

          {isComplete && (
            <div className="border-t p-4 text-center">
              <p className="text-muted-foreground mb-4">Interview completed! Check your results.</p>
              <Button asChild variant="gradient">
                <Link href="/interview/history">View History</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
