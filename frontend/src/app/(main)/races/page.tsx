"use client";
import { RaceColumns } from "@/components/columns";
import { CreateRaceDialog } from "@/components/CreateRaceDialog";
import { DataTable } from "@/components/data-table";
import { Label } from "@/components/ui/label";
import { SelectSkeleton, TableSkeleton } from "@/components/loading-skeletons";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useListEvents } from "@/lib/api/events";
import { useListRaces } from "@/lib/api/races";
import { Event, Race } from "@/lib/types";
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
        <div className="flex items-center justify-between gap-2">
          <SelectSkeleton />
          <div className="w-32 h-10 bg-muted animate-pulse rounded" />
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
        <div className="flex h-96 w-full items-center justify-center">
          <p className="text-lg text-muted-foreground">No events found.</p>
        </div>
      </div>
    );
  }
  
  const events: Event[] = data.data.events || [];
  return (
    <div className="p-4">
      <div className="flex items-center justify-between gap-2">
        <EventSelect events={events} />
        <CreateRaceDialog events={events} selectedEventId={eventId} />
      </div>
      <div className="mt-4">
        {eventId ? (
          <>
            <ListRacesTable />
          </>
        ) : (
          <h2 className="text-lg font-semibold">Select an Event</h2>
        )}
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

function ListRacesTable() {
  const [eventId, setEventId] = useQueryState("eventId", {
    defaultValue: "",
  });

  const { data, error, isError, isPending } = useListRaces(eventId);
  
  if (isPending) {
    return <TableSkeleton rows={6} columns={5} />;
  }
  
  if (isError) {
    return (
      <div className="flex h-96 w-full items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-destructive mb-2">Failed to load races</p>
          <p className="text-sm text-muted-foreground">{error.message}</p>
        </div>
      </div>
    );
  }
  if (isError) {
    return <div>Error: {error.message}</div>;
  }
  const races: Race[] = data?.data;

  return <DataTable columns={RaceColumns} data={races} />;
}
