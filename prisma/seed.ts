import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Seed achievements
  const achievements = [
    // Welcome & Basics
    {
      code: 'NEWBIE',
      name: 'Welcome!',
      description: 'Created your SkillBoost account',
      icon: 'UserPlus',
      condition: { type: 'signup', value: 1 },
      points: 0,
    },
    {
      code: 'FIRST_CV',
      name: 'First Steps',
      description: 'Optimized your first CV',
      icon: 'FileText',
      condition: { type: 'cv_count', value: 1 },
      points: 5,
    },
    {
      code: 'CV_MASTER',
      name: 'CV Master',
      description: 'Optimized 10 CVs',
      icon: 'Award',
      condition: { type: 'cv_count', value: 10 },
      points: 20,
    },

    // CV Score Achievements
    {
      code: 'CV_GOOD',
      name: 'Getting Better',
      description: 'Achieved 70+ CV optimization score',
      icon: 'TrendingUp',
      condition: { type: 'cv_score', value: 70 },
      points: 5,
    },
    {
      code: 'CV_EXCELLENT',
      name: 'CV Expert',
      description: 'Achieved 80+ CV optimization score',
      icon: 'Target',
      condition: { type: 'cv_score', value: 80 },
      points: 10,
    },
    {
      code: 'PERFECT_CV',
      name: 'Perfect Score',
      description: 'Achieved 90+ CV optimization score',
      icon: 'Star',
      condition: { type: 'cv_score', value: 90 },
      points: 15,
    },

    // Interview Achievements
    {
      code: 'FIRST_INTERVIEW',
      name: 'Interview Ready',
      description: 'Completed your first mock interview',
      icon: 'MessageSquare',
      condition: { type: 'interview_count', value: 1 },
      points: 5,
    },
    {
      code: 'INTERVIEW_5',
      name: 'Practice Makes Perfect',
      description: 'Completed 5 mock interviews',
      icon: 'Users',
      condition: { type: 'interview_count', value: 5 },
      points: 10,
    },
    {
      code: 'INTERVIEW_PRO',
      name: 'Interview Pro',
      description: 'Completed 10 mock interviews',
      icon: 'Trophy',
      condition: { type: 'interview_count', value: 10 },
      points: 25,
    },
    {
      code: 'INTERVIEW_ACE',
      name: 'Interview Ace',
      description: 'Scored 8+ average in interviews',
      icon: 'Sparkles',
      condition: { type: 'interview_avg', value: 8 },
      points: 20,
    },
    {
      code: 'ALL_TYPES',
      name: 'Versatile',
      description: 'Completed all interview types',
      icon: 'CheckCircle',
      condition: { type: 'interview_types', value: 4 },
      points: 20,
    },

    // Quiz Achievements
    {
      code: 'QUIZ_STARTER',
      name: 'Quiz Taker',
      description: 'Completed your first daily quiz',
      icon: 'Brain',
      condition: { type: 'quiz_count', value: 1 },
      points: 5,
    },
    {
      code: 'QUIZ_5',
      name: 'Quiz Regular',
      description: 'Completed 5 daily quizzes',
      icon: 'BookOpen',
      condition: { type: 'quiz_count', value: 5 },
      points: 10,
    },
    {
      code: 'QUIZ_MASTER',
      name: 'Quiz Master',
      description: 'Completed 20 daily quizzes',
      icon: 'GraduationCap',
      condition: { type: 'quiz_count', value: 20 },
      points: 25,
    },
    {
      code: 'PERFECT_QUIZ',
      name: 'Perfect 10',
      description: 'Scored 10/10 on a daily quiz',
      icon: 'Zap',
      condition: { type: 'quiz_perfect', value: 10 },
      points: 15,
    },
    {
      code: 'QUIZ_STREAK_5',
      name: 'Quiz Streak',
      description: 'Completed quizzes 5 days in a row',
      icon: 'Flame',
      condition: { type: 'quiz_streak', value: 5 },
      points: 15,
    },

    // Points & Purchase Achievements
    {
      code: 'FIRST_PURCHASE',
      name: 'Supporter',
      description: 'Made your first points purchase',
      icon: 'Heart',
      condition: { type: 'purchase_count', value: 1 },
      points: 10,
    },
    {
      code: 'BIG_SPENDER',
      name: 'Big Supporter',
      description: 'Purchased 100+ points total',
      icon: 'Gem',
      condition: { type: 'purchase_total', value: 100 },
      points: 25,
    },
    {
      code: 'POINT_SAVER',
      name: 'Point Collector',
      description: 'Accumulated 50+ points at once',
      icon: 'Coins',
      condition: { type: 'points_balance', value: 50 },
      points: 10,
    },

    // Streak Achievements
    {
      code: 'STREAK_3',
      name: 'Getting Started',
      description: 'Used the app 3 days in a row',
      icon: 'Calendar',
      condition: { type: 'streak', value: 3 },
      points: 10,
    },
    {
      code: 'STREAK_7',
      name: 'Week Warrior',
      description: 'Used the app 7 days in a row',
      icon: 'Flame',
      condition: { type: 'streak', value: 7 },
      points: 30,
    },
    {
      code: 'STREAK_30',
      name: 'Dedicated',
      description: 'Used the app 30 days in a row',
      icon: 'Crown',
      condition: { type: 'streak', value: 30 },
      points: 100,
    },

    // Special Achievements
    {
      code: 'EARLY_BIRD',
      name: 'Early Bird',
      description: 'Used the app before 8 AM',
      icon: 'Sunrise',
      condition: { type: 'time_morning', value: 8 },
      points: 5,
    },
    {
      code: 'NIGHT_OWL',
      name: 'Night Owl',
      description: 'Used the app after 11 PM',
      icon: 'Moon',
      condition: { type: 'time_night', value: 23 },
      points: 5,
    },
    {
      code: 'COMPLETIONIST',
      name: 'Completionist',
      description: 'Used CV optimizer, interview, and quiz features',
      icon: 'BadgeCheck',
      condition: { type: 'all_features', value: 3 },
      points: 20,
    },
  ]

  for (const achievement of achievements) {
    await prisma.achievement.upsert({
      where: { code: achievement.code },
      update: achievement,
      create: achievement,
    })
  }

  console.log('Seeded achievements')

  // Check for admin user
  const adminEmail = process.env.ADMIN_EMAIL
  if (adminEmail) {
    const adminUser = await prisma.user.findUnique({
      where: { email: adminEmail },
    })
    if (adminUser) {
      await prisma.user.update({
        where: { email: adminEmail },
        data: { role: 'ADMIN' },
      })
      console.log(`Set ${adminEmail} as admin`)
    }
  }

  console.log('Seed completed')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
