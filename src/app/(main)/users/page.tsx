"use client";
import { UserColumns, User } from "@/components/columns";
import { DataTable } from "@/components/data-table";
import { listUsers } from "@/lib/api/user";
import { useDebounce } from "@/lib/hooks/use-debounce";
import { useQueryState } from "nuqs";
import Pagination from "@/components/Pagination";

export default function Page() {
  const [searchTerm, setSearchTerm] = useQueryState("search", {
    defaultValue: "",
  });
  const [page] = useQueryState("page", {
    defaultValue: "1",
    parse: (value) => value || "1",
    serialize: (value) => value,
  });
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const { data, isError, isPending, isSuccess, error } = listUsers({
    params: {
      ...(debouncedSearchTerm ? { search: debouncedSearchTerm } : {}),
      page,
    },
  });
  const users: User[] = data?.data || [];
  const pagination = data?.pagination;
  if (isPending && !data) {
    return <div>Loading...</div>;
  }
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Users</h1>
        <input
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border rounded-lg px-3 py-2"
        />
      </div>
      <DataTable columns={UserColumns} data={users} />
      {pagination && <Pagination pagination={pagination} />}
    </div>
  );
}
