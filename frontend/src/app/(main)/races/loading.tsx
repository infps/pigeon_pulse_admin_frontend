import { SelectSkeleton, TableSkeleton } from "@/components/loading-skeletons";

export default function Loading() {
  return (
    <div className="p-4">
      <div className="flex items-center justify-between gap-2">
        <SelectSkeleton />
        <div className="w-32 h-10 bg-muted animate-pulse rounded" />
      </div>
      <div className="mt-4">
        <TableSkeleton rows={6} columns={5} />
      </div>
    </div>
  );
}
