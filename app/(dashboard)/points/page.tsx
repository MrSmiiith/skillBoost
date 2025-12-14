'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Zap, CreditCard, Wallet, Phone, CheckCircle, Clock, Loader2, Upload, XCircle } from 'lucide-react'

const packages = [
  { id: 1, points: 10, price: 200, popular: false },
  { id: 2, points: 25, price: 450, popular: true },
  { id: 3, points: 50, price: 800, popular: false },
  { id: 4, points: 100, price: 1500, popular: false },
]

const paymentMethods = [
  {
    id: 'BARIDIMOB',
    name: 'BaridiMob',
    icon: Phone,
    description: 'Mobile payment app',
    instructions: 'Send payment via BaridiMob app and upload screenshot as proof',
    needsProof: true,
    accountLabel: 'RIP',
    accountInfo: '00799999004021636696'
  },
  {
    id: 'CCP',
    name: 'CCP',
    icon: CreditCard,
    description: 'Bank transfer',
    instructions: 'Transfer to our CCP account at the post office and upload photo of receipt',
    needsProof: true,
    accountLabel: 'CCP Account',
    accountInfo: '40216366 Clé 84'
  },
  {
    id: 'FLEXY',
    name: 'Flexy',
    icon: Wallet,
    description: 'Mobile credit transfer',
    instructions: 'Send Flexy credit to our phone number via any method',
    needsProof: false,
    accountLabel: 'Phone Number',
    accountInfo: '0797049763'
  },
]

interface PointRequest {
  id: string
  pointsAmount: number
  priceDA: number
  paymentMethod: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  createdAt: string
  processedAt: string | null
}

export default function PointsPage() {
  const { data: session } = useSession()
  const [selectedPackage, setSelectedPackage] = useState<number | null>(null)
  const [selectedMethod, setSelectedMethod] = useState('')
  const [transactionId, setTransactionId] = useState('')
  const [sentTime, setSentTime] = useState('')
  const [proofFile, setProofFile] = useState<File | null>(null)
  const [proofPreview, setProofPreview] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [history, setHistory] = useState<PointRequest[]>([])
  const [loadingHistory, setLoadingHistory] = useState(true)

  useEffect(() => {
    fetchHistory()
  }, [])

  const fetchHistory = async () => {
    try {
      const res = await fetch('/api/points/request')
      if (res.ok) {
        const data = await res.json()
        setHistory(data)
      }
    } catch (err) {
      console.error('Failed to fetch history')
    } finally {
      setLoadingHistory(false)
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setProofFile(file)
    const reader = new FileReader()
    reader.onload = () => setProofPreview(reader.result as string)
    reader.readAsDataURL(file)
  }

  const removeProof = () => {
    setProofFile(null)
    setProofPreview(null)
  }

  const currentMethod = paymentMethods.find(m => m.id === selectedMethod)

  const handleSubmit = async () => {
    if (!selectedPackage || !selectedMethod || !transactionId) return
    if (currentMethod?.needsProof && !proofFile) return

    setIsSubmitting(true)
    try {
      const pkg = packages.find(p => p.id === selectedPackage)

      const formData = new FormData()
      formData.append('pointsAmount', String(pkg?.points))
      formData.append('priceDA', String(pkg?.price))
      formData.append('paymentMethod', selectedMethod)
      formData.append('transactionId', transactionId)
      if (sentTime) {
        formData.append('sentTime', sentTime)
      }
      if (proofFile) {
        formData.append('proof', proofFile)
      }

      const res = await fetch('/api/points/request', {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) throw new Error('Failed to submit request')

      setSuccess(true)
      setSelectedPackage(null)
      setSelectedMethod('')
      setTransactionId('')
      setSentTime('')
      setProofFile(null)
      setProofPreview(null)
      fetchHistory()
    } catch (err) {
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Pending</Badge>
      case 'APPROVED':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Approved</Badge>
      case 'REJECTED':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Rejected</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const canSubmit = selectedPackage && selectedMethod && transactionId &&
    (!currentMethod?.needsProof || proofFile) &&
    (selectedMethod !== 'FLEXY' || sentTime)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Points</h1>
        <p className="text-muted-foreground mt-1">
          Purchase points to unlock more AI features
        </p>
      </div>

      {/* Current Balance */}
      <Card className="bg-gradient-to-r from-purple-500 to-purple-700 text-white">
        <CardContent className="py-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100">Current Balance</p>
              <p className="text-4xl font-bold mt-1">{session?.user?.points || 0} points</p>
            </div>
            <Zap className="h-16 w-16 opacity-20" />
          </div>
        </CardContent>
      </Card>

      {success && (
        <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
          <CardContent className="flex items-center gap-3 py-4">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <div>
              <p className="font-medium text-green-800 dark:text-green-200">Request Submitted!</p>
              <p className="text-sm text-green-600 dark:text-green-400">
                Your request is being reviewed. Points will be added once approved.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="buy">
        <TabsList>
          <TabsTrigger value="buy">Buy Points</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="buy" className="space-y-6 mt-6">
          {/* Packages */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Select Package</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {packages.map((pkg) => (
                <Card
                  key={pkg.id}
                  className={`cursor-pointer transition-all hover:border-purple-500/50 relative ${
                    selectedPackage === pkg.id ? 'border-purple-500 ring-2 ring-purple-500/20' : ''
                  }`}
                  onClick={() => setSelectedPackage(pkg.id)}
                >
                  {pkg.popular && (
                    <Badge className="absolute -top-2 left-1/2 -translate-x-1/2" variant="default">
                      Popular
                    </Badge>
                  )}
                  <CardContent className="pt-6 text-center">
                    <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mx-auto mb-3">
                      <Zap className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <p className="text-3xl font-bold">{pkg.points}</p>
                    <p className="text-sm text-muted-foreground">points</p>
                    <p className="text-lg font-semibold mt-2">{pkg.price} DA</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Payment Method */}
          {selectedPackage && (
            <div>
              <h2 className="text-lg font-semibold mb-4">Payment Method</h2>
              <div className="grid gap-4 sm:grid-cols-3">
                {paymentMethods.map((method) => (
                  <Card
                    key={method.id}
                    className={`cursor-pointer transition-all hover:border-purple-500/50 ${
                      selectedMethod === method.id ? 'border-purple-500 ring-2 ring-purple-500/20' : ''
                    }`}
                    onClick={() => {
                      setSelectedMethod(method.id)
                      setProofFile(null)
                      setProofPreview(null)
                      setSentTime('')
                    }}
                  >
                    <CardContent className="pt-6 text-center">
                      <method.icon className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="font-medium">{method.name}</p>
                      <p className="text-xs text-muted-foreground mt-1">{method.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Payment Details */}
          {selectedMethod && currentMethod && (
            <Card>
              <CardHeader>
                <CardTitle>Complete Payment</CardTitle>
                <CardDescription>
                  {currentMethod.instructions}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Account Info */}
                <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
                  <p className="text-sm font-medium text-purple-700 dark:text-purple-300 mb-1">
                    {currentMethod.accountLabel}:
                  </p>
                  <p className="text-lg font-mono font-bold">{currentMethod.accountInfo}</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Amount: <strong>{packages.find(p => p.id === selectedPackage)?.price} DA</strong>
                  </p>
                </div>

                {/* Instructions */}
                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-sm font-medium mb-2">Instructions:</p>
                  {selectedMethod === 'BARIDIMOB' && (
                    <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                      <li>Open your BaridiMob app</li>
                      <li>Go to Transfer &gt; Send money</li>
                      <li>Enter the RIP number above</li>
                      <li>Send {packages.find(p => p.id === selectedPackage)?.price} DA</li>
                      <li>Take a screenshot of the confirmation</li>
                      <li>Upload the screenshot below</li>
                    </ol>
                  )}
                  {selectedMethod === 'CCP' && (
                    <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                      <li>Go to your nearest post office</li>
                      <li>Fill a transfer form (mandat) to the CCP account above</li>
                      <li>Pay {packages.find(p => p.id === selectedPackage)?.price} DA</li>
                      <li>Keep the receipt paper</li>
                      <li>Take a photo of the receipt</li>
                      <li>Upload the photo below</li>
                    </ol>
                  )}
                  {selectedMethod === 'FLEXY' && (
                    <div className="space-y-4">
                      <div>
                        <p className="font-medium text-sm mb-2">Option 1: Phone Services Shop</p>
                        <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                          <li>Go to any nearby phone services shop</li>
                          <li>Ask them to send <strong>{packages.find(p => p.id === selectedPackage)?.price} DA</strong> Flexy to the number above</li>
                          <li>Get the confirmation SMS</li>
                          <li>Enter the confirmation code and time below</li>
                        </ol>
                      </div>
                      <div className="border-t pt-3">
                        <p className="font-medium text-sm mb-2">Option 2: Djezzy Website (Dahabia Card)</p>
                        <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                          <li>Visit <a href="https://moncompte.djezzy.dz/fr/guest/recharge" target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline">moncompte.djezzy.dz</a></li>
                          <li>Enter the phone number: <strong>0797049763</strong></li>
                          <li>Enter amount: <strong>{packages.find(p => p.id === selectedPackage)?.price} DA</strong></li>
                          <li>Pay with your Dahabia card</li>
                          <li>Enter the confirmation code and time below</li>
                        </ol>
                      </div>
                      <div className="border-t pt-3">
                        <p className="font-medium text-sm mb-2">Option 3: From Your Phone</p>
                        <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                          <li>Dial *222# (Djezzy) or your carrier&apos;s Flexy code</li>
                          <li>Select &quot;Send Flexy&quot;</li>
                          <li>Enter the phone number above</li>
                          <li>Enter amount: {packages.find(p => p.id === selectedPackage)?.price} DA</li>
                          <li>Confirm the transfer</li>
                          <li>Enter the confirmation code and time below</li>
                        </ol>
                      </div>
                    </div>
                  )}
                </div>

                {/* Proof Upload (for BaridiMob and CCP) */}
                {currentMethod.needsProof && (
                  <div>
                    <Label>Payment Proof (Screenshot/Photo) *</Label>
                    {!proofPreview ? (
                      <div className="mt-2">
                        <input
                          id="proof-upload"
                          type="file"
                          accept="image/*"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                        <label
                          htmlFor="proof-upload"
                          className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 cursor-pointer hover:border-purple-500 transition-colors"
                        >
                          <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                          <p className="text-sm font-medium">Click to upload proof</p>
                          <p className="text-xs text-muted-foreground">PNG, JPG up to 5MB</p>
                        </label>
                      </div>
                    ) : (
                      <div className="mt-2 relative">
                        <img
                          src={proofPreview}
                          alt="Proof preview"
                          className="w-full max-h-64 object-contain rounded-lg border"
                        />
                        <Button
                          variant="destructive"
                          size="icon"
                          className="absolute top-2 right-2 h-8 w-8"
                          onClick={removeProof}
                        >
                          <XCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                )}

                {/* Transaction ID */}
                <div>
                  <Label htmlFor="transaction">
                    {selectedMethod === 'FLEXY' ? 'Confirmation Code' : 'Transaction ID'} *
                  </Label>
                  <Input
                    id="transaction"
                    placeholder={selectedMethod === 'FLEXY' ? 'Enter confirmation code from SMS' : 'Enter transaction ID from receipt'}
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                    className="mt-1"
                  />
                </div>

                {/* Sent Time (for Flexy) */}
                {selectedMethod === 'FLEXY' && (
                  <div>
                    <Label htmlFor="sentTime">Time Sent *</Label>
                    <Input
                      id="sentTime"
                      type="datetime-local"
                      value={sentTime}
                      onChange={(e) => setSentTime(e.target.value)}
                      className="mt-1"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Enter the exact time you sent the Flexy
                    </p>
                  </div>
                )}

                <Button
                  onClick={handleSubmit}
                  disabled={!canSubmit || isSubmitting}
                  variant="gradient"
                  className="w-full"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    'Submit Request'
                  )}
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="history" className="mt-6">
          {loadingHistory ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-purple-600" />
            </div>
          ) : history.length === 0 ? (
            <Card>
              <CardContent className="py-8">
                <div className="text-center text-muted-foreground">
                  <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No purchase history yet</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {history.map((request) => (
                <Card key={request.id}>
                  <CardContent className="py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                          <Zap className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                          <p className="font-medium">{request.pointsAmount} points</p>
                          <p className="text-sm text-muted-foreground">
                            {request.priceDA} DA via {request.paymentMethod}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        {getStatusBadge(request.status)}
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(request.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
