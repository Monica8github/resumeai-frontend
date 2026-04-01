import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function saveAnalysis(data: {
  user_id: string
  user_email: string
  job_description: string
  score: number
  ats_score: number
  keyword_score: number
  role_fit: number
  result: object
}) {
  try {
    await sql`
      INSERT INTO analyses (
        user_id, user_email, job_description,
        score, ats_score, keyword_score, role_fit,
        result, created_at
      ) VALUES (
        ${data.user_id},
        ${data.user_email},
        ${data.job_description},
        ${data.score},
        ${data.ats_score},
        ${data.keyword_score},
        ${data.role_fit},
        ${JSON.stringify(data.result)},
        NOW()
      )
    `
    console.log("Saved to Neon!")
  } catch (err) {
    console.error("Neon save error:", err)
  }
}
