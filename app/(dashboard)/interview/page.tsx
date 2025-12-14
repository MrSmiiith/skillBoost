'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { MessageSquare, Code, Brain, Users, Zap, ArrowRight, Loader2, Briefcase, Layers, FileText, Clock, Play } from 'lucide-react'
import Link from 'next/link'

interface InterviewHistory {
  id: string
  type: string
  role: string
  status: string
  createdAt: string
}

const allTechOptions = [
  'React', 'TypeScript', 'JavaScript', 'CSS', 'HTML', 'Next.js', 'Vue.js', 'Angular', 'Svelte',
  'Node.js', 'Python', 'Java', 'Go', 'Rust', 'C++', 'C#', '.NET', 'Ruby', 'PHP', 'Scala',
  'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'SQLite', 'DynamoDB', 'Cassandra',
  'Docker', 'Kubernetes', 'AWS', 'Azure', 'GCP', 'Terraform', 'CI/CD', 'Linux', 'Jenkins', 'GitHub Actions',
  'React Native', 'Flutter', 'Swift', 'Kotlin', 'iOS', 'Android',
  'TensorFlow', 'PyTorch', 'Scikit-learn', 'MLOps', 'Data Pipelines', 'Spark', 'Airflow',
  'GraphQL', 'REST API', 'gRPC', 'WebSocket', 'Microservices', 'System Design',
  'Jest', 'Cypress', 'Selenium', 'Testing', 'Agile', 'Scrum',
]

const interviewTypes = [
  {
    id: 'TECHNICAL',
    name: 'Technical',
    description: 'Coding, algorithms, and technical problem-solving',
    icon: Code,
    color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
  },
  {
    id: 'BEHAVIORAL',
    name: 'Behavioral',
    description: 'Situational questions and soft skills assessment',
    icon: Users,
    color: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
  },
  {
    id: 'SYSTEM_DESIGN',
    name: 'System Design',
    description: 'Architecture and scalability discussions',
    icon: Brain,
    color: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
  },
  {
    id: 'MIXED',
    name: 'Mixed',
    description: 'Combination of all interview types',
    icon: MessageSquare,
    color: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400',
  },
]

const suggestedRoles = [
  'Frontend Developer',
  'Backend Developer',
  'Full Stack Developer',
  'Mobile Developer',
  'DevOps Engineer',
  'Data Engineer',
  'ML Engineer',
  'QA Engineer',
  'Software Architect',
  'Tech Lead',
  'Engineering Manager',
  'Product Manager',
]

const suggestedTechStacks: Record<string, string[]> = {
  'Frontend Developer': ['React', 'TypeScript', 'CSS', 'HTML', 'Next.js', 'Vue.js', 'Angular'],
  'Backend Developer': ['Node.js', 'Python', 'Java', 'Go', 'PostgreSQL', 'MongoDB', 'Redis'],
  'Full Stack Developer': ['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'Docker', 'AWS'],
  'Mobile Developer': ['React Native', 'Flutter', 'Swift', 'Kotlin', 'iOS', 'Android'],
  'DevOps Engineer': ['Docker', 'Kubernetes', 'AWS', 'Terraform', 'CI/CD', 'Linux', 'Jenkins'],
  'Data Engineer': ['Python', 'SQL', 'Spark', 'Airflow', 'ETL', 'BigQuery', 'Snowflake'],
  'ML Engineer': ['Python', 'TensorFlow', 'PyTorch', 'Scikit-learn', 'MLOps', 'Data Pipelines'],
  'QA Engineer': ['Selenium', 'Cypress', 'Jest', 'Test Automation', 'API Testing', 'Performance Testing'],
  'Software Architect': ['System Design', 'Microservices', 'Cloud Architecture', 'API Design', 'Security'],
  'Tech Lead': ['Code Review', 'System Design', 'Team Leadership', 'Agile', 'Architecture'],
  'Engineering Manager': ['Team Management', 'Agile', 'Technical Strategy', 'Hiring', 'OKRs'],
  'Product Manager': ['Product Strategy', 'User Research', 'Roadmapping', 'Agile', 'Analytics'],
}

const experienceLevels = [
  { value: 'junior', label: 'Junior (0-2 years)' },
  { value: 'mid', label: 'Mid-Level (2-5 years)' },
  { value: 'senior', label: 'Senior (5-10 years)' },
  { value: 'lead', label: 'Lead/Staff (10+ years)' },
]

const programmingLanguages = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'csharp', label: 'C#' },
  { value: 'cpp', label: 'C++' },
  { value: 'go', label: 'Go' },
  { value: 'rust', label: 'Rust' },
  { value: 'swift', label: 'Swift' },
  { value: 'kotlin', label: 'Kotlin' },
  { value: 'ruby', label: 'Ruby' },
  { value: 'php', label: 'PHP' },
  { value: 'scala', label: 'Scala' },
]

export default function InterviewPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const [selectedType, setSelectedType] = useState('')
  const [targetRole, setTargetRole] = useState('')
  const [experienceLevel, setExperienceLevel] = useState('')
  const [techStack, setTechStack] = useState<string[]>([])
  const [techInput, setTechInput] = useState('')
  const [jobDescription, setJobDescription] = useState('')
  const [preferredLanguage, setPreferredLanguage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const [history, setHistory] = useState<InterviewHistory[]>([])
  const [historyLoading, setHistoryLoading] = useState(true)

  const [showRoleSuggestions, setShowRoleSuggestions] = useState(false)
  const [showTechSuggestions, setShowTechSuggestions] = useState(false)
  const roleInputRef = useRef<HTMLInputElement>(null)
  const techInputRef = useRef<HTMLInputElement>(null)
  const roleDropdownRef = useRef<HTMLDivElement>(null)
  const techDropdownRef = useRef<HTMLDivElement>(null)

  const filteredRoles = targetRole
    ? suggestedRoles.filter(role =>
        role.toLowerCase().includes(targetRole.toLowerCase())
      )
    : suggestedRoles

  const suggestedTechForRole = suggestedTechStacks[targetRole] || []

  const filteredTech = techInput
    ? allTechOptions.filter(tech =>
        tech.toLowerCase().includes(techInput.toLowerCase()) &&
        !techStack.includes(tech)
      )
    : allTechOptions.filter(tech => !techStack.includes(tech))

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch('/api/interview/history')
        if (res.ok) {
          const data = await res.json()
          setHistory(data)
        }
      } catch (err) {
        console.error('Failed to fetch interview history')
      } finally {
        setHistoryLoading(false)
      }
    }
    fetchHistory()
  }, [])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (roleDropdownRef.current && !roleDropdownRef.current.contains(e.target as Node) &&
          roleInputRef.current && !roleInputRef.current.contains(e.target as Node)) {
        setShowRoleSuggestions(false)
      }
      if (techDropdownRef.current && !techDropdownRef.current.contains(e.target as Node) &&
          techInputRef.current && !techInputRef.current.contains(e.target as Node)) {
        setShowTechSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const addTech = (tech: string) => {
    if (!techStack.includes(tech)) {
      setTechStack([...techStack, tech])
    }
    setTechInput('')
    setShowTechSuggestions(false)
  }

  const removeTech = (tech: string) => {
    setTechStack(techStack.filter(t => t !== tech))
  }

  const handleStartInterview = async () => {
    if (!selectedType || !targetRole) {
      setError('Please select interview type and role')
      return
    }

    setIsLoading(true)
    setError('')

    const roleWithLevel = experienceLevel
      ? `${experienceLevel.charAt(0).toUpperCase() + experienceLevel.slice(1)} ${targetRole}`
      : targetRole

    try {
      const res = await fetch('/api/interview/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: selectedType,
          role: roleWithLevel,
          techStack,
          jobDescription: jobDescription.trim() || undefined,
          preferredLanguage: preferredLanguage || undefined,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to start interview')
      }

      const data = await res.json()
      router.push(`/interview/${data.id}`)
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Interview Practice</h1>
        <p className="text-muted-foreground mt-1">
          Practice with AI-powered mock interviews tailored to your target role
        </p>
      </div>

      {/* Points Info */}
      <Card className="bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800">
        <CardContent className="flex items-center gap-3 py-3">
          <Zap className="h-5 w-5 text-purple-600" />
          <span className="text-sm">
            <strong>Cost:</strong> 2 points per interview | <strong>Your points:</strong> {Math.max(0, session?.user?.points || 0)}
          </span>
        </CardContent>
      </Card>

      {/* Interview Type Selection */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Select Interview Type</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {interviewTypes.map((type) => (
            <Card
              key={type.id}
              className={`cursor-pointer transition-all hover:border-purple-500/50 ${
                selectedType === type.id ? 'border-purple-500 ring-2 ring-purple-500/20' : ''
              }`}
              onClick={() => setSelectedType(type.id)}
            >
              <CardContent className="pt-6">
                <div className={`w-12 h-12 rounded-lg ${type.color} flex items-center justify-center mb-4`}>
                  <type.icon className="h-6 w-6" />
                </div>
                <h3 className="font-semibold">{type.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">{type.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Interview Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            Interview Details
          </CardTitle>
          <CardDescription>
            Configure your mock interview settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Target Role with Autocomplete */}
          <div className="space-y-3">
            <Label>Target Role</Label>
            <div className="relative">
              <Input
                ref={roleInputRef}
                placeholder="Type to search or enter custom role..."
                value={targetRole}
                onChange={(e) => {
                  setTargetRole(e.target.value)
                  setShowRoleSuggestions(true)
                }}
                onFocus={() => setShowRoleSuggestions(true)}
              />
              {showRoleSuggestions && filteredRoles.length > 0 && (
                <div
                  ref={roleDropdownRef}
                  className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-900 border rounded-md shadow-lg max-h-60 overflow-auto"
                >
                  {filteredRoles.map((role) => (
                    <button
                      key={role}
                      type="button"
                      className="w-full px-3 py-2 text-left text-sm hover:bg-purple-50 dark:hover:bg-purple-900/30 transition-colors"
                      onClick={() => {
                        setTargetRole(role)
                        setShowRoleSuggestions(false)
                      }}
                    >
                      {role}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Experience Level */}
          <div className="space-y-3">
            <Label>Experience Level</Label>
            <Select value={experienceLevel} onValueChange={setExperienceLevel}>
              <SelectTrigger>
                <SelectValue placeholder="Select experience level (optional)" />
              </SelectTrigger>
              <SelectContent>
                {experienceLevels.map((level) => (
                  <SelectItem key={level.value} value={level.value}>
                    {level.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Preferred Programming Language - Only for Technical/Mixed */}
          {(selectedType === 'TECHNICAL' || selectedType === 'MIXED') && (
            <div className="space-y-3">
              <Label className="flex items-center gap-2">
                <Code className="h-4 w-4" />
                Preferred Programming Language
              </Label>
              <Select value={preferredLanguage} onValueChange={setPreferredLanguage}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your preferred language for coding questions" />
                </SelectTrigger>
                <SelectContent>
                  {programmingLanguages.map((lang) => (
                    <SelectItem key={lang.value} value={lang.value}>
                      {lang.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Code examples and questions will use this language when possible
              </p>
            </div>
          )}

          {/* Tech Stack with Autocomplete */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <Layers className="h-4 w-4" />
              Tech Stack
            </Label>

            {/* Selected tech badges */}
            {techStack.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {techStack.map((tech) => (
                  <Badge key={tech} variant="secondary" className="gap-1">
                    {tech}
                    <button
                      type="button"
                      className="ml-1 hover:text-destructive"
                      onClick={() => removeTech(tech)}
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
            )}

            {/* Autocomplete input */}
            <div className="relative">
              <Input
                ref={techInputRef}
                placeholder="Type to search technologies..."
                value={techInput}
                onChange={(e) => {
                  setTechInput(e.target.value)
                  setShowTechSuggestions(true)
                }}
                onFocus={() => setShowTechSuggestions(true)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && techInput.trim()) {
                    e.preventDefault()
                    addTech(techInput.trim())
                  }
                }}
              />
              {showTechSuggestions && filteredTech.length > 0 && (
                <div
                  ref={techDropdownRef}
                  className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-900 border rounded-md shadow-lg max-h-48 overflow-auto"
                >
                  {filteredTech.slice(0, 10).map((tech) => (
                    <button
                      key={tech}
                      type="button"
                      className="w-full px-3 py-2 text-left text-sm hover:bg-purple-50 dark:hover:bg-purple-900/30 transition-colors"
                      onClick={() => addTech(tech)}
                    >
                      {tech}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Role-based suggestions */}
            {suggestedTechForRole.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">Suggested for {targetRole}:</p>
                <div className="flex flex-wrap gap-2">
                  {suggestedTechForRole.filter(t => !techStack.includes(t)).map((tech) => (
                    <Badge
                      key={tech}
                      variant="outline"
                      className="cursor-pointer hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
                      onClick={() => addTech(tech)}
                    >
                      + {tech}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Job Description */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Job Description (Optional)
            </Label>
            <Textarea
              placeholder="Paste the job description here for more tailored interview questions..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              className="min-h-[120px]"
            />
            <p className="text-xs text-muted-foreground">
              Adding a job description helps the AI generate more relevant questions specific to the position.
            </p>
          </div>

          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}

          <Button
            onClick={handleStartInterview}
            disabled={isLoading || !selectedType || !targetRole}
            className="w-full sm:w-auto"
            variant="gradient"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Starting...
              </>
            ) : (
              <>
                Start Interview (2 points)
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Recent Interviews */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Recent Interviews
          </CardTitle>
          <CardDescription>
            Your interview history
          </CardDescription>
        </CardHeader>
        <CardContent>
          {historyLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-purple-600" />
            </div>
          ) : history.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No interviews yet. Start your first one above!
            </p>
          ) : (
            <div className="space-y-3">
              {history.slice(0, 5).map((item) => (
                <Link
                  key={item.id}
                  href={`/interview/${item.id}`}
                  className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      item.type === 'TECHNICAL' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' :
                      item.type === 'BEHAVIORAL' ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' :
                      item.type === 'SYSTEM_DESIGN' ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400' :
                      'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400'
                    }`}>
                      {item.type === 'TECHNICAL' ? <Code className="h-5 w-5" /> :
                       item.type === 'BEHAVIORAL' ? <Users className="h-5 w-5" /> :
                       item.type === 'SYSTEM_DESIGN' ? <Brain className="h-5 w-5" /> :
                       <MessageSquare className="h-5 w-5" />}
                    </div>
                    <div>
                      <p className="font-medium">{item.role}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={item.status === 'COMPLETED' ? 'secondary' : 'outline'} className={
                      item.status === 'COMPLETED'
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                        : ''
                    }>
                      {item.status === 'COMPLETED' ? 'Completed' : 'In Progress'}
                    </Badge>
                    <Play className="h-4 w-4 text-muted-foreground group-hover:text-purple-600 transition-colors" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
