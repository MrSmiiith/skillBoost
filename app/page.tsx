import Link from 'next/link'
import { Zap, FileText, MessageSquare, Trophy, Star, Github, Heart, CreditCard, Smartphone, Banknote, ArrowRight, CheckCircle, Sparkles, Coffee, Check } from 'lucide-react'
import { db } from '@/lib/db'
import { LandingNavbar } from '@/components/landing-navbar'
import { ScrollAnimation } from '@/components/scroll-animation'
import { StatusSection, StatusBadge } from '@/components/status-section'

async function getStats() {
  try {
    const [userCount, cvCount, interviewCount] = await Promise.all([
      db.user.count(),
      db.cVVersion.count(),
      db.interview.count()
    ])
    return { userCount, cvCount, interviewCount }
  } catch {
    return { userCount: 0, cvCount: 0, interviewCount: 0 }
  }
}

export default async function Home() {
  const stats = await getStats()

  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Navbar */}
      <LandingNavbar />

      {/* Grid Background */}
      <div className="fixed inset-0 bg-white dark:bg-gray-950 -z-10">
        <div
          className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
          style={{
            backgroundImage: `
              linear-gradient(to right, #6b7280 1px, transparent 1px),
              linear-gradient(to bottom, #6b7280 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px'
          }}
        />
        {/* Gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Hero Section */}
        <section className="relative min-h-screen flex flex-col items-center justify-center px-4 sm:px-8 pt-16">
          <div className="max-w-5xl text-center space-y-8">
            {/* Badge */}
            <div className="animate-fade-in [animation-delay:0ms]">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-sm font-medium">
                <Sparkles className="w-4 h-4" />
                Free & Open Source
              </span>
            </div>

            {/* 3D Icon */}
            <div className="flex justify-center animate-fade-in [animation-delay:100ms]">
              <div className="relative">
                <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center shadow-2xl animate-float">
                  <Zap className="w-16 h-16 text-white" strokeWidth={2} />
                </div>
                <div className="absolute -inset-4 bg-gradient-to-br from-purple-400 to-purple-600 rounded-3xl blur-2xl opacity-30 animate-pulse-glow -z-10" />
              </div>
            </div>

            <h1 className="text-5xl sm:text-7xl font-bold animate-fade-in [animation-delay:200ms]">
              <span className="bg-gradient-to-r from-purple-600 via-purple-500 to-blue-500 bg-clip-text text-transparent">
                SkillBoost
              </span>
            </h1>

            <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto animate-fade-in [animation-delay:300ms]">
              Improve your skills and confidence with AI-powered CV optimization and interview simulation
            </p>

            {/* Stats */}
            <div className="flex flex-wrap gap-8 justify-center py-6 animate-fade-in [animation-delay:400ms]">
              <div className="text-center group cursor-default">
                <p className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent group-hover:scale-110 transition-transform inline-block">
                  {stats.userCount}+
                </p>
                <p className="text-sm text-gray-500 mt-1">Users</p>
              </div>
              <div className="text-center group cursor-default">
                <p className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent group-hover:scale-110 transition-transform inline-block">
                  {stats.cvCount}+
                </p>
                <p className="text-sm text-gray-500 mt-1">CVs Optimized</p>
              </div>
              <div className="text-center group cursor-default">
                <p className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent group-hover:scale-110 transition-transform inline-block">
                  {stats.interviewCount}+
                </p>
                <p className="text-sm text-gray-500 mt-1">Interviews</p>
              </div>
            </div>

            {/* Status Section */}
            <div className="flex justify-center animate-fade-in [animation-delay:450ms]">
              <StatusSection />
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in [animation-delay:500ms]">
              <Link
                href="/login"
                className="group inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-purple-500 text-white font-semibold hover:shadow-xl hover:shadow-purple-500/25 transition-all text-lg"
              >
                Get Started Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="https://github.com/MrSmiiith/skillBoost"
                target="_blank"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl border-2 border-gray-200 dark:border-gray-800 hover:border-purple-500 dark:hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-950/20 transition-all text-lg font-medium"
              >
                <Github className="w-5 h-5" />
                View on GitHub
              </Link>
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce-subtle">
            <div className="w-6 h-10 rounded-full border-2 border-gray-300 dark:border-gray-700 flex justify-center pt-2">
              <div className="w-1.5 h-2.5 rounded-full bg-gray-400 dark:bg-gray-600 animate-scroll-dot" />
            </div>
          </div>
        </section>

        {/* Try Now Section */}
        <section id="demo" className="py-24 px-4 sm:px-8 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900/50 dark:to-gray-950">
          <div className="max-w-6xl mx-auto">
            <ScrollAnimation animation="fade-in-up" className="text-center mb-12">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-sm font-medium mb-4">
                <Sparkles className="w-4 h-4" />
                Get Started Today
              </span>
              <h2 className="text-4xl sm:text-5xl font-bold mb-4">
                AI-Powered CV
                <span className="bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent"> Analysis</span>
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Sign up for free and get 5 points to start optimizing your CV with AI.
              </p>
            </ScrollAnimation>

            <div className="max-w-lg mx-auto">
              <ScrollAnimation animation="scale-in" delay={100}>
                <Link href="/login" className="block group">
                  <div className="relative p-8 rounded-3xl bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-800 hover:border-purple-500 dark:hover:border-purple-500 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/10 cursor-pointer">
                    <div className="text-center space-y-6">
                      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                        <FileText className="w-10 h-10 text-white" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold mb-2">Optimize Your CV</h3>
                        <p className="text-gray-600 dark:text-gray-400">
                          Get AI-powered analysis with clarity, impact, and ATS readiness scores
                        </p>
                      </div>
                      <div className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-purple-500 text-white font-semibold group-hover:from-purple-700 group-hover:to-purple-600 transition-all">
                        Start Free
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </div>
                      <p className="text-sm text-gray-500">5 free points on signup</p>
                    </div>
                  </div>
                </Link>
              </ScrollAnimation>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 px-4 sm:px-8">
          <div className="max-w-6xl mx-auto">
            <ScrollAnimation animation="fade-in-up" className="text-center mb-16">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-sm font-medium mb-4">
                <Sparkles className="w-4 h-4" />
                Features
              </span>
              <h2 className="text-4xl sm:text-5xl font-bold mb-4">
                Everything you need to
                <span className="bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent"> succeed</span>
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Powerful AI tools to help you land your dream job
              </p>
            </ScrollAnimation>

            <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
              <ScrollAnimation animation="fade-in-up" delay={0}>
                <div className="group h-full p-8 rounded-3xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
                  <div className="w-14 h-14 rounded-2xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <FileText className="w-7 h-7 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">CV Optimizer</h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    Upload your CV and get AI-powered analysis with clarity, impact, and ATS readiness scores.
                  </p>
                </div>
              </ScrollAnimation>

              <ScrollAnimation animation="fade-in-up" delay={100}>
                <div className="group h-full p-8 rounded-3xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
                  <div className="w-14 h-14 rounded-2xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <MessageSquare className="w-7 h-7 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">Interview Simulator</h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    Practice with AI-powered mock interviews. Technical, behavioral, and system design.
                  </p>
                </div>
              </ScrollAnimation>

              <ScrollAnimation animation="fade-in-up" delay={200}>
                <div className="group h-full p-8 rounded-3xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
                  <div className="w-14 h-14 rounded-2xl bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Trophy className="w-7 h-7 text-yellow-600" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">Achievements</h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    Earn badges and track your progress. Gamified experience to keep you motivated.
                  </p>
                </div>
              </ScrollAnimation>
            </div>

            {/* Extra features list */}
            <ScrollAnimation animation="fade-in-up" delay={300} className="mt-16">
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  'Dark & Light Mode',
                  'Multiple Languages',
                  'Export to PDF',
                  'Progress Tracking',
                  'Real-time Feedback',
                  'Points System',
                  'Daily Rewards',
                  'Secure & Private'
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 dark:bg-gray-900/50 hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-sm font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </ScrollAnimation>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-24 px-4 sm:px-8 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900/50 dark:to-gray-950">
          <div className="max-w-6xl mx-auto">
            <ScrollAnimation animation="fade-in-up" className="text-center mb-16">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-sm font-medium mb-4">
                <Zap className="w-4 h-4" />
                Simple Pricing
              </span>
              <h2 className="text-4xl sm:text-5xl font-bold mb-4">
                Pay as you
                <span className="bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent"> go</span>
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Start free with 5 points. Buy more when you need them.
              </p>
            </ScrollAnimation>

            <div className="grid md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {[
                { points: 10, price: 200, popular: false },
                { points: 25, price: 450, popular: true },
                { points: 50, price: 800, popular: false },
                { points: 100, price: 1500, popular: false },
              ].map((pkg, i) => (
                <ScrollAnimation key={pkg.points} animation="fade-in-up" delay={i * 100}>
                  <div className={`relative p-6 rounded-2xl bg-white dark:bg-gray-900 border ${
                    pkg.popular
                      ? 'border-purple-500 shadow-xl shadow-purple-500/10'
                      : 'border-gray-200 dark:border-gray-800'
                  }`}>
                    {pkg.popular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-purple-500 text-white text-xs font-medium rounded-full">
                        Popular
                      </div>
                    )}
                    <div className="text-center">
                      <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mx-auto mb-4">
                        <Zap className="w-6 h-6 text-purple-600" />
                      </div>
                      <p className="text-3xl font-bold">{pkg.points}</p>
                      <p className="text-sm text-gray-500 mb-4">points</p>
                      <p className="text-2xl font-bold text-purple-600">{pkg.price} DA</p>
                    </div>
                  </div>
                </ScrollAnimation>
              ))}
            </div>

            <ScrollAnimation animation="fade-in" delay={400} className="mt-12">
              <div className="max-w-2xl mx-auto bg-white dark:bg-gray-900 rounded-2xl p-8 border border-gray-200 dark:border-gray-800">
                <h3 className="text-xl font-bold mb-6 text-center">What you can do with points</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    'CV Optimization - 1 point',
                    'Interview Session - 1 point',
                    'Daily Quiz - Free',
                    'Achievements - Free',
                    'Export to PDF - Free',
                    'Unlimited History'
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-green-500" />
                      <span className="text-sm">{item}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-6 text-center">
                  <Link
                    href="/login"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-purple-600 text-white font-medium hover:bg-purple-700 transition"
                  >
                    Get Started Free
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <p className="text-sm text-gray-500 mt-2">5 free points on signup</p>
                </div>
              </div>
            </ScrollAnimation>
          </div>
        </section>

        {/* Buy Me Coffee Section */}
        <section id="coffee" className="py-24 px-4 sm:px-8">
          <div className="max-w-4xl mx-auto">
            <ScrollAnimation animation="scale-in" className="text-center">
              <div className="p-12 rounded-[2rem] bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-200 dark:border-amber-800">
                <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center mx-auto mb-6 shadow-xl shadow-amber-500/20">
                  <Coffee className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                  Buy Me a Coffee
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-xl mx-auto">
                  If you enjoy using SkillBoost, consider buying me a coffee! Your support helps keep the servers running and enables new features.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a
                    href="https://buymeacoffee.com/mrsmiiith"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-amber-500 text-white font-semibold hover:bg-amber-600 transition text-lg shadow-lg shadow-amber-500/20"
                  >
                    <Coffee className="w-5 h-5" />
                    Buy Me a Coffee
                  </a>
                  <Link
                    href="/points"
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl border-2 border-amber-300 dark:border-amber-700 hover:bg-amber-100 dark:hover:bg-amber-900/20 transition font-semibold text-lg"
                  >
                    <Zap className="w-5 h-5" />
                    Support via Points
                  </Link>
                </div>
              </div>
            </ScrollAnimation>
          </div>
        </section>

        {/* Open Source Section */}
        <section id="open-source" className="py-24 px-4 sm:px-8 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900/50 dark:to-gray-950">
          <ScrollAnimation animation="scale-in" className="max-w-4xl mx-auto text-center">
            <div className="w-20 h-20 rounded-3xl bg-gray-900 dark:bg-white flex items-center justify-center mx-auto mb-8 shadow-2xl">
              <Github className="w-10 h-10 text-white dark:text-gray-900" />
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold mb-6">
              100% Open Source
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
              SkillBoost is completely open source and free to use.
              Want to add new features, fix bugs, or improve the platform?
              Contributions are always welcome!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="https://github.com/MrSmiiith/skillBoost"
                target="_blank"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-semibold hover:opacity-90 transition text-lg"
              >
                <Star className="w-5 h-5" />
                Star on GitHub
              </Link>
              <Link
                href="https://github.com/MrSmiiith/skillBoost/fork"
                target="_blank"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl border-2 border-gray-200 dark:border-gray-800 hover:border-gray-900 dark:hover:border-white transition font-semibold text-lg"
              >
                Fork Repository
              </Link>
            </div>
          </ScrollAnimation>
        </section>

        {/* Support Section */}
        <section id="support" className="py-24 px-4 sm:px-8">
          <div className="max-w-4xl mx-auto">
            <ScrollAnimation animation="fade-in-up" className="text-center mb-16">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-pink-500 to-red-500 flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-pink-500/20">
                <Heart className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-4xl sm:text-5xl font-bold mb-6">
                Support the Project
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                If you find SkillBoost useful, consider supporting the project.
                Your donation helps keep the servers running and enables new features.
              </p>
              <p className="mt-4 text-lg font-semibold text-purple-600 dark:text-purple-400">
                Donate and get bonus points!
              </p>
            </ScrollAnimation>

            <div className="grid sm:grid-cols-3 gap-6">
              <ScrollAnimation animation="slide-in-left" delay={0}>
                <div className="group p-8 rounded-3xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 text-center hover:shadow-xl hover:-translate-y-1 transition-all">
                  <div className="w-16 h-16 rounded-2xl bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <Smartphone className="w-8 h-8 text-yellow-600" />
                  </div>
                  <h3 className="text-xl font-bold mb-1">BaridiMob</h3>
                  <p className="text-gray-500">Mobile payment</p>
                </div>
              </ScrollAnimation>

              <ScrollAnimation animation="fade-in-up" delay={100}>
                <div className="group p-8 rounded-3xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 text-center hover:shadow-xl hover:-translate-y-1 transition-all">
                  <div className="w-16 h-16 rounded-2xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <CreditCard className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold mb-1">CCP</h3>
                  <p className="text-gray-500">Postal account</p>
                </div>
              </ScrollAnimation>

              <ScrollAnimation animation="slide-in-right" delay={200}>
                <div className="group p-8 rounded-3xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 text-center hover:shadow-xl hover:-translate-y-1 transition-all">
                  <div className="w-16 h-16 rounded-2xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <Banknote className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold mb-1">Flexy</h3>
                  <p className="text-gray-500">Flexy transfer</p>
                </div>
              </ScrollAnimation>
            </div>

            <ScrollAnimation animation="fade-in" delay={300}>
              <p className="text-center text-gray-500 mt-8">
                Sign in and go to{' '}
                <Link href="/points" className="text-purple-600 hover:underline font-medium">
                  Points
                </Link>{' '}
                to purchase points and support the project.
              </p>
            </ScrollAnimation>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 px-4 sm:px-8">
          <ScrollAnimation animation="scale-in" className="max-w-4xl mx-auto text-center">
            <div className="p-12 rounded-[2rem] bg-gradient-to-br from-purple-600 to-purple-800 text-white relative overflow-hidden">
              {/* Background pattern */}
              <div className="absolute inset-0 opacity-10">
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage: `
                      linear-gradient(to right, white 1px, transparent 1px),
                      linear-gradient(to bottom, white 1px, transparent 1px)
                    `,
                    backgroundSize: '30px 30px'
                  }}
                />
              </div>

              <div className="relative z-10">
                <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                  Ready to boost your skills?
                </h2>
                <p className="text-xl text-purple-100 mb-8 max-w-xl mx-auto">
                  Join hundreds of users improving their career prospects with SkillBoost
                </p>
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-white text-purple-600 font-semibold hover:bg-purple-50 transition text-lg shadow-xl"
                >
                  Get Started Now
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </ScrollAnimation>
        </section>

        {/* Footer */}
        <footer className="py-16 px-4 sm:px-8 border-t border-gray-100 dark:border-gray-800">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center shadow-lg">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-xl">SkillBoost</span>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500">
                <a href="#demo" className="hover:text-purple-600 transition">Demo</a>
                <a href="#features" className="hover:text-purple-600 transition">Features</a>
                <a href="#pricing" className="hover:text-purple-600 transition">Pricing</a>
                <a href="#open-source" className="hover:text-purple-600 transition">Open Source</a>
                <Link
                  href="https://github.com/MrSmiiith/skillBoost"
                  target="_blank"
                  className="hover:text-purple-600 transition flex items-center gap-1"
                >
                  <Github className="w-4 h-4" />
                  GitHub
                </Link>
              </div>
            </div>

            <div className="mt-12 pt-8 border-t border-gray-100 dark:border-gray-800 text-center space-y-4">
              <div className="flex justify-center">
                <StatusBadge />
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                Built with passion by{' '}
                <a
                  href="https://merzougrayane.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-600 hover:underline font-semibold"
                >
                  MrSmith
                </a>
              </p>
              <p className="text-sm text-gray-400">
                Open source project under MIT License
              </p>
            </div>
          </div>
        </footer>
      </div>
    </main>
  )
}
