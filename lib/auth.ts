import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'
import Discord from 'next-auth/providers/discord'
import GitHub from 'next-auth/providers/github'
import LinkedIn from 'next-auth/providers/linkedin'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { db } from './db'

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(db),
  trustHost: true,
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Discord({
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
    }),
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
    LinkedIn({
      clientId: process.env.LINKEDIN_CLIENT_ID!,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET!,
      authorization: {
        params: { scope: 'openid profile email' }
      }
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger }) {
      if (user) {
        token.id = user.id
        // Fetch user data on sign in
        const dbUser = await db.user.findUnique({
          where: { id: user.id },
          select: { role: true, points: true, dailyUsage: true }
        })
        if (dbUser) {
          token.role = dbUser.role
          token.points = dbUser.points
          token.dailyUsage = dbUser.dailyUsage
        }
      }
      // Refresh user data when session is updated
      if (trigger === 'update' && token.id) {
        const dbUser = await db.user.findUnique({
          where: { id: token.id as string },
          select: { role: true, points: true, dailyUsage: true }
        })
        if (dbUser) {
          token.role = dbUser.role
          token.points = dbUser.points
          token.dailyUsage = dbUser.dailyUsage
        }
      }
      return token
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string
        session.user.role = token.role as string
        session.user.points = token.points as number
        session.user.dailyUsage = token.dailyUsage as number
      }
      return session
    },
  },
  pages: {
    signIn: '/login',
  },
})
