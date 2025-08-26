"use client";

import { EventColumns } from "@/components/columns";
import { DataTable } from "@/components/data-table";
import { TableSkeleton } from "@/components/loading-skeletons";
import { useListEvents } from "@/lib/api/events";
import { Event } from "@/lib/types";

export default function EventTable() {
  const { data, error, isError, isPending, isSuccess } = useListEvents();
  
  if (isPending) {
    return <TableSkeleton rows={6} columns={4} />;
  }
  
  if (isError) {
    return (
      <div className="flex h-96 w-full items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-destructive mb-2">Failed to load events</p>
          <p className="text-sm text-muted-foreground">{error.message}</p>
        </div>
      </div>
    );
  }
  
  const events: Event[] = data?.data?.events || [];

  return <DataTable columns={EventColumns} data={events} />;
}
