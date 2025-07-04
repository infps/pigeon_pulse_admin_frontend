"use client";

import { RacesJoined, RacesJoinedColumns } from "@/components/columns";
import { DataTable } from "@/components/data-table";
import { getRacesJoined } from "@/lib/api/user";

export default function RacesJoinedComponent({ userId }: { userId: string }) {
  const { data, isError, isPending, isSuccess, error } = getRacesJoined(userId);
  const racesJoined: RacesJoined[] = data?.data;

  if (isPending) {
    return <div>Loading...</div>;
  }

  return <DataTable columns={RacesJoinedColumns} data={racesJoined} />;
}
