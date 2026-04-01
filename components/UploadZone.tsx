"use client"

import { useState, useRef, useCallback } from "react"
import { Upload, X, FileText } from "lucide-react"

interface UploadZoneProps {
  onFileSelect: (file: File | null) => void
  selectedFile: File | null
}

export function UploadZone({ onFileSelect, selectedFile }: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const file = e.dataTransfer.files[0]
    if (file && file.type === "application/pdf") {
      onFileSelect(file)
    }
  }, [onFileSelect])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      onFileSelect(file)
    }
  }

  const handleClick = () => {
    inputRef.current?.click()
  }

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation()
    onFileSelect(null)
    if (inputRef.current) {
      inputRef.current.value = ""
    }
  }

  return (
    <div
      onClick={handleClick}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`
        relative flex flex-col items-center justify-center p-8 rounded-xl cursor-pointer
        border-2 border-dashed transition-all duration-200
        ${isDragging 
          ? "border-[#6C63FF] bg-[#6C63FF]/5" 
          : "border-white/10 bg-[#13131A] hover:border-white/20"
        }
        ${selectedFile ? "border-solid border-emerald-500/50" : ""}
      `}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".pdf"
        onChange={handleFileChange}
        className="hidden"
      />

      {selectedFile ? (
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
            <FileText className="w-4 h-4 text-emerald-400" />
            <span className="text-sm text-emerald-400 max-w-[200px] truncate">
              {selectedFile.name}
            </span>
            <button
              onClick={handleRemove}
              className="ml-2 p-1 rounded-full hover:bg-emerald-500/20 transition-colors"
            >
              <X className="w-3 h-3 text-emerald-400" />
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="w-12 h-12 rounded-full bg-[#6C63FF]/10 flex items-center justify-center mb-4">
            <Upload className="w-6 h-6 text-[#6C63FF]" />
          </div>
          <p className="text-white font-medium mb-1">
            Drop your resume here
          </p>
          <p className="text-sm text-zinc-400">
            or click to browse
          </p>
          <p className="text-xs text-zinc-500 mt-3">
            PDF files only, max 5MB
          </p>
        </>
      )}
    </div>
  )
}
