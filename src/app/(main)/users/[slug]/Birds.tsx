"use client";

import { Bird, BirdColumns } from "@/components/columns";
import { DataTable } from "@/components/data-table";
import { getBirdsbyUserId } from "@/lib/api/user";
import { useDebounce } from "@/lib/hooks/use-debounce";
import { useQueryState } from "nuqs";
import Pagination from "@/components/Pagination";

export default function Birds({ userId }: { userId: string }) {
  const [searchTerm, setSearchTerm] = useQueryState("search", {
    defaultValue: "",
  });
  const [page] = useQueryState("page", {
    defaultValue: "1",
    parse: (value) => value || "1",
    serialize: (value) => value,
  });
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const { data,  isPending, } =
    getBirdsbyUserId({
      params: {
        ...(debouncedSearchTerm ? { search: debouncedSearchTerm } : {}),
        page,
      },
      userId,
    });
  const birds: Bird[] = data?.data || [];
  const pagination = data?.pagination;

  if (isPending && !data) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Birds</h2>
        <input
          type="text"
          placeholder="Search birds..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border rounded-lg px-3 py-2"
        />
      </div>
      <DataTable columns={BirdColumns} data={birds} />
      {pagination && <Pagination pagination={pagination} />}
    </div>
  );
}
