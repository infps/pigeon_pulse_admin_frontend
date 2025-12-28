"use client";
import { BirdEventInventoryColumns, getBirdEventInventoryColumns } from "@/components/columns";
import { DataTable } from "@/components/data-table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SelectSkeleton, TableSkeleton, SearchSkeleton } from "@/components/loading-skeletons";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDebounce } from "@/hooks/useDebounce";
import { useListBirds } from "@/lib/api/birds";
import { useListEvents } from "@/lib/api/events";
import { BirdEventInventory, Event, EventInventory, EventInventoryItemDetail } from "@/lib/types";
import { useQueryState } from "nuqs";
import React from "react";

export default function page() {
  const [eventId, setEventId] = useQueryState("eventId", {
    defaultValue: "",
  });
  const { data, error, isError, isPending } = useListEvents();
  
  if (isPending) {
    return (
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">Event Inventory</h2>
        <div className="flex items-center justify-between gap-2">
          <SelectSkeleton />
          <SearchSkeleton />
        </div>
        <div className="mt-4">
          <TableSkeleton rows={6} columns={4} />
        </div>
      </div>
    );
  }
  
  if (isError) {
    return (
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">Event Inventory</h2>
        <div className="flex h-96 w-full items-center justify-center">
          <div className="text-center">
            <p className="text-lg text-destructive mb-2">Failed to load events</p>
            <p className="text-sm text-muted-foreground">{error.message}</p>
          </div>
        </div>
      </div>
    );
  }
  
  if (!data || data.length === 0) {
    return (
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">Event Inventory</h2>
        <div className="flex h-96 w-full items-center justify-center">
          <p className="text-lg text-muted-foreground">No events found.</p>
        </div>
      </div>
    );
  }
  
  const events: Event[] = data.data.events || [];
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Event Inventory</h2>
      <div className="flex items-center justify-between gap-2">
        <EventSelect events={events} />
        {eventId && <BirdSearch />}
      </div>
      {eventId ? (
        <div className="mt-4">
          <BirdsTable />
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

function BirdSearch() {
  const [q, setQ] = useQueryState("q", {
    defaultValue: "",
  });
  const [searchField, setSearchField] = useQueryState("searchField", {
    defaultValue: "birdName",
  });
  
  return (
    <div className="flex items-end gap-2">
      <div>
        <Label htmlFor="search-field-select">Search By</Label>
        <Select
          onValueChange={(value) => setSearchField(value)}
          value={searchField}
        >
          <SelectTrigger className="w-[180px] mt-2" id="search-field-select">
            <SelectValue placeholder="Select field" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="birdName">Bird Name</SelectItem>
            <SelectItem value="band">Band</SelectItem>
            <SelectItem value="band1">Band 1</SelectItem>
            <SelectItem value="band2">Band 2</SelectItem>
            <SelectItem value="band3">Band 3</SelectItem>
            <SelectItem value="band4">Band 4</SelectItem>
            <SelectItem value="color">Color</SelectItem>
            <SelectItem value="rfId">RFID</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="bird-search">Search</Label>
        <Input
          id="bird-search"
          type="text"
          placeholder="Search birds..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="border rounded-lg px-3 py-2 w-[300px] mt-2"
        />
      </div>
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
              key={event.idEvent}
              value={String(event.idEvent)}
              onClick={() => setEventId(String(event.idEvent))}
            >
              {event.eventName} ({event.eventShortName})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

function BirdsTable() {
  const [q, setQ] = useQueryState("q");
  const [searchField, setSearchField] = useQueryState("searchField", {
    defaultValue: "birdName",
  });
  const [eventId, setEventId] = useQueryState("eventId", {
    defaultValue: "",
  });
  const debouncedSearchTerm = useDebounce(q, 300);
  const { data, error, isError, isPending } = useListBirds({
    id: parseInt(eventId),
    params: {
      ...(debouncedSearchTerm ? { q: debouncedSearchTerm } : {}),
      ...(searchField ? { searchField } : {}),
    },
  });
  
  if (isPending) {
    return <TableSkeleton rows={6} columns={4} />;
  }
  
  if (isError) {
    return (
      <div className="flex h-96 w-full items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-destructive mb-2">Failed to load birds</p>
          <p className="text-sm text-muted-foreground">{error.message}</p>
        </div>
      </div>
    );
  }
  
  console.log("data", data);
  const eventInventories: EventInventory[] = data?.data || [];
  console.log(eventInventories);
  
  // Flatten eventInventoryItems from all eventInventories
  const birdsInventory: EventInventoryItemDetail[] = eventInventories.flatMap(
    (inventory) => inventory.eventInventoryItems || []
  );

  // Get betting scheme from first event inventory (all should have same event)
  const bettingScheme = eventInventories[0]?.event?.bettingScheme;

  return (
    <DataTable columns={getBirdEventInventoryColumns(bettingScheme)} data={birdsInventory} />
  );
}
