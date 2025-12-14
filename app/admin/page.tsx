import { db } from '@/lib/db'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, FileText, MessageSquare, CreditCard } from 'lucide-react'

export default async function AdminPage() {
  const [userCount, cvCount, interviewCount, pendingRequests] = await Promise.all([
    db.user.count(),
    db.cVVersion.count(),
    db.interview.count(),
    db.pointRequest.count({ where: { status: 'PENDING' } })
  ])

  const stats = [
    { name: 'Total Users', value: userCount, icon: Users, color: 'text-blue-600' },
    { name: 'CV Optimizations', value: cvCount, icon: FileText, color: 'text-green-600' },
    { name: 'Interviews', value: interviewCount, icon: MessageSquare, color: 'text-purple-600' },
    { name: 'Pending Requests', value: pendingRequests, icon: CreditCard, color: 'text-yellow-600' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Overview of platform statistics
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.name}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.name}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
