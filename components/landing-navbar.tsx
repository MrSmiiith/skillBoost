'use client'

import Link from 'next/link'
import { useTheme } from 'next-themes'
import { useState, useEffect } from 'react'
import { Zap, Moon, Sun, Github, Menu, X } from 'lucide-react'

export function LandingNavbar() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    setMounted(true)
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  if (!mounted) return null

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'glass border-b border-gray-200/50 dark:border-gray-800/50 shadow-sm'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center shadow-lg shadow-purple-500/20 group-hover:shadow-purple-500/40 transition-shadow">
              <Zap className="w-5 h-5 text-white" strokeWidth={2.5} />
            </div>
            <span className="font-bold text-xl">SkillBoost</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#demo" className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition">
              Try Demo
            </a>
            <a href="#features" className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition">
              Features
            </a>
            <a href="#pricing" className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition">
              Pricing
            </a>
            <a href="#open-source" className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition">
              Open Source
            </a>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-3">
            {/* GitHub */}
            <Link
              href="https://github.com/MrSmiiith/skillBoost"
              target="_blank"
              className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            >
              <Github className="w-4 h-4" />
              <span className="hidden lg:inline">GitHub</span>
            </Link>

            {/* Theme Toggle */}
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2.5 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-yellow-500" />
              ) : (
                <Moon className="w-4 h-4 text-gray-600" />
              )}
            </button>

            {/* Sign In */}
            <Link
              href="/login"
              className="hidden sm:inline-flex px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-purple-500 text-white text-sm font-medium hover:opacity-90 transition shadow-lg shadow-purple-500/20"
            >
              Sign In
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden glass border-t border-gray-200/50 dark:border-gray-800/50">
          <div className="px-4 py-4 space-y-3">
            <a
              href="#demo"
              className="block px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              Try Demo
            </a>
            <a
              href="#features"
              className="block px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              Features
            </a>
            <a
              href="#pricing"
              className="block px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              Pricing
            </a>
            <a
              href="#open-source"
              className="block px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              Open Source
            </a>
            <Link
              href="https://github.com/MrSmiiith/skillBoost"
              target="_blank"
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            >
              <Github className="w-4 h-4" />
              GitHub
            </Link>
            <Link
              href="/login"
              className="block px-3 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-purple-500 text-white text-sm font-medium text-center"
            >
              Sign In
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
