"use client";
import {
  UserColumns,
  User,
  Races,
  RacesColumns,
  Payments,
  PaymentsColumns,
} from "@/components/columns";
import { DataTable } from "@/components/data-table";
import { listPayments } from "@/lib/api/payments";

export default function page() {
  const { data, isError, isPending, isSuccess, error } = listPayments();
  const payments: Payments[] = data?.data;
  if (isPending) {
    return <div>Loading...</div>;
  }

  return <DataTable columns={PaymentsColumns} data={payments} />;
}
