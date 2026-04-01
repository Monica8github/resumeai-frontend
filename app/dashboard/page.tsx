"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import Link from "next/link"
import { Loader2, Copy, Check, FileSearch, FileText, X, Upload, ArrowLeft, Download, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { ScoreRing } from "@/components/ScoreRing"
import { SkillBadge } from "@/components/SkillBadge"
import { Toast } from "@/components/Toast"
import { analyzeResume, type AnalysisResult } from "@/lib/api"

type LoadingStep = "reading" | "analyzing" | "generating" | "finalizing"

const LOADING_STEPS: Record<LoadingStep, string> = {
  reading: "Reading your resume...",
  analyzing: "Analyzing job requirements...",
  generating: "Generating insights...",
  finalizing: "Finalizing report...",
}

export default function DashboardPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [jobDescription, setJobDescription] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [loadingStep, setLoadingStep] = useState<LoadingStep>("reading")
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)
  const [toastVisible, setToastVisible] = useState(false)
  const [toastMessage, setToastMessage] = useState("")
  const [toastTitle, setToastTitle] = useState("")
  const [toastType, setToastType] = useState<"success" | "error">("success")
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const progressIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const maxChars = 3000
  const MIN_FILE_SIZE_KB = 10

  const showToast = (message: string, type: "success" | "error" = "success", title?: string) => {
    setToastMessage(message)
    setToastTitle(title || "")
    setToastType(type)
    setToastVisible(true)
  }

  const getFileSizeKB = (file: File) => Math.round(file.size / 1024)

  const validateFile = (file: File): { valid: boolean; error?: string } => {
    // Check file type
    if (!file.name.toLowerCase().endsWith(".pdf")) {
      return { valid: false, error: "Only PDF files are accepted." }
    }
    // Check file size
    if (getFileSizeKB(file) < MIN_FILE_SIZE_KB) {
      return { valid: false, error: "This file is too small to be a resume. Please upload a valid resume PDF." }
    }
    return { valid: true }
  }

  const handleFileSelect = (file: File) => {
    const validation = validateFile(file)
    if (validation.valid) {
      setSelectedFile(file)
      setErrorMessage(null)
    } else {
      showToast(validation.error!, "error", "Invalid File")
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFileSelect(file)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleClearFile = () => {
    setSelectedFile(null)
    setResult(null)
    setErrorMessage(null)
  }

  const handleClearAll = () => {
    setSelectedFile(null)
    setJobDescription("")
    setResult(null)
    setErrorMessage(null)
  }

  const handleAnalyze = async () => {
    if (!selectedFile || !jobDescription.trim()) return

    // Validate file size again before sending
    if (getFileSizeKB(selectedFile) < MIN_FILE_SIZE_KB) {
      showToast("This file is too small to be a resume. Please upload a valid resume PDF.", "error", "Invalid File")
      return
    }

    setIsLoading(true)
    setProgress(0)
    setLoadingStep("reading")
    setResult(null)
    setErrorMessage(null)

    // Animate progress bar with steps
    const startTime = Date.now()
    const duration = 4000

    progressIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime
      const progressValue = Math.min((elapsed / duration) * 90, 90)
      setProgress(progressValue)
      
      // Update loading step based on progress
      if (progressValue < 30) {
        setLoadingStep("reading")
      } else if (progressValue < 60) {
        setLoadingStep("analyzing")
      } else if (progressValue < 90) {
        setLoadingStep("generating")
      } else {
        setLoadingStep("finalizing")
      }
      
      if (progressValue >= 90 && progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current)
      }
    }, 50)

    try {
      const data = await analyzeResume(selectedFile, jobDescription)
      setResult(data)
      setProgress(100)
      setLoadingStep("finalizing")
    } catch (err) {
      const message = err instanceof Error ? err.message : "Could not connect to backend."
      setErrorMessage(message)
      showToast(message, "error", "Analysis Failed")
    } finally {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current)
      }
      setIsLoading(false)
    }
  }

  const handleReanalyze = () => {
    handleAnalyze()
  }

  const handleExport = () => {
    if (!result) return

    const content = `ResumeAI Analysis Report
========================
Match Score: ${result.score}/100

Sub-Scores:
- ATS Score: ${result.ats_score}/100
- Keywords Match: ${result.keyword_score}/100
- Role Fit: ${result.role_fit_score}/100

Match Level: ${result.match_label}

Strengths:
${result.strengths.map(s => `- ${s}`).join("\n")}

Missing Skills:
${result.missing_skills.map(s => `- ${s}`).join("\n")}

Improvement Suggestions:
${result.suggestions.map((s, i) => `${i + 1}. ${s}`).join("\n")}

Interview Tips:
${result.interview_tips.map(section => `${section.category}: ${section.tips.join(", ")}`).join("\n")}
`

    const blob = new Blob([content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "resume-analysis.txt"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    showToast("Report exported successfully!")
  }

  useEffect(() => {
    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current)
      }
    }
  }, [])

  const handleCopy = useCallback(async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedIndex(index)
      showToast("Copied to clipboard!")
      setTimeout(() => setCopiedIndex(null), 2000)
    } catch {
      showToast("Failed to copy", "error")
    }
  }, [])

  const getScoreColor = (score: number) => {
    if (score >= 75) return "text-emerald-400"
    if (score >= 50) return "text-amber-400"
    return "text-red-400"
  }

  const getScoreBgColor = (score: number) => {
    if (score >= 75) return "bg-emerald-500/10"
    if (score >= 50) return "bg-amber-500/10"
    return "bg-red-500/10"
  }

  const getMatchLabelColor = (label: string) => {
    switch (label) {
      case "Excellent Match":
        return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
      case "Good Match":
        return "bg-teal-500/20 text-teal-400 border-teal-500/30"
      case "Fair Match":
        return "bg-amber-500/20 text-amber-400 border-amber-500/30"
      case "Poor Match":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      default:
        return "bg-zinc-500/20 text-zinc-400 border-zinc-500/30"
    }
  }

  const canAnalyze = selectedFile && jobDescription.trim().length > 0

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 backdrop-blur-md bg-[#0A0A0F]/80 border-b border-white/5">
        <div className="flex items-center">
          <Link
            href="/"
            className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors duration-200 mr-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back</span>
          </Link>
          <Link href="/" className="font-[family-name:var(--font-sora)] text-xl font-bold bg-gradient-to-r from-[#6C63FF] to-[#00D4AA] bg-clip-text text-transparent">
            ResumeAI
          </Link>
        </div>
        
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#13131A] border border-white/5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse-dot" />
          <span className="text-sm text-zinc-400">AI-Powered</span>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Panel - Input */}
          <div className="flex-1 space-y-6">
            {/* Upload Zone */}
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-3">
                Resume
              </label>
              
              {selectedFile ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#00D4AA]/10 border border-[#00D4AA]/30">
                    <FileText className="w-5 h-5 text-[#00D4AA]" />
                    <div className="flex-1 min-w-0">
                      <span className="text-sm text-[#00D4AA] font-medium truncate block">
                        {selectedFile.name}
                      </span>
                      <span className="text-xs text-zinc-400">
                        {getFileSizeKB(selectedFile)} KB
                      </span>
                    </div>
                    <button
                      onClick={handleClearFile}
                      className="p-1 rounded hover:bg-white/10 transition-colors"
                    >
                      <X className="w-4 h-4 text-[#00D4AA]" />
                    </button>
                  </div>
                  {getFileSizeKB(selectedFile) >= MIN_FILE_SIZE_KB && (
                    <p className="text-xs text-emerald-400 flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      Resume detected
                    </p>
                  )}
                </div>
              ) : (
                <div
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onClick={() => fileInputRef.current?.click()}
                  className={`
                    relative flex flex-col items-center justify-center p-8 rounded-2xl border-2 border-dashed cursor-pointer transition-all duration-200
                    ${isDragging 
                      ? "border-[#6C63FF] bg-[#6C63FF]/5" 
                      : "border-white/10 bg-[#13131A] hover:border-[#6C63FF]/50 hover:bg-[#6C63FF]/5"
                    }
                  `}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) handleFileSelect(file)
                    }}
                    className="hidden"
                  />
                  <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-4">
                    <Upload className="w-6 h-6 text-zinc-400" />
                  </div>
                  <p className="text-sm text-zinc-300 mb-1">
                    Drop your resume here, or{" "}
                    <span className="text-[#6C63FF]">browse</span>
                  </p>
                  <p className="text-xs text-zinc-500">PDF only, min 10KB</p>
                </div>
              )}
            </div>

            {/* Job Description */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-medium text-zinc-300">
                  Job Description
                </label>
                <span className="text-xs text-zinc-500">
                  {jobDescription.length} / {maxChars}
                </span>
              </div>
              <Textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value.slice(0, maxChars))}
                placeholder="Paste the full job description here..."
                className="min-h-[200px] bg-[#13131A] border-white/10 text-white placeholder:text-zinc-500 resize-none focus:border-[#6C63FF] focus:ring-[#6C63FF]/20"
              />
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                onClick={handleAnalyze}
                disabled={!canAnalyze || isLoading}
                className={`w-full py-6 text-lg transition-all duration-200 ${
                  canAnalyze && !isLoading
                    ? "bg-gradient-to-r from-[#6C63FF] to-[#8B7AFF] hover:from-[#5B52E5] hover:to-[#7A69E5]"
                    : "bg-zinc-700 text-zinc-400 cursor-not-allowed"
                }`}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    {LOADING_STEPS[loadingStep]}
                  </>
                ) : (
                  <>
                    Analyze Resume
                    <span className="ml-2">&rarr;</span>
                  </>
                )}
              </Button>

              {/* Progress Bar */}
              {isLoading && (
                <div className="space-y-2">
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-[#6C63FF] to-[#00D4AA] transition-all duration-100 ease-out"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className="text-xs text-zinc-500 text-center">{Math.round(progress)}%</p>
                </div>
              )}

              {/* Clear Button */}
              {(selectedFile || jobDescription) && !isLoading && (
                <Button
                  variant="ghost"
                  onClick={handleClearAll}
                  className="w-full text-zinc-400 hover:text-white hover:bg-white/5"
                >
                  Clear All
                </Button>
              )}
            </div>
          </div>

          {/* Right Panel - Results */}
          <div className="flex-1 min-h-[500px]">
            <div className="h-full rounded-2xl bg-[#13131A] border border-white/5 p-6">
              {/* Empty State */}
              {!isLoading && !result && !errorMessage && (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-6">
                    <FileSearch className="w-8 h-8 text-zinc-500" />
                  </div>
                  <h3 className="text-lg font-medium text-zinc-300 mb-4">
                    How to get your analysis
                  </h3>
                  <div className="space-y-3 text-left max-w-xs">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-[#6C63FF]/20 flex items-center justify-center shrink-0">
                        <span className="text-xs font-medium text-[#6C63FF]">1</span>
                      </div>
                      <p className="text-sm text-zinc-400">Upload your resume PDF (min 10KB)</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-[#6C63FF]/20 flex items-center justify-center shrink-0">
                        <span className="text-xs font-medium text-[#6C63FF]">2</span>
                      </div>
                      <p className="text-sm text-zinc-400">Enter the full job description</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-[#6C63FF]/20 flex items-center justify-center shrink-0">
                        <span className="text-xs font-medium text-[#6C63FF]">3</span>
                      </div>
                      <p className="text-sm text-zinc-400">Click Analyze Resume</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Error State */}
              {!isLoading && errorMessage && !result && (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
                    <X className="w-8 h-8 text-red-400" />
                  </div>
                  <h3 className="text-lg font-medium text-zinc-300 mb-2">
                    Analysis Failed
                  </h3>
                  <p className="text-sm text-zinc-500 max-w-sm mb-6">
                    {errorMessage}
                  </p>
                  <Button
                    onClick={handleAnalyze}
                    disabled={!canAnalyze}
                    className="bg-[#6C63FF] hover:bg-[#5B52E5]"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Try Again
                  </Button>
                </div>
              )}

              {/* Loading State */}
              {isLoading && (
                <div className="space-y-6">
                  {/* Score skeleton */}
                  <div className="flex justify-center">
                    <div className="w-40 h-40 rounded-full animate-shimmer" />
                  </div>
                  {/* Loading steps */}
                  <div className="flex flex-col items-center gap-2">
                    <p className="text-sm text-[#6C63FF] font-medium">{LOADING_STEPS[loadingStep]}</p>
                    <p className="text-xs text-zinc-500">{Math.round(progress)}% complete</p>
                  </div>
                  {/* Badges skeleton */}
                  <div className="space-y-3">
                    <div className="h-4 w-24 rounded animate-shimmer" />
                    <div className="flex flex-wrap gap-2">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="h-8 w-20 rounded-full animate-shimmer" />
                      ))}
                    </div>
                  </div>
                  {/* List skeleton */}
                  <div className="space-y-3">
                    <div className="h-4 w-32 rounded animate-shimmer" />
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="h-12 rounded-lg animate-shimmer" />
                    ))}
                  </div>
                </div>
              )}

              {/* Results State */}
              {result && !isLoading && (
                <div className="space-y-8">
                  {/* Action Buttons */}
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleReanalyze}
                      className="text-zinc-400 hover:text-white"
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Re-analyze
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleExport}
                      className="text-zinc-400 hover:text-white"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                  </div>

                  {/* Match Score */}
                  <div className="flex flex-col items-center">
                    <ScoreRing score={result.score} />
                    <p className="mt-2 text-sm text-zinc-400">Match Score</p>
                    {/* Match Label Badge */}
                    <span className={`mt-3 px-3 py-1 rounded-full text-xs font-medium border ${getMatchLabelColor(result.match_label)}`}>
                      {result.match_label}
                    </span>
                  </div>

                  {/* Sub-Scores */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className={`p-4 rounded-xl ${getScoreBgColor(result.ats_score)} border border-white/5 text-center`}>
                      <p className={`text-2xl font-bold ${getScoreColor(result.ats_score)}`}>
                        {result.ats_score}%
                      </p>
                      <p className="text-xs text-zinc-400 mt-1">ATS Score</p>
                    </div>
                    <div className={`p-4 rounded-xl ${getScoreBgColor(result.keyword_score)} border border-white/5 text-center`}>
                      <p className={`text-2xl font-bold ${getScoreColor(result.keyword_score)}`}>
                        {result.keyword_score}%
                      </p>
                      <p className="text-xs text-zinc-400 mt-1">Keywords</p>
                    </div>
                    <div className={`p-4 rounded-xl ${getScoreBgColor(result.role_fit_score)} border border-white/5 text-center`}>
                      <p className={`text-2xl font-bold ${getScoreColor(result.role_fit_score)}`}>
                        {result.role_fit_score}%
                      </p>
                      <p className="text-xs text-zinc-400 mt-1">Role Fit</p>
                    </div>
                  </div>

                  {/* Strengths */}
                  {result.strengths.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-zinc-300 mb-3">Strengths</h4>
                      <div className="flex flex-wrap gap-2">
                        {result.strengths.map((strength, i) => (
                          <SkillBadge key={i} variant="strength">
                            {strength}
                          </SkillBadge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Missing Skills */}
                  {result.missing_skills.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-zinc-300 mb-3">Missing Skills</h4>
                      <div className="flex flex-wrap gap-2">
                        {result.missing_skills.map((skill, i) => (
                          <SkillBadge key={i} variant="missing">
                            {skill}
                          </SkillBadge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Improvement Suggestions */}
                  {result.suggestions.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-zinc-300 mb-3">Improvement Suggestions</h4>
                      <div className="space-y-3">
                        {result.suggestions.map((suggestion, i) => (
                          <div
                            key={i}
                            className="flex items-start justify-between gap-4 p-4 rounded-xl bg-white/5 border border-white/5"
                          >
                            <div className="flex gap-3">
                              <span className="text-[#6C63FF] font-medium">{i + 1}.</span>
                              <p className="text-sm text-zinc-300">{suggestion}</p>
                            </div>
                            <button
                              onClick={() => handleCopy(suggestion, i)}
                              className="shrink-0 p-2 rounded-lg hover:bg-white/5 transition-colors"
                            >
                              {copiedIndex === i ? (
                                <Check className="w-4 h-4 text-emerald-400" />
                              ) : (
                                <Copy className="w-4 h-4 text-zinc-500" />
                              )}
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Interview Tips */}
                  {result.interview_tips.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-zinc-300 mb-3">Interview Tips</h4>
                      <Accordion type="single" collapsible className="space-y-2">
                        {result.interview_tips.map((section, i) => (
                          <AccordionItem
                            key={i}
                            value={`item-${i}`}
                            className="border border-white/5 rounded-xl bg-white/5 px-4"
                          >
                            <AccordionTrigger className="text-sm text-zinc-300 hover:text-white hover:no-underline py-4">
                              {section.category}
                            </AccordionTrigger>
                            <AccordionContent className="pb-4">
                              <ul className="space-y-2">
                                {section.tips.map((tip, j) => (
                                  <li key={j} className="flex items-start gap-2 text-sm text-zinc-400">
                                    <span className="text-[#00D4AA]">&bull;</span>
                                    {tip}
                                  </li>
                                ))}
                              </ul>
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Toast */}
      <Toast
        message={toastMessage}
        title={toastTitle}
        isVisible={toastVisible}
        onClose={() => setToastVisible(false)}
        type={toastType}
      />
    </div>
  )
}
