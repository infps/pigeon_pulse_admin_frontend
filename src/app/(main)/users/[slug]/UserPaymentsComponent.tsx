"use client";

import {
  UserPayments,
  UserPaymentsColumns,
  UserWins,
  UserWinsColumns,
} from "@/components/columns";
import { DataTable } from "@/components/data-table";
import { getPayments, getWins } from "@/lib/api/user";

export default function UserPaymentsComponent({ userId }: { userId: string }) {
  const { data, isError, isPending, isSuccess, error } = getPayments({
    params: {},
    userId,
  });
  const userPayments: UserPayments[] = data?.data;

  if (isPending) {
    return <div>Loading...</div>;
  }

  return <DataTable columns={UserPaymentsColumns} data={userPayments} />;
}
