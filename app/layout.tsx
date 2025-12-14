import type { Metadata, Viewport } from 'next'
import { Cairo, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'

const cairo = Cairo({
  subsets: ['latin', 'arabic'],
  variable: '--font-cairo',
  weight: ['300', '400', '500', '600', '700', '800', '900']
})

const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' })

export const metadata: Metadata = {
  title: {
    default: 'SkillBoost - AI Career Development Platform',
    template: '%s | SkillBoost'
  },
  description: 'Boost your career with AI-powered CV optimization, interview simulation, and daily quizzes. Get personalized feedback and improve your chances of landing your dream job.',
  keywords: ['CV optimizer', 'resume builder', 'interview practice', 'career development', 'AI', 'job preparation'],
  authors: [{ name: 'MrSmith', url: 'https://merzougrayane.com' }],
  creator: 'MrSmith',
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/logo.png', type: 'image/png' }
    ],
    apple: '/logo.png',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'SkillBoost',
    title: 'SkillBoost - AI Career Development Platform',
    description: 'Boost your career with AI-powered CV optimization, interview simulation, and daily quizzes. Get personalized feedback and improve your chances of landing your dream job.',
    images: [
      {
        url: '/logo.png',
        width: 512,
        height: 512,
        alt: 'SkillBoost - AI Career Development Platform'
      }
    ]
  },
  twitter: {
    card: 'summary',
    title: 'SkillBoost - AI Career Development Platform',
    description: 'Boost your career with AI-powered CV optimization and interview simulation.',
    images: ['/logo.png'],
    creator: '@MrSmith'
  },
  metadataBase: new URL(process.env.NEXTAUTH_URL || 'http://localhost:3000'),
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' }
  ],
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/logo.png" type="image/png" sizes="512x512" />
        <link rel="apple-touch-icon" href="/logo.png" />
      </head>
      <body className={`${cairo.variable} ${jetbrainsMono.variable} font-sans antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
