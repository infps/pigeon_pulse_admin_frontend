"use client";

import { Bird, BirdColumns } from "@/components/columns";
import { DataTable } from "@/components/data-table";
import { getBirdsbyUserId } from "@/lib/api/user";

export default function Birds({ userId }: { userId: string }) {
  const { data, isError, isPending, isSuccess, error } =
    getBirdsbyUserId({
      params: {},
      userId,
    });
  const birds: Bird[] = data?.data;

  if (isPending) {
    return <div>Loading...</div>;
  }

  return <DataTable columns={BirdColumns} data={birds} />;
}
