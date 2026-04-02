export interface AnalysisResult {
  score: number
  ats_score: number
  keyword_score: number
  role_fit: number
  match_label: "Excellent Match" | "Good Match" | "Fair Match" | "Poor Match"
  strengths: string[]
  missing_skills: string[]
  suggestions: string[]
  interview_tips: { category: string; tips: string[] }[]
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

export async function analyzeResume(
  file: File,
  jobDescription: string
): Promise<AnalysisResult> {
  const formData = new FormData()
  formData.append("file", file)
  formData.append("job_description", jobDescription)
  const res = await fetch(`${BASE_URL}/analyze`, {
    method: "POST",
    body: formData,
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Unknown error" }))
    throw new Error(err.detail || "Analysis failed")
  }
  return res.json()
}
