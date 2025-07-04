"use client";
import { UserColumns, User, Races, RacesColumns } from "@/components/columns";
import { DataTable } from "@/components/data-table";
import { listRaces } from "@/lib/api/races";

export default function page() {
  const { data, isError, isPending, isSuccess, error } = listRaces({
    params: {},
  });
  const races: Races[] = data?.data;
  if (isPending) {
    return <div>Loading...</div>;
  }

  return <DataTable columns={RacesColumns} data={races} />;
}
