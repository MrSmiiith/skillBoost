# SkillBoost

> **Status: Under Construction**

Improve your skills and confidence with AI-powered CV optimization and interview simulation.

## Current Progress

- [x] Project setup (Next.js 14, Tailwind, Prisma)
- [x] Authentication (Google & Discord OAuth)
- [x] Dashboard UI and layout
- [x] CV Optimizer page
- [x] Interview Emulator page
- [x] Points system
- [x] Admin panel
- [ ] AI integration (bring your own)
- [ ] Testing & bug fixes
- [ ] Production deployment

## Setup

1. Clone the repo
2. Install dependencies: `npm install`
3. Configure `.env` (copy from `.env.example`)
4. Create MySQL database: `db_skillboost`
5. Setup AI integration (see below)
6. Push schema: `npm run db:push`
7. Seed data: `npm run db:seed`
8. Run dev server: `npm run dev`

## AI Integration

Create your own AI integration in `lib/ai/`:

1. Copy `lib/ai.example/` to `lib/ai/`
2. Rename files (remove `.example` suffix)
3. Implement your AI provider in `client.ts`

See `lib/ai.example/README.md` for details.

## Environment Variables

Copy `.env.example` to `.env` and configure:

- `DATABASE_URL` - Your MySQL connection string
- `NEXTAUTH_SECRET` - Generate with `openssl rand -base64 32`
- `GOOGLE_CLIENT_ID/SECRET` - From Google Cloud Console
- `DISCORD_CLIENT_ID/SECRET` - From Discord Developer Portal
- `AI_API_KEY` - Your AI service API key
- `ADMIN_EMAIL` - Email for admin account

## Features

- CV Optimizer - AI-powered resume analysis and optimization
- Interview Emulator - Practice with mock interviews
- Points System - Gamified daily limits with purchasable points
- Achievements - Unlock badges as you progress
- Admin Panel - Manage users and payment requests
- Dark/Light Mode - Modern, clean UI

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Prisma (MySQL)
- NextAuth.js
