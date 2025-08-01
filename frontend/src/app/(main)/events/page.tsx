import { Button } from "@/components/ui/button";
import EventTable from "./client";
import CreateEventButton from "@/components/CreateEventDialog";

export default function page() {
  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Events</h1>
        <CreateEventButton />
      </div>
      <EventTable />
    </div>
  );
}
