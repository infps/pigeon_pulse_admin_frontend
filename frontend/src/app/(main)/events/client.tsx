"use client";

import { EventColumns } from "@/components/columns";
import { DataTable } from "@/components/data-table";
import { useListEvents } from "@/lib/api/events";
import { Event } from "@/lib/types";

export default function EventTable() {
  const { data, error, isError, isPending, isSuccess } = useListEvents();
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
  const events: Event[] = data?.data?.events || [];

  return <DataTable columns={EventColumns} data={events} />;
}
