"use client";
import { RaceStats, RaceStatsEntries } from "@/components/columns";
import { listRaceStats } from "@/lib/api/race-stats";
import React from "react";
import RaceStatsComponent from "./RaceStats";
import Link from "next/link";
import { useDebounce } from "@/lib/hooks/use-debounce";
import { useQueryState } from "nuqs";
import Pagination from "@/components/Pagination";

export default function page() {
  const [searchTerm, setSearchTerm] = useQueryState("search", {
    defaultValue: "",
  });
  const [page] = useQueryState("page", {
    defaultValue: "1",
    parse: (value) => value || "1",
    serialize: (value) => value,
  });
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const { data, isError, error, isPending } = listRaceStats({
    params: {
      ...(debouncedSearchTerm ? { search: debouncedSearchTerm } : {}),
      page,
    },
  });
  const raceStats: RaceStats[] = data?.data || [];
  const pagination = data?.pagination;
  if (isPending && !data) {
    return <div>Loading...</div>;
  }
  if (isError && error instanceof Error) {
    return <div>Error: {error.message}</div>;
  }
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Race Statistics</h1>
        <input
          type="text"
          placeholder="Search race statistics..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border rounded-lg px-3 py-2"
        />
      </div>
      <div>
        {raceStats.map((raceStat) => (
          <div key={raceStat.id}>
            <RaceStatsComponent
              raceId={raceStat.id}
              raceName={raceStat.name}
              raceStats={raceStat.entries}
            />
            <Link href={`/race-statistics/${raceStat.id}`}>
              <p className="text-end mt-4 mb-8 underline text-primary">
                View all
              </p>
            </Link>
          </div>
        ))}
      </div>
      {pagination && <Pagination pagination={pagination} />}
    </div>
  );
}
