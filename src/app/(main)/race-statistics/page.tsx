"use client";
import { RaceStats, RaceStatsEntries } from "@/components/columns";
import { listRaceStats } from "@/lib/api/race-stats";
import React from "react";
import RaceStatsComponent from "./RaceStats";
import Link from "next/link";

export default function page() {
  const { data, isError, error, isPending } = listRaceStats({
    params: {},
  });
  const raceStats: RaceStats[] = data?.data || [];
  if (isPending) {
    return <div>Loading...</div>;
  }
  if (isError && error instanceof Error) {
    return <div>Error: {error.message}</div>;
  }
  return (
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
  );
}
