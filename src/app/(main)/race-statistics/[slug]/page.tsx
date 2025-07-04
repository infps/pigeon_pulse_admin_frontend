"use client";
import { getRaceStats } from "@/lib/api/race-stats";
import React, { use } from "react";
import RaceStatsComponent from "../RaceStats";
import { RaceStats } from "@/components/columns";
import { useDebounce } from "@/lib/hooks/use-debounce";
import { useQueryState } from "nuqs";

export default function page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const [searchTerm, setSearchTerm] = useQueryState("search", {
    defaultValue: "",
  });
  const [page] = useQueryState("page", {
    defaultValue: "1",
    parse: (value) => value || "1",
    serialize: (value) => value,
  });
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const { data, isError, error, isPending } = getRaceStats({
    params: {
      ...(debouncedSearchTerm ? { search: debouncedSearchTerm } : {}),
      page,
    },
    raceId: slug,
  });
  const raceStats: RaceStats = data?.data;
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
        <h1 className="text-3xl font-bold text-primary">{raceStats?.name}</h1>
        <input
          type="text"
          placeholder="Search race entries..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border rounded-lg px-3 py-2"
        />
      </div>
      <RaceStatsComponent
        raceId={raceStats?.id}
        raceName={raceStats?.name}
        raceStats={raceStats?.entries}
        pagination={pagination}
      />
    </div>
  );
}
