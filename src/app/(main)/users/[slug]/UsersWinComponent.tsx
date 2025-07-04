"use client";

import {
  UserWins,
  UserWinsColumns,
} from "@/components/columns";
import { DataTable } from "@/components/data-table";
import { getWins } from "@/lib/api/user";

export default function UserWinComponent({ userId }: { userId: string }) {
  const { data, isError, isPending, isSuccess, error } = getWins(userId);
  const userWins: UserWins[] = data?.data;

  if (isPending) {
    return <div>Loading...</div>;
  }

  return <DataTable columns={UserWinsColumns} data={userWins} />;
}
