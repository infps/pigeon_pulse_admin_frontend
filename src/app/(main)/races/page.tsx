"use client";
import { UserColumns, User, Races, RacesColumns } from "@/components/columns";
import { DataTable } from "@/components/data-table";
import { listRaces } from "@/lib/api/races";
import { useDebounce } from "@/lib/hooks/use-debounce";
import { useQueryState } from "nuqs";
import Pagination from "@/components/Pagination";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function page() {
  const [searchTerm, setSearchTerm] = useQueryState("search", {
    defaultValue: "",
  });
  const [page] = useQueryState("page", {
    defaultValue: "1",
    parse: (value) => value || "1",
    serialize: (value) => value,
  });
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const { data, isError, isPending, isSuccess, error } = listRaces({
    params: {
      ...(debouncedSearchTerm ? { search: debouncedSearchTerm } : {}),
      page,
    },
  });
  const races: Races[] = data?.data || [];
  const pagination = data?.pagination;
  if (isPending && !data) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Races</h1>
        <div className="flex items-center space-x-2">
          <Button asChild>
            <Link href={"/races/create"}>Create Race</Link>
          </Button>
          <input
            type="text"
            placeholder="Search races..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border rounded-lg px-3 py-2"
          />
        </div>
      </div>
      <DataTable columns={RacesColumns} data={races} />
      {pagination && <Pagination pagination={pagination} />}
    </div>
  );
}
