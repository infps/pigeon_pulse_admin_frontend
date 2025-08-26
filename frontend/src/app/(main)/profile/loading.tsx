import { FormSkeleton } from "@/components/loading-skeletons";

export default function Loading() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <FormSkeleton />
    </div>
  );
}
