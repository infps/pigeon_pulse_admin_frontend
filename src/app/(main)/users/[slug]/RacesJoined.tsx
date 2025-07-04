"use client";

import { RacesJoined, RacesJoinedColumns } from "@/components/columns";
import { DataTable } from "@/components/data-table";
import { getRacesJoined } from "@/lib/api/user";
import { useDebounce } from "@/lib/hooks/use-debounce";
import { useQueryState } from "nuqs";
import Pagination from "@/components/Pagination";

export default function RacesJoinedComponent({ userId }: { userId: string }) {
  const [searchTerm, setSearchTerm] = useQueryState("search", {
    defaultValue: "",
  });
  const [page] = useQueryState("page", {
    defaultValue: "1",
    parse: (value) => value || "1",
    serialize: (value) => value,
  });
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const { data, isError, isPending, isSuccess, error } = getRacesJoined({
    params: {
      ...(debouncedSearchTerm ? { search: debouncedSearchTerm } : {}),
      page,
    },
    userId,
  });
  const racesJoined: RacesJoined[] = data?.data || [];
  const pagination = data?.pagination;

  if (isPending && !data) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Races Joined</h2>
        <input
          type="text"
          placeholder="Search races joined..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border rounded-lg px-3 py-2"
        />
      </div>
      <DataTable columns={RacesJoinedColumns} data={racesJoined} />
      {pagination && <Pagination pagination={pagination} />}
    </div>
  );
}
