"use client";

import { User, UserColumns } from "@/components/columns";
import { DataTable } from "@/components/data-table";
import Pagination from "@/components/Pagination";
import { listUsers } from "@/lib/api/user";
import { useDebounce } from "@/lib/hooks/use-debounce";
import { useQueryState } from "nuqs";

export default function UsersClient() {
  const [searchTerm] = useQueryState("search", {
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
    <>
      <DataTable columns={UserColumns} data={users} />
      {pagination && <Pagination pagination={pagination} />}
    </>
  );
}
