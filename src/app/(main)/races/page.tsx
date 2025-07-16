"use client";
import { useQueryState } from "nuqs";
import RacesClient from "./RacesClient";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Page() {
  const [searchTerm, setSearchTerm] = useQueryState("search", {
    defaultValue: "",
  });
  const [status, setStatus] = useQueryState("status", {
    defaultValue: "all",
    parse: (value) => value || "all",
    serialize: (value) => value,
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Races</h1>
        <div className="flex items-center space-x-2">
          <Button asChild>
            <Link href={"/races/create"}>Create Race</Link>
          </Button>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="border rounded-lg px-3 py-2">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="upcoming">Upcoming</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
          <input
            type="text"
            placeholder="Search races..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border rounded-lg px-3 py-2"
          />
        </div>
      </div>
      <RacesClient />
    </div>
  );
}
