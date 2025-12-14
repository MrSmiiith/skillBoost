'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Check, X, Loader2, ImageIcon } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

interface PointRequest {
  id: string
  pointsAmount: number
  priceDA: number
  paymentMethod: string
  transactionId: string
  receiptImage: string | null
  status: string
  createdAt: string
  user: {
    id: string
    name: string
    email: string
    image: string
  }
}

export default function AdminRequestsPage() {
  const [requests, setRequests] = useState<PointRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [processingId, setProcessingId] = useState<string | null>(null)

  useEffect(() => {
    fetchRequests()
  }, [])

  const fetchRequests = async () => {
    const res = await fetch('/api/admin/requests')
    const data = await res.json()
    setRequests(data)
    setLoading(false)
  }

  const handleApprove = async (id: string) => {
    setProcessingId(id)
    await fetch(`/api/admin/requests/${id}/approve`, { method: 'POST' })
    fetchRequests()
    setProcessingId(null)
  }

  const handleReject = async (id: string) => {
    setProcessingId(id)
    await fetch(`/api/admin/requests/${id}/reject`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason: 'Rejected by admin' })
    })
    fetchRequests()
    setProcessingId(null)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED': return 'success'
      case 'REJECTED': return 'destructive'
      default: return 'warning'
    }
  }

  const getMethodLabel = (method: string) => {
    switch (method) {
      case 'BARIDIMOB': return 'BaridiMob'
      case 'CCP': return 'CCP'
      case 'FLEXY': return 'Flexy'
      default: return method
    }
  }

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
        <h1 className="text-3xl font-bold">Payment Requests</h1>
        <p className="text-muted-foreground mt-1">
          Review and process point purchase requests
        </p>
      </div>

      <div className="space-y-4">
        {requests.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              No requests yet
            </CardContent>
          </Card>
        ) : (
          requests.map((request) => (
            <Card key={request.id}>
              <CardContent className="py-4">
                <div className="flex items-center gap-4 flex-wrap">
                  {/* User Info */}
                  <div className="flex items-center gap-3 min-w-[200px]">
                    <Avatar>
                      <AvatarImage src={request.user.image} />
                      <AvatarFallback>
                        {request.user.name?.[0]?.toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{request.user.name}</p>
                      <p className="text-sm text-muted-foreground">{request.user.email}</p>
                    </div>
                  </div>

                  {/* Points */}
                  <div className="text-center min-w-[80px]">
                    <p className="text-2xl font-bold text-purple-600">{request.pointsAmount}</p>
                    <p className="text-sm text-muted-foreground">points</p>
                  </div>

                  {/* Price & Method */}
                  <div className="text-center min-w-[100px]">
                    <p className="font-medium">{request.priceDA} DA</p>
                    <Badge variant="outline" className="mt-1">
                      {getMethodLabel(request.paymentMethod)}
                    </Badge>
                  </div>

                  {/* Transaction ID */}
                  <div className="text-center min-w-[120px]">
                    <p className="font-mono text-sm bg-muted px-2 py-1 rounded">{request.transactionId}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(request.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  {/* Receipt Image */}
                  <div className="min-w-[80px]">
                    {request.receiptImage ? (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" className="gap-2">
                            <ImageIcon className="h-4 w-4" />
                            View
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Payment Receipt</DialogTitle>
                          </DialogHeader>
                          <div className="mt-4">
                            <img
                              src={request.receiptImage}
                              alt="Payment receipt"
                              className="w-full rounded-lg border"
                            />
                            <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <p className="text-muted-foreground">User</p>
                                <p className="font-medium">{request.user.name}</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Amount</p>
                                <p className="font-medium">{request.priceDA} DA</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Method</p>
                                <p className="font-medium">{getMethodLabel(request.paymentMethod)}</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Transaction ID</p>
                                <p className="font-mono">{request.transactionId}</p>
                              </div>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    ) : (
                      <span className="text-xs text-muted-foreground">No image</span>
                    )}
                  </div>

                  {/* Status & Actions */}
                  <div className="flex items-center gap-2 ml-auto">
                    <Badge variant={getStatusColor(request.status) as any}>
                      {request.status}
                    </Badge>

                    {request.status === 'PENDING' && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-green-600 hover:text-green-700 hover:bg-green-50"
                          onClick={() => handleApprove(request.id)}
                          disabled={processingId === request.id}
                        >
                          {processingId === request.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Check className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleReject(request.id)}
                          disabled={processingId === request.id}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
