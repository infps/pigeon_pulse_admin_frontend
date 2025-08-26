"use client";
import { SearchSkeleton, PageHeaderSkeleton } from "@/components/loading-skeletons";
import BreedersTable, { BreederSearch } from "./client";
import { Suspense } from "react";

export default function page() {
  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Breeders Address Book</h1>
        <Suspense fallback={<SearchSkeleton />}>
          <BreederSearch />
        </Suspense>
      </div>
      <BreedersTable />
    </div>
  );
}
