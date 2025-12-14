'use client'

import { useEffect, useRef, useState, ReactNode } from 'react'

interface ScrollAnimationProps {
  children: ReactNode
  className?: string
  animation?: 'fade-in' | 'fade-in-up' | 'slide-in-left' | 'slide-in-right' | 'scale-in'
  delay?: number
  threshold?: number
}

export function ScrollAnimation({
  children,
  className = '',
  animation = 'fade-in',
  delay = 0,
  threshold = 0.1
}: ScrollAnimationProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.unobserve(entry.target)
        }
      },
      { threshold }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current)
      }
    }
  }, [threshold])

  const animationClasses: Record<string, string> = {
    'fade-in': 'animate-fade-in',
    'fade-in-up': 'animate-fade-in-up',
    'slide-in-left': 'animate-slide-in-left',
    'slide-in-right': 'animate-slide-in-right',
    'scale-in': 'animate-scale-in',
  }

  return (
    <div
      ref={ref}
      className={`${className} ${isVisible ? animationClasses[animation] : 'opacity-0'}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}
