"use client"
import { SignUp } from "@clerk/nextjs"

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <SignUp
        appearance={{
          elements: {
            rootBox: "mx-auto",
            card: "bg-zinc-900 border border-zinc-800",
            headerTitle: "text-white",
            headerSubtitle: "text-zinc-400",
            socialButtonsBlockButton: "bg-zinc-800 border border-zinc-700 text-white hover:bg-zinc-700",
            formFieldInput: "bg-zinc-800 border-zinc-700 text-white",
            footerActionLink: "text-purple-400 hover:text-purple-300",
          }
        }}
      />
    </div>
  )
}