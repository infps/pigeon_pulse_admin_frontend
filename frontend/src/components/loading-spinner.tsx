import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg"
  className?: string
  text?: string
}

export function LoadingSpinner({ size = "md", className, text }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6", 
    lg: "h-8 w-8"
  }

  return (
    <div className={cn("flex items-center justify-center space-x-2", className)}>
      <Loader2 className={cn("animate-spin", sizeClasses[size])} />
      {text && <span className="text-sm text-muted-foreground">{text}</span>}
    </div>
  )
}

interface PageLoadingProps {
  text?: string
  className?: string
}

export function PageLoading({ text = "Loading...", className }: PageLoadingProps) {
  return (
    <div className={cn("flex h-96 w-full items-center justify-center", className)}>
      <LoadingSpinner size="lg" text={text} />
    </div>
  )
}

export function InlineLoading({ text = "Loading...", className }: PageLoadingProps) {
  return (
    <div className={cn("flex items-center justify-center p-4", className)}>
      <LoadingSpinner text={text} />
    </div>
  )
}

export function ButtonLoading({ text = "Loading...", className }: PageLoadingProps) {
  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <Loader2 className="h-4 w-4 animate-spin" />
      <span>{text}</span>
    </div>
  )
}
