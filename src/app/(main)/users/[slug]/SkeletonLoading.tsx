import { Skeleton } from "@/components/ui/skeleton";

export default function SkeletonLoading() {
  return (
    <div>
      {/* Stats Grid Skeleton */}
      <div className="grid grid-cols-4">
        <div className="w-full col-span-1 h-32 flex justify-between p-4 border-r-2">
          <div className="space-y-2">
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-4 w-20" />
          </div>
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
        <div className="w-full col-span-1 h-32 flex justify-between p-4 border-r-2">
          <div className="space-y-2">
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-4 w-24" />
          </div>
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
        <div className="w-full col-span-1 h-32 flex justify-between p-4 border-r-2">
          <div className="space-y-2">
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-4 w-20" />
          </div>
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
        <div className="w-full col-span-1 h-32 flex justify-between p-4">
          <div className="space-y-2">
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-4 w-24" />
          </div>
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
      </div>

      {/* Personal Information Section Skeleton */}
      <div className="rounded-lg p-4 border mt-2">
        <Skeleton className="h-6 w-48 mb-4" />
        <div className="flex items-center gap-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-10 w-48" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-10 w-64" />
          </div>
        </div>
      </div>

      {/* User Control Section Skeleton */}
      <div className="rounded-lg p-4 border mt-2">
        <Skeleton className="h-6 w-32 mb-4" />
        
        {/* Radio Group Skeleton */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Skeleton className="h-4 w-4 rounded-full" />
            <Skeleton className="h-4 w-8" />
          </div>
          <div className="flex items-center space-x-2">
            <Skeleton className="h-4 w-4 rounded-full" />
            <Skeleton className="h-4 w-12" />
          </div>
        </div>

        {/* Ban Reason Input Skeleton (conditionally shown) */}
        <div className="mt-4 space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full" />
        </div>

        {/* Update Button Skeleton */}
        <div className="mt-4">
          <Skeleton className="h-10 w-40" />
        </div>
      </div>
    </div>
  );
}
