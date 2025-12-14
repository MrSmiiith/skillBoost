# SkillBoost

> **Live Beta v1.0** - [skillboost.merzougrayane.com](https://skillboost.merzougrayane.com)

AI-powered career development platform for CV optimization and interview simulation.

## Features

- **CV Optimizer** - AI-powered resume analysis with clarity, impact, and ATS readiness scores
- **Interview Simulator** - Practice with AI mock interviews (technical, behavioral, system design)
- **Daily Quiz** - Personalized quizzes based on your CV and target role
- **Achievements** - Unlock badges and track your progress
- **Points System** - 5 free points on signup, earn more through daily activities
- **Admin Panel** - Manage users and payment requests
- **Dark/Light Mode** - Modern, responsive UI

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Prisma (MySQL)
- NextAuth.js v5
- Claude AI (via CLI)

## Setup

1. Clone the repo
2. Install dependencies: `npm install`
3. Configure `.env` (copy from `.env.example`)
4. Create MySQL database: `db_skillboost`
5. Push schema: `npx prisma db push`
6. Seed achievements: `npx prisma db seed`
7. Run dev server: `npm run dev`

## Environment Variables

Copy `.env.example` to `.env` and configure:

```env
DATABASE_URL="mysql://user:pass@host:3306/db_skillboost"
NEXTAUTH_URL="https://your-domain.com"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"

# OAuth Providers
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
DISCORD_CLIENT_ID=""
DISCORD_CLIENT_SECRET=""
GITHUB_CLIENT_ID=""
GITHUB_CLIENT_SECRET=""
LINKEDIN_CLIENT_ID=""
LINKEDIN_CLIENT_SECRET=""

# AI
CLAUDE_COMMAND="claude"
```

## OAuth Callback URLs

Configure these in your OAuth provider settings:

- Google: `https://your-domain.com/api/auth/callback/google`
- Discord: `https://your-domain.com/api/auth/callback/discord`
- GitHub: `https://your-domain.com/api/auth/callback/github`
- LinkedIn: `https://your-domain.com/api/auth/callback/linkedin`

## License

MIT License - Open source and free to use.

## Author

Built by [MrSmith](https://merzougrayane.com)
