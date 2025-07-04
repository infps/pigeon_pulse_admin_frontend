"use client";

import {
  UserPayments,
  UserPaymentsColumns,
  UserWins,
  UserWinsColumns,
} from "@/components/columns";
import { DataTable } from "@/components/data-table";
import { getPayments, getWins } from "@/lib/api/user";
import { useDebounce } from "@/lib/hooks/use-debounce";
import { useQueryState } from "nuqs";
import Pagination from "@/components/Pagination";

export default function UserPaymentsComponent({ userId }: { userId: string }) {
  const [searchTerm, setSearchTerm] = useQueryState("search", {
    defaultValue: "",
  });
  const [page] = useQueryState("page", {
    defaultValue: "1",
    parse: (value) => value || "1",
    serialize: (value) => value,
  });
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const { data, isError, isPending, isSuccess, error } = getPayments({
    params: {
      ...(debouncedSearchTerm ? { search: debouncedSearchTerm } : {}),
      page,
    },
    userId,
  });
  const userPayments: UserPayments[] = data?.data || [];
  const pagination = data?.pagination;

  if (isPending && !data) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">User Payments</h2>
        <input
          type="text"
          placeholder="Search payments..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border rounded-lg px-3 py-2"
        />
      </div>
      <DataTable columns={UserPaymentsColumns} data={userPayments} />
      {pagination && <Pagination pagination={pagination} />}
    </div>
  );
}
