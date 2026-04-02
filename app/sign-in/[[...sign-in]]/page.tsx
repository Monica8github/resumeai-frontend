"use client"
import { signIn } from "next-auth/react"

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="bg-zinc-900 p-8 rounded-xl border border-zinc-800 w-full max-w-md">
        <h1 className="text-white text-2xl font-bold mb-2 text-center">Welcome back</h1>
        <p className="text-zinc-400 text-center mb-6">Sign in to your account</p>
        <button
          onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
          className="w-full bg-white text-black py-3 px-4 rounded-lg font-medium hover:bg-gray-100 flex items-center justify-center gap-3"
        >
          <img src="https://www.google.com/favicon.ico" width={20} height={20} alt="Google" />
          Continue with Google
        </button>
      </div>
    </div>
  )
}
