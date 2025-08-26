import { PageHeaderSkeleton, TableSkeleton } from "@/components/loading-skeletons";

export default function Loading() {
  return (
    <div className="p-4">
      <PageHeaderSkeleton />
      <TableSkeleton rows={6} columns={4} />
    </div>
  );
}
