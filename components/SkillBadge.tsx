interface SkillBadgeProps {
  children: React.ReactNode
  variant: "strength" | "missing"
}

export function SkillBadge({ children, variant }: SkillBadgeProps) {
  const styles = {
    strength: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    missing: "bg-red-500/10 text-red-400 border-red-500/20",
  }

  return (
    <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium border ${styles[variant]}`}>
      {children}
    </span>
  )
}
