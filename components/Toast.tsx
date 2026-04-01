"use client"

import { useEffect } from "react"
import { Check, XCircle, X } from "lucide-react"

interface ToastProps {
  message: string
  title?: string
  isVisible: boolean
  onClose: () => void
  type?: "success" | "error"
}

export function Toast({ message, title, isVisible, onClose, type = "success" }: ToastProps) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose()
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [isVisible, onClose])

  if (!isVisible) return null

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-toast-slide-in">
      {type === "error" ? (
        <div className="flex items-start gap-3 px-4 py-4 rounded-xl bg-[#13131A] border-l-4 border-l-red-500 border border-white/10 shadow-xl min-w-[320px]">
          <div className="shrink-0">
            <XCircle className="w-5 h-5 text-red-500" />
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-bold text-white">{title || "Error"}</h4>
            <p className="text-sm text-zinc-400 mt-0.5">{message}</p>
          </div>
          <button
            onClick={onClose}
            className="shrink-0 p-1 rounded hover:bg-white/5 transition-colors"
          >
            <X className="w-4 h-4 text-zinc-500" />
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#13131A] border border-white/10 shadow-xl">
          <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center">
            <Check className="w-4 h-4 text-emerald-400" />
          </div>
          <span className="text-sm text-white">{message}</span>
          <button
            onClick={onClose}
            className="shrink-0 p-1 rounded hover:bg-white/5 transition-colors ml-2"
          >
            <X className="w-4 h-4 text-zinc-500" />
          </button>
        </div>
      )}
    </div>
  )
}
