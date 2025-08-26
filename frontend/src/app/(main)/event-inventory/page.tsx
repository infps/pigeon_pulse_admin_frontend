"use client";
import { EventInventoryColumns } from "@/components/columns";
import { DataTable } from "@/components/data-table";
import EventInventoryDialog from "@/components/EventInventoryDialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDebounce } from "@/hooks/useDebounce";
import { getEventInventory } from "@/lib/api/eventInventory";
import { useListEvents } from "@/lib/api/events";
import { useGetBreeders } from "@/lib/api/user";
import { Breeders, Event, EventInventory } from "@/lib/types";
import { useQueryState } from "nuqs";

export default function EventInventoryPage() {
  const [eventId, setEventId] = useQueryState("eventId", {
    defaultValue: "",
  });
  const { data, error, isError, isPending } = useListEvents();
  if (isPending) {
    return <div>Loading...</div>;
  }
  if (isError) {
    return <div>Error: {error.message}</div>;
  }
  if (!data || data.length === 0) {
    return <div>No events found.</div>;
  }
  const events: Event[] = data.data.events || [];
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Event Inventory</h2>
      <div className="flex items-center justify-between gap-2">
        <EventSelect events={events} />
        {eventId && <BreederSearch />}
      </div>
      {eventId ? (
        <div className="mt-4">
          <EventInventoryTable />
        </div>
      ) : (
        <div className="mt-4">
          <p className="text-gray-500">
            Select an event to view its inventory.
          </p>
        </div>
      )}
    </div>
  );
}

function BreederSearch() {
  const [q, setQ] = useQueryState("q", {
    defaultValue: "",
  });
  return (
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
  );
}

function EventSelect({ events }: { events: Event[] }) {
  const [eventId, setEventId] = useQueryState("eventId", {
    defaultValue: "",
  });
  return (
    <div>
      <Label htmlFor="event-select">Select an Event</Label>
      <Select
        onValueChange={(e) => {
          if (e === "all") {
            setEventId("");
          } else {
            setEventId(e);
          }
        }}
        value={eventId}
      >
        <SelectTrigger className="w-[300px] mt-2" id="event-select">
          <SelectValue placeholder="Select an event" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all" onClick={() => setEventId("")}>
            All Events
          </SelectItem>
          {events.map((event) => (
            <SelectItem
              key={event.id}
              value={event.id}
              onClick={() => setEventId(event.id)}
            >
              {event.name} ({event.shortName})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

function EventInventoryTable() {
  const [q, setQ] = useQueryState("q");
  const [eventId, setEventId] = useQueryState("eventId", {
    defaultValue: "",
  });
  const debouncedSearchTerm = useDebounce(q, 300);
  const { data, error, isError, isPending } = getEventInventory(eventId, {
    ...(debouncedSearchTerm ? { q: debouncedSearchTerm } : {}),
  });
  console.log(data);
  if (isPending) {
    return (
      <div className="flex h-96 w-full items-center justify-between">
        Loading...
      </div>
    );
  }
  if (isError) {
    return (
      <div className="flex h-96 w-full items-center justify-between">
        Error: {error.message}
      </div>
    );
  }
  const inventory: EventInventory[] = data?.data || [];

  return <DataTable columns={EventInventoryColumns} data={inventory} />;
}
