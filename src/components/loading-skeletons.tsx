import { Skeleton } from "@/components/ui/skeleton"

export function TableSkeleton({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) {
  return (
    <div className="rounded-md border overflow-hidden">
      {/* Header */}
      <div className="bg-primary p-4">
        <div className="flex space-x-4">
          {Array.from({ length: columns }).map((_, i) => (
            <Skeleton key={i} className="h-4 flex-1 bg-primary-foreground/20" />
          ))}
        </div>
      </div>
      
      {/* Rows */}
      <div className="divide-y">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="p-4">
            <div className="flex space-x-4">
              {Array.from({ length: columns }).map((_, colIndex) => (
                <Skeleton key={colIndex} className="h-4 flex-1" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function CardSkeleton() {
  return (
    <div className="rounded-lg border p-6 space-y-4">
      <Skeleton className="h-6 w-3/4" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-4/6" />
      </div>
    </div>
  )
}

export function FormSkeleton() {
  return (
    <div className="space-y-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-10 w-full" />
        </div>
      ))}
      <div className="flex justify-end space-x-2">
        <Skeleton className="h-10 w-20" />
        <Skeleton className="h-10 w-20" />
      </div>
    </div>
  )
}

export function PageHeaderSkeleton() {
  return (
    <div className="flex items-center justify-between mb-4">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-10 w-32" />
    </div>
  )
}

export function SearchSkeleton() {
  return (
    <div className="space-y-2">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-10 w-[300px]" />
    </div>
  )
}

export function SelectSkeleton() {
  return (
    <div className="space-y-2">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-10 w-[300px]" />
    </div>
  )
}

export function ListItemSkeleton() {
  return (
    <div className="flex items-center space-x-4 p-4 border-b">
      <Skeleton className="h-8 w-8 rounded" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
      <Skeleton className="h-6 w-16" />
    </div>
  )
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <PageHeaderSkeleton />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    </div>
  )
}

export function DetailsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormSkeleton />
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <ListItemSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  )
}
