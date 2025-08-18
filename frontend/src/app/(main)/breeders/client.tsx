"use client";

import { BreederAddressBookColumns, EventColumns } from "@/components/columns";
import { DataTable } from "@/components/data-table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDebounce } from "@/hooks/useDebounce";
import { useGetBreederAddressBook } from "@/lib/api/user";
import { BreederAddressBook, Event } from "@/lib/types";
import { useQueryState } from "nuqs";

export default function BreedersTable() {
  const [q, setQ] = useQueryState("q", {
    defaultValue: "",
  });
  const debouncedSearchTerm = useDebounce(q, 300);
  const { data, error, isError, isPending, isSuccess } =
    useGetBreederAddressBook({
      ...(debouncedSearchTerm ? { q: debouncedSearchTerm } : {}),
    });
  if (isPending)
    return (
      <div className="flex h-96 w-full items-center justify-between">
        Loading...
      </div>
    );
  if (isError)
    return (
      <div className="flex h-96 w-full items-center justify-between">
        Error: {error.message}
      </div>
    );
  const breeders: BreederAddressBook[] = data?.data || [];

  return <DataTable columns={BreederAddressBookColumns} data={breeders} />;
}

export function BreederSearch() {
  const [q, setQ] = useQueryState("q", {
    defaultValue: "",
  });
  return (
    <div>
      <Label htmlFor="breeder-search">Search Breeders</Label>
      <Input
        type="text"
        placeholder="Search users..."
        value={q}
        onChange={(e) => setQ(e.target.value)}
        className="border rounded-lg px-3 py-2 w-[300px] mt-2"
      />
    </div>
  );
}
