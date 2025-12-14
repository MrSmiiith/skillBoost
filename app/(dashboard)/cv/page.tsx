'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { FileText, Upload, CheckCircle, AlertCircle, Zap, Briefcase, GraduationCap, Code, History } from 'lucide-react'
import Link from 'next/link'

const LOADING_MESSAGES = [
  'Uploading your CV...',
  'Reading document content...',
  'Analyzing header information...',
  'Checking contact details...',
  'Evaluating work experience...',
  'Reviewing skills section...',
  'Assessing education background...',
  'Calculating ATS compatibility...',
  'Generating optimization suggestions...',
  'Preparing your results...',
]

export default function CVOptimizerPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [cvFile, setCvFile] = useState<File | null>(null)
  const [targetRole, setTargetRole] = useState('')
  const [experienceLevel, setExperienceLevel] = useState('')
  const [industry, setIndustry] = useState('')
  const [jobType, setJobType] = useState('')
  const [skills, setSkills] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [loadingMessage, setLoadingMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isLoading) return

    let index = 0
    setLoadingMessage(LOADING_MESSAGES[0])

    const interval = setInterval(() => {
      index = (index + 1) % LOADING_MESSAGES.length
      setLoadingMessage(LOADING_MESSAGES[index])
    }, 3000)

    return () => clearInterval(interval)
  }, [isLoading])

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setCvFile(file)
    setError('')
  }

  const handleOptimize = async () => {
    if (!targetRole || !experienceLevel) {
      setError('Please fill in target role and experience level')
      return
    }

    if (!cvFile) {
      setError('Please upload your CV file')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const formData = new FormData()
      formData.append('file', cvFile)
      formData.append('targetRole', targetRole)
      formData.append('experienceLevel', experienceLevel)
      if (industry) formData.append('industry', industry)
      if (jobType) formData.append('jobType', jobType)
      if (skills) formData.append('skills', skills)

      const res = await fetch('/api/cv/optimize', {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Optimization failed')
      }

      const data = await res.json()

      // Redirect to results page
      router.push(`/cv/${data.id}`)
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
      setIsLoading(false)
    }
  }

  return (
    <>
      {/* Loading Modal */}
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
          <div className="relative z-10 bg-card border rounded-lg p-8 max-w-md w-full mx-4 shadow-lg">
            <div className="flex flex-col items-center text-center">
              <div className="relative mb-6">
                <div className="w-16 h-16 border-4 border-purple-200 dark:border-purple-900 rounded-full animate-pulse" />
                <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-purple-600 rounded-full animate-spin" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Analyzing Your CV</h3>
              <p className="text-muted-foreground text-sm mb-4">{loadingMessage}</p>
              <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                <div className="h-full bg-purple-600 rounded-full animate-[progress_15s_ease-in-out_infinite]" style={{ width: '60%' }} />
              </div>
              <p className="text-xs text-muted-foreground mt-4">This may take up to 2 minutes</p>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">CV Optimizer</h1>
            <p className="text-muted-foreground mt-1">
              Upload your CV and get AI-powered feedback and optimization suggestions
            </p>
          </div>
          <Link href="/cv/history">
            <Button variant="outline" className="gap-2">
              <History className="h-4 w-4" />
              View History
            </Button>
          </Link>
        </div>

        {/* Points Info */}
        <Card className="bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800">
          <CardContent className="flex items-center gap-3 py-3">
            <Zap className="h-5 w-5 text-purple-600" />
            <span className="text-sm">
              <strong>Cost:</strong> 1 point per optimization | <strong>Your points:</strong> {session?.user?.points || 0}
            </span>
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* File Upload Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Upload Your CV
              </CardTitle>
              <CardDescription>
                Supported formats: PDF, DOCX, DOC, PNG, JPG
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  cvFile ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : 'border-muted-foreground/25 hover:border-purple-500'
                }`}
              >
                <input
                  id="file-upload"
                  type="file"
                  accept=".pdf,.docx,.doc,.png,.jpg,.jpeg"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  {cvFile ? (
                    <div className="flex flex-col items-center gap-2">
                      <CheckCircle className="h-10 w-10 text-green-600" />
                      <p className="font-medium text-green-600">{cvFile.name}</p>
                      <p className="text-sm text-muted-foreground">Click to change file</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <Upload className="h-10 w-10 text-muted-foreground" />
                      <p className="font-medium">Drop your CV here or click to upload</p>
                      <p className="text-sm text-muted-foreground">Max file size: 10MB</p>
                    </div>
                  )}
                </label>
              </div>
            </CardContent>
          </Card>

          {/* Job Details Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                Target Position
              </CardTitle>
              <CardDescription>
                Tell us about the role you&apos;re applying for
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="role">Target Role *</Label>
                <Input
                  id="role"
                  placeholder="e.g., Senior Frontend Developer"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  className="mt-1"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="level">Experience Level *</Label>
                  <Select value={experienceLevel} onValueChange={setExperienceLevel}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="entry">Entry Level (0-2 years)</SelectItem>
                      <SelectItem value="mid">Mid Level (2-5 years)</SelectItem>
                      <SelectItem value="senior">Senior (5-10 years)</SelectItem>
                      <SelectItem value="lead">Lead/Principal (10+ years)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="jobType">Job Type</Label>
                  <Select value={jobType} onValueChange={setJobType}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fulltime">Full-time</SelectItem>
                      <SelectItem value="parttime">Part-time</SelectItem>
                      <SelectItem value="contract">Contract</SelectItem>
                      <SelectItem value="freelance">Freelance</SelectItem>
                      <SelectItem value="internship">Internship</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="industry">Industry</Label>
                <Select value={industry} onValueChange={setIndustry}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tech">Technology</SelectItem>
                    <SelectItem value="finance">Finance & Banking</SelectItem>
                    <SelectItem value="healthcare">Healthcare</SelectItem>
                    <SelectItem value="education">Education</SelectItem>
                    <SelectItem value="ecommerce">E-commerce</SelectItem>
                    <SelectItem value="consulting">Consulting</SelectItem>
                    <SelectItem value="startup">Startup</SelectItem>
                    <SelectItem value="government">Government</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Skills Section */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5" />
                Key Skills (Optional)
              </CardTitle>
              <CardDescription>
                List the main skills required for the job to help us optimize your CV better
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Input
                id="skills"
                placeholder="e.g., React, TypeScript, Node.js, AWS, Team Leadership"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
              />
              <p className="text-xs text-muted-foreground mt-2">
                Separate skills with commas. We&apos;ll check if these appear in your CV and suggest improvements.
              </p>
            </CardContent>
          </Card>
        </div>

        {error && (
          <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
            <AlertCircle className="h-4 w-4" />
            {error}
          </div>
        )}

        <Button
          onClick={handleOptimize}
          disabled={isLoading || !cvFile}
          className="w-full h-12 text-lg"
          variant="gradient"
        >
          <Upload className="mr-2 h-5 w-5" />
          Optimize My CV (1 point)
        </Button>
      </div>
    </>
  )
}
