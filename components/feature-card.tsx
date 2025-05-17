import type React from "react"
import { cn } from "@/lib/utils"

interface FeatureCardProps {
  icon: React.ReactNode
  title: string
  description: string
  className?: string
  delay?: number
}

export function FeatureCard({ icon, title, description, className, delay = 0 }: FeatureCardProps) {
  const animationStyle = delay ? { animationDelay: `${delay}s` } : {}

  return (
    <div
      className={cn(
        "p-6 rounded-xl border bg-white shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 card-hover",
        className,
      )}
      style={animationStyle}
    >
      <div className="h-12 w-12 rounded-full bg-gradient-to-br from-saheli-pinkLight to-saheli-pink/20 flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  )
}

