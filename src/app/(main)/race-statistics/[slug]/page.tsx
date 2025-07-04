"use client";
import { getRaceStats } from "@/lib/api/race-stats";
import React, { use } from "react";
import RaceStatsComponent from "../RaceStats";
import { RaceStats } from "@/components/columns";

export default function page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const { data, isError, error, isPending } = getRaceStats(slug);
  const raceStats: RaceStats = data?.data;
  if (isPending) {
    return <div>Loading...</div>;
  }
  if (isError && error instanceof Error) {
    return <div>Error: {error.message}</div>;
  }
  return (
    <RaceStatsComponent
      raceId={raceStats?.id}
      raceName={raceStats?.name}
      raceStats={raceStats?.entries}
    />
  );
}
