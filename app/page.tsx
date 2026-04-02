"use client"
import { useAuth } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function Home() {
  const { isSignedIn, isLoaded } = useAuth()
  const router = useRouter()

  const handleAnalyzeClick = () => {
    if (!isLoaded) return
    if (isSignedIn) {
      router.push("/dashboard")
    } else {
      router.push("/sign-in")
    }
  }

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-4">
        <span className="text-xl font-bold text-purple-400">ResumeAI</span>
        <div className="flex items-center gap-4">
          <span className="text-sm text-green-400">● Powered by GPT-4o</span>
          <button
            onClick={() => router.push("/dashboard")}
            className="px-4 py-2 bg-zinc-800 rounded-lg text-sm hover:bg-zinc-700"
          >
            Go to Dashboard
          </button>
        </div>
      </nav>

      {/* Hero */}
      <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4">
        <div className="mb-6 px-4 py-2 bg-zinc-900 rounded-full text-sm text-green-400 border border-zinc-800">
          ● Powered by GPT-4o
        </div>
        <h1 className="text-6xl font-bold mb-4">
          Analyze Your Resume.<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
            Land Your Dream Job.
          </span>
        </h1>
        <p className="text-zinc-400 text-lg mb-8 max-w-2xl">
          Upload your resume, paste a job description, and get instant AI-powered 
          feedback to maximize your chances of landing interviews.
        </p>
        <div className="flex gap-4 mb-4">
          <button
            onClick={handleAnalyzeClick}
            className="px-8 py-4 bg-purple-600 hover:bg-purple-700 rounded-xl font-semibold text-lg transition-all"
          >
            Analyze My Resume →
          </button>
          <button className="px-8 py-4 bg-zinc-800 hover:bg-zinc-700 rounded-xl font-semibold text-lg transition-all">
            See How It Works
          </button>
        </div>
        <p className="text-zinc-500 text-sm">
          Already have an account?{" "}
          <Link href="/sign-in" className="text-purple-400 hover:underline">
            Sign in
          </Link>
        </p>
        <div className="flex gap-8 mt-12 text-sm text-zinc-400">
          <span className="px-4 py-2 bg-zinc-900 rounded-lg border border-zinc-800">98% Accuracy</span>
          <span className="px-4 py-2 bg-zinc-900 rounded-lg border border-zinc-800">10,000+ Resumes Analyzed</span>
          <span className="px-4 py-2 bg-zinc-900 rounded-lg border border-zinc-800">2s Average Analysis</span>
        </div>
      </div>
    </main>
  )
}
