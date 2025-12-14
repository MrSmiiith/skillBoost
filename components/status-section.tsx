'use client'

import { useState, useEffect } from 'react'
import { CheckCircle, AlertTriangle, Loader2, Server, Brain, Clock } from 'lucide-react'

interface StatusData {
  status: 'operational' | 'maintenance' | 'checking'
  ai: 'online' | 'offline' | 'checking'
  timestamp: string | null
  lastChecked: Date | null
}

export function StatusSection() {
  const [status, setStatus] = useState<StatusData>({
    status: 'checking',
    ai: 'checking',
    timestamp: null,
    lastChecked: null
  })

  const checkStatus = async () => {
    try {
      const res = await fetch('/api/status')
      const data = await res.json()
      setStatus({
        status: data.status,
        ai: data.ai,
        timestamp: data.timestamp,
        lastChecked: new Date()
      })
    } catch {
      setStatus({
        status: 'maintenance',
        ai: 'offline',
        timestamp: null,
        lastChecked: new Date()
      })
    }
  }

  useEffect(() => {
    checkStatus()

    // Check every 3 minutes
    const interval = setInterval(checkStatus, 3 * 60 * 1000)

    return () => clearInterval(interval)
  }, [])

  const isOperational = status.status === 'operational'
  const isChecking = status.status === 'checking'

  const formatLastChecked = () => {
    if (!status.lastChecked) return 'Checking...'
    const now = new Date()
    const diff = Math.floor((now.getTime() - status.lastChecked.getTime()) / 1000)
    if (diff < 60) return 'Just now'
    if (diff < 120) return '1 minute ago'
    return `${Math.floor(diff / 60)} minutes ago`
  }

  return (
    <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border border-gray-200 dark:border-gray-800 shadow-sm">
      {isChecking ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin text-gray-500" />
          <span className="text-sm text-gray-500">Checking status...</span>
        </>
      ) : isOperational ? (
        <>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-sm font-medium text-green-600 dark:text-green-400">Operational</span>
          </div>
          <div className="w-px h-4 bg-gray-200 dark:bg-gray-700" />
          <div className="flex items-center gap-1.5 text-sm text-gray-500">
            <Brain className="w-3.5 h-3.5" />
            <span>AI Online</span>
          </div>
        </>
      ) : (
        <>
          <div className="flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <span className="text-sm font-medium text-amber-600 dark:text-amber-400">Maintenance</span>
          </div>
          <div className="w-px h-4 bg-gray-200 dark:bg-gray-700" />
          <div className="flex items-center gap-1.5 text-sm text-gray-500">
            <Brain className="w-3.5 h-3.5" />
            <span>AI Offline</span>
          </div>
        </>
      )}
    </div>
  )
}

export function StatusBadge() {
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
      <div className="flex items-center gap-1.5 text-xs text-gray-500">
        <Loader2 className="w-3 h-3 animate-spin" />
        <span>Checking...</span>
      </div>
    )
  }

  return (
    <div className={`flex items-center gap-1.5 text-xs ${
      status === 'operational'
        ? 'text-green-600 dark:text-green-400'
        : 'text-amber-600 dark:text-amber-400'
    }`}>
      <div className={`w-1.5 h-1.5 rounded-full ${
        status === 'operational' ? 'bg-green-500' : 'bg-amber-500'
      } ${status === 'operational' ? 'animate-pulse' : ''}`} />
      <span>{status === 'operational' ? 'All Systems Operational' : 'Under Maintenance'}</span>
    </div>
  )
}
