"use client";
import { UserColumns, User } from "@/components/columns";
import { DataTable } from "@/components/data-table";
import { listUsers } from "@/lib/api/user";

export default function Dashboard() {
  const { data, isError, isPending, isSuccess, error } = listUsers({
    params: {},
  });
  const users: User[] = data?.data;
  if (isPending) {
    return <div>Loading...</div>;
  }

  return <DataTable columns={UserColumns} data={users} />;
}
