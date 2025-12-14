'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Loader2 } from 'lucide-react'

interface User {
  id: string
  name: string
  email: string
  image: string
  role: string
  points: number
  createdAt: string
  _count: {
    cvVersions: number
    interviews: number
  }
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/users')
      .then(res => res.json())
      .then(data => {
        setUsers(data)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Users</h1>
        <p className="text-muted-foreground mt-1">
          Manage platform users
        </p>
      </div>

      <div className="space-y-4">
        {users.map((user) => (
          <Card key={user.id}>
            <CardContent className="py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={user.image} />
                    <AvatarFallback>
                      {user.name?.[0]?.toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{user.name}</p>
                      <Badge variant={user.role === 'ADMIN' ? 'default' : 'secondary'}>
                        {user.role}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-8 text-center">
                  <div>
                    <p className="text-xl font-bold">{user.points}</p>
                    <p className="text-xs text-muted-foreground">Points</p>
                  </div>
                  <div>
                    <p className="text-xl font-bold">{user._count.cvVersions}</p>
                    <p className="text-xs text-muted-foreground">CVs</p>
                  </div>
                  <div>
                    <p className="text-xl font-bold">{user._count.interviews}</p>
                    <p className="text-xs text-muted-foreground">Interviews</p>
                  </div>
                  <div>
                    <p className="text-sm">{new Date(user.createdAt).toLocaleDateString()}</p>
                    <p className="text-xs text-muted-foreground">Joined</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
