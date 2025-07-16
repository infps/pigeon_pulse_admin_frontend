"use client";

import { Payments, PaymentsColumns } from "@/components/columns";
import { DataTable } from "@/components/data-table";
import Pagination from "@/components/Pagination";
import { listPayments } from "@/lib/api/payments";
import { useDebounce } from "@/lib/hooks/use-debounce";
import { useQueryState } from "nuqs";

export default function PaymentsClient() {
  const [searchTerm] = useQueryState("search", {
    defaultValue: "",
  });
  const [page] = useQueryState("page", {
    defaultValue: "1",
    parse: (value) => value || "1",
    serialize: (value) => value,
  });
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const { data, isError, isPending, isSuccess, error } = listPayments({
    params: {
      ...(debouncedSearchTerm ? { search: debouncedSearchTerm } : {}),
      page,
    },
  });
  const payments: Payments[] = data?.data || [];
  const pagination = data?.pagination;
  
  if (isPending && !data) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <DataTable columns={PaymentsColumns} data={payments} />
      {pagination && <Pagination pagination={pagination} />}
    </>
  );
}
