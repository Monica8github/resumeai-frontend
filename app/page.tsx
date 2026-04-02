"use client"

import Link from "next/link"
import { Target, Search, Sparkles, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 backdrop-blur-md bg-[#0A0A0F]/80 border-b border-white/5">
        <Link href="/" className="font-[family-name:var(--font-sora)] text-xl font-bold bg-gradient-to-r from-[#6C63FF] to-[#00D4AA] bg-clip-text text-transparent">
          ResumeAI
        </Link>
        
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#13131A] border border-white/5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse-dot" />
            <span className="text-sm text-zinc-400">Powered by GPT-4o</span>
          </div>
          <Link href="/dashboard">
            <Button variant="outline" className="border-white/10 bg-transparent text-white hover:bg-white/5">
              Go to Dashboard
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Animated blob background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#6C63FF]/30 rounded-full blur-3xl animate-blob" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#00D4AA]/20 rounded-full blur-3xl animate-blob-delay" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#13131A] border border-white/5 mb-8 animate-fade-in-up">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse-dot" />
            <span className="text-sm text-zinc-400">Powered by GPT-4o</span>
          </div>

          {/* Headline */}
          <h1 className="font-[family-name:var(--font-sora)] text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight mb-6 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            <span className="block">Analyze Your Resume.</span>
            <span className="block bg-gradient-to-r from-[#6C63FF] to-[#00D4AA] bg-clip-text text-transparent">
              Land Your Dream Job.
            </span>
          </h1>

          {/* Subtext */}
          <p className="text-lg sm:text-xl text-zinc-400 max-w-2xl mx-auto mb-10 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            Upload your resume, paste a job description, and get instant AI-powered feedback to maximize your chances of landing interviews.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
            <Link href="/sign-in">
              <Button size="lg" className="bg-gradient-to-r from-[#6C63FF] to-[#8B7AFF] hover:from-[#5B52E5] hover:to-[#7A69E5] text-white px-8 py-6 text-lg">
                Analyze My Resume
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="border-white/10 bg-transparent text-white hover:bg-white/5 px-8 py-6 text-lg">
              See How It Works
            </Button>
          </div>

          {/* Already have account link */}
          <p className="text-sm text-zinc-400 mb-10 animate-fade-in-up" style={{ animationDelay: "0.35s" }}>
            Already have an account?{" "}
            <Link href="/sign-in" className="text-[#6C63FF] hover:text-[#8B7AFF] transition-colors">
              Sign in
            </Link>
          </p>

          {/* Floating stat pills */}
          <div className="flex flex-wrap items-center justify-center gap-4 animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
            <div className="px-5 py-3 rounded-full bg-[#13131A] border border-white/5">
              <span className="text-sm font-medium">98% Accuracy</span>
            </div>
            <div className="px-5 py-3 rounded-full bg-[#13131A] border border-white/5">
              <span className="text-sm font-medium">10,000+ Resumes Analyzed</span>
            </div>
            <div className="px-5 py-3 rounded-full bg-[#13131A] border border-white/5">
              <span className="text-sm font-medium">2s Average Analysis</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-[family-name:var(--font-sora)] text-3xl sm:text-4xl font-bold text-center mb-16">
            Why ResumeAI?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="group p-8 rounded-2xl bg-[#13131A] border border-white/5 hover:-translate-y-1 transition-transform duration-300">
              <div className="w-12 h-12 rounded-xl bg-[#6C63FF]/10 flex items-center justify-center mb-6">
                <Target className="w-6 h-6 text-[#6C63FF]" />
              </div>
              <h3 className="font-[family-name:var(--font-sora)] text-xl font-semibold mb-3">
                Accurate Match Score
              </h3>
              <p className="text-zinc-400 leading-relaxed">
                ATS-grade scoring matched to the exact job description you provide.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group p-8 rounded-2xl bg-[#13131A] border border-white/5 hover:-translate-y-1 transition-transform duration-300">
              <div className="w-12 h-12 rounded-xl bg-[#00D4AA]/10 flex items-center justify-center mb-6">
                <Search className="w-6 h-6 text-[#00D4AA]" />
              </div>
              <h3 className="font-[family-name:var(--font-sora)] text-xl font-semibold mb-3">
                Skill Gap Detection
              </h3>
              <p className="text-zinc-400 leading-relaxed">
                Instantly see what skills are missing from your resume compared to the role.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group p-8 rounded-2xl bg-[#13131A] border border-white/5 hover:-translate-y-1 transition-transform duration-300">
              <div className="w-12 h-12 rounded-xl bg-[#8B5CF6]/10 flex items-center justify-center mb-6">
                <Sparkles className="w-6 h-6 text-[#8B5CF6]" />
              </div>
              <h3 className="font-[family-name:var(--font-sora)] text-xl font-semibold mb-3">
                Smart Improvements
              </h3>
              <p className="text-zinc-400 leading-relaxed">
                GPT-4o rewrites and suggestions tailored specifically to the role you want.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 px-6 bg-[#0D0D14]">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-[family-name:var(--font-sora)] text-3xl sm:text-4xl font-bold text-center mb-16">
            Three Steps to Your Dream Job
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#6C63FF]/10 border border-[#6C63FF]/20 mb-6">
                <span className="font-[family-name:var(--font-sora)] text-2xl font-bold text-[#6C63FF]">1</span>
              </div>
              <h3 className="font-[family-name:var(--font-sora)] text-xl font-semibold mb-3">
                Upload Your Resume
              </h3>
              <p className="text-zinc-400">
                Drop your PDF resume or click to browse files
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#6C63FF]/10 border border-[#6C63FF]/20 mb-6">
                <span className="font-[family-name:var(--font-sora)] text-2xl font-bold text-[#6C63FF]">2</span>
              </div>
              <h3 className="font-[family-name:var(--font-sora)] text-xl font-semibold mb-3">
                Paste Job Description
              </h3>
              <p className="text-zinc-400">
                Copy and paste the full job posting you want to apply for
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#6C63FF]/10 border border-[#6C63FF]/20 mb-6">
                <span className="font-[family-name:var(--font-sora)] text-2xl font-bold text-[#6C63FF]">3</span>
              </div>
              <h3 className="font-[family-name:var(--font-sora)] text-xl font-semibold mb-3">
                Get AI Insights
              </h3>
              <p className="text-zinc-400">
                Receive instant feedback, scores, and improvement suggestions
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link href="/" className="font-[family-name:var(--font-sora)] text-lg font-bold bg-gradient-to-r from-[#6C63FF] to-[#00D4AA] bg-clip-text text-transparent">
            ResumeAI
          </Link>
          <p className="text-sm text-zinc-500">
            © 2025 ResumeAI. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
