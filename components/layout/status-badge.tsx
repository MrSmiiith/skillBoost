'use client'

import { useState, useEffect } from 'react'
import { Loader2 } from 'lucide-react'

export function NavStatusBadge() {
  const [status, setStatus] = useState<'operational' | 'maintenance' | 'checking'>('checking')

  const checkStatus = async () => {
    try {
      const res = await fetch('/api/status')
      const data = await res.json()
      setStatus(data.status)
    } catch {
      setStatus('maintenance')
    }
  }

  useEffect(() => {
    checkStatus()
    const interval = setInterval(checkStatus, 3 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  if (status === 'checking') {
    return (
      <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800">
        <Loader2 className="w-3 h-3 animate-spin text-gray-500" />
      </div>
    )
  }

  return (
    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
      status === 'operational'
        ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
        : 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
    }`}>
      <div className={`w-1.5 h-1.5 rounded-full ${
        status === 'operational' ? 'bg-green-500 animate-pulse' : 'bg-amber-500'
      }`} />
      <span className="hidden sm:inline">
        {status === 'operational' ? 'Online' : 'Maintenance'}
      </span>
    </div>
  )
}
