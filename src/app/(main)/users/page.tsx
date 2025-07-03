"use client"
import { columns, User } from "@/components/columns";
import { DataTable } from "@/components/data-table";
import { listUsers } from "@/lib/api/user";

export default function Dashboard() {
  const { data, isError, isPending, isSuccess, error } = listUsers();
  const users: User[] = data?.data;
  console.log(users);
  if (isPending) {
    return <div>Loading...</div>;
  }

  return <DataTable columns={columns} data={users} />;
}
