"use client";

import RaceUpdateForm from "@/components/RaceUpdateForm";
import { getSingleRace } from "@/lib/api/races";
import { use } from "react";

export default function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const { data, error, isError, isPending } = getSingleRace(slug);
  if (isPending) {
    return <div>Loading...</div>;
  }
  if (isError && error) {
    return <div>Error: {error.message}</div>;
  }
  if (!data || !data.data) {
    return <div>No data found for this race </div>;
  }
  return <RaceUpdateForm initalData={data?.data} raceId={slug} />;
}
