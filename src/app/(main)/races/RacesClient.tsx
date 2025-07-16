"use client";

import { Races, RacesColumns } from "@/components/columns";
import { DataTable } from "@/components/data-table";
import Pagination from "@/components/Pagination";
import { listRaces } from "@/lib/api/races";
import { useDebounce } from "@/lib/hooks/use-debounce";
import { useQueryState } from "nuqs";

export default function RacesClient() {
  const [searchTerm] = useQueryState("search");
  const [status] = useQueryState("status");
  const [page] = useQueryState("page", {
    defaultValue: "1",
    parse: (value) => value || "1",
    serialize: (value) => value,
  });

  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const { data, isPending } = listRaces({
    params: {
      ...(debouncedSearchTerm ? { search: debouncedSearchTerm } : {}),
      ...(status && status !== "all" ? { status: status.toUpperCase() } : {}),
      page,
    },
  });
  const races: Races[] = data?.data || [];
  const pagination = data?.pagination;

  if (isPending && !data) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <DataTable columns={RacesColumns} data={races} />
      {pagination && <Pagination pagination={pagination} />}
    </>
  );
}
