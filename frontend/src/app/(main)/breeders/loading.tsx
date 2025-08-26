import { PageHeaderSkeleton, TableSkeleton } from "@/components/loading-skeletons";

export default function Loading() {
  return (
    <div className="p-4">
      <PageHeaderSkeleton />
      <TableSkeleton rows={8} columns={5} />
    </div>
  );
}
