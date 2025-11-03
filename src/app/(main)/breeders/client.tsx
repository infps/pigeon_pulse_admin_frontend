"use client";

import { BreederAddressBookColumns, EventColumns } from "@/components/columns";
import { DataTable } from "@/components/data-table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TableSkeleton } from "@/components/loading-skeletons";
import { useDebounce } from "@/hooks/useDebounce";
import { useGetBreederAddressBook } from "@/lib/api/user";
import { useListEvents } from "@/lib/api/events";
import { BreederAddressBook, Event } from "@/lib/types";
import { useQueryState } from "nuqs";

export default function BreedersTable() {
  const [q, setQ] = useQueryState("q", {
    defaultValue: "",
  });
  const [eventId, setEventId] = useQueryState("eventId", {
    defaultValue: "",
  });
  const [status, setStatus] = useQueryState("status", {
    defaultValue: "",
  });
  const debouncedSearchTerm = useDebounce(q, 300);
  const { data, error, isError, isPending, isSuccess } =
    useGetBreederAddressBook({
      ...(debouncedSearchTerm ? { q: debouncedSearchTerm } : {}),
      ...(eventId ? { eventId } : {}),
      ...(status ? { status } : {}),
    });
  
  if (isPending) {
    return <TableSkeleton rows={8} columns={5} />;
  }
  
  if (isError) {
    return (
      <div className="flex h-96 w-full items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-destructive mb-2">Failed to load breeders</p>
          <p className="text-sm text-muted-foreground">{error.message}</p>
        </div>
      </div>
    );
  }
  
  const breeders: BreederAddressBook[] = data?.data || [];

  return <DataTable columns={BreederAddressBookColumns} data={breeders} />;
}

export function BreederSearch() {
  const [q, setQ] = useQueryState("q", {
    defaultValue: "",
  });
  const [eventId, setEventId] = useQueryState("eventId", {
    defaultValue: "",
  });
  const [status, setStatus] = useQueryState("status", {
    defaultValue: "",
  });

  const { data: eventsData, isPending: isLoadingEvents } = useListEvents({});
  const events: Event[] = eventsData?.data?.events || [];

  return (
    <div className="flex gap-4 items-end">
      <div>
        <Label htmlFor="breeder-search">Search Breeders</Label>
        <Input
          type="text"
          placeholder="Search users..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="border rounded-lg px-3 py-2 w-[300px] mt-2"
        />
      </div>
      
      <div>
        <Label htmlFor="event-filter">Filter by Event</Label>
        <Select
          value={eventId}
          onValueChange={(value) => setEventId(value === "all" ? "" : value)}
        >
          <SelectTrigger className="w-[250px] mt-2">
            <SelectValue placeholder="All Events" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Events</SelectItem>
            {isLoadingEvents ? (
              <SelectItem value="loading" disabled>
                Loading...
              </SelectItem>
            ) : (
              events.map((event) => (
                <SelectItem key={event.id} value={event.id}>
                  {event.name}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="status-filter">Filter by Status</Label>
        <Select
          value={status}
          onValueChange={(value) => setStatus(value === "all" ? "" : value)}
        >
          <SelectTrigger className="w-[200px] mt-2">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="ACTIVE">Active</SelectItem>
            <SelectItem value="INACTIVE">Inactive</SelectItem>
            <SelectItem value="PROSPECT">Prospect</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
