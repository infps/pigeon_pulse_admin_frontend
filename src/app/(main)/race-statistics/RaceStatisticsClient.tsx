"use client";

import { RaceStats } from "@/components/columns";
import { listRaceStats } from "@/lib/api/race-stats";
import React from "react";
import RaceStatsComponent from "./RaceStats";
import Link from "next/link";
import { useDebounce } from "@/lib/hooks/use-debounce";
import { useQueryState } from "nuqs";
import Pagination from "@/components/Pagination";

export default function RaceStatisticsClient() {
  const [searchTerm] = useQueryState("search", {
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

  if( raceStats.length === 0 ) {
    return <div className="text-center text-gray-500 mt-8">No race statistics found.</div>;
  }

  return (
    <>
      <div>
        {raceStats.map((raceStat) => (
          <div key={raceStat.id}>
            <h2 className="text-xl font-bold text-primary mb-4">
              {raceStat.name}
            </h2>
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
    </>
  );
}
