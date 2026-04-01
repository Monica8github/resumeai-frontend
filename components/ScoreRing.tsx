"use client"

import { useEffect, useState } from "react"

interface ScoreRingProps {
  score: number
  size?: number
  strokeWidth?: number
}

export function ScoreRing({ score, size = 160, strokeWidth = 12 }: ScoreRingProps) {
  const [offset, setOffset] = useState(440)
  
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const targetOffset = circumference - (score / 100) * circumference
  
  // Determine color based on score
  const getColor = () => {
    if (score >= 75) return "#00D4AA" // teal/green
    if (score >= 50) return "#F59E0B" // amber
    return "#EF4444" // red
  }
  
  useEffect(() => {
    // Animate on mount
    const timer = setTimeout(() => {
      setOffset(targetOffset)
    }, 100)
    return () => clearTimeout(timer)
  }, [targetOffset])
  
  return (
    <div className="relative inline-flex items-center justify-center">
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke="rgba(255, 255, 255, 0.1)"
          strokeWidth={strokeWidth}
        />
        {/* Animated progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke={getColor()}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{
            transition: "stroke-dashoffset 1.5s ease-out",
          }}
        />
      </svg>
      {/* Center text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span 
          className="font-[family-name:var(--font-sora)] text-4xl font-bold"
          style={{ color: getColor() }}
        >
          {score}
        </span>
        <span className="text-sm text-zinc-400">/ 100</span>
      </div>
    </div>
  )
}
