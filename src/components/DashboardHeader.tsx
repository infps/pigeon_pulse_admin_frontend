"use client";
import { listDashboardData } from "@/lib/api/dashboard";
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

export default function DashboardHeader() {
  const { data, isError, isPending, isSuccess, error } = listDashboardData({
    params: {},
  });
  const dashboardData = data?.data;

  if (isPending) {
    return (
      <div className="grid grid-cols-5 gap-10">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="p-4 rounded-sm shadow-lg h-24 flex flex-col justify-between"
          >
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-8 w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-5 gap-10">
      <Link href={"/users"}>
        <div className="p-4 rounded-sm shadow-lg h-24 flex flex-col justify-between">
          <h2 className="text font-semibold text-muted-foreground">
            Total Loft Owner
          </h2>
          <p className="text-2xl font-bold">{dashboardData?.totalLoftOwners}</p>
        </div>
      </Link>
      <Link href={"/users"}>
        <div className="p-4 rounded-sm shadow-lg h-24 flex flex-col justify-between">
          <h2 className="text font-semibold text-muted-foreground">
            Total Birds
          </h2>
          <p className="text-2xl font-bold">{dashboardData?.totalBirds}</p>
        </div>
      </Link>
      <Link href={"/races"}>
        <div className="p-4 rounded-sm shadow-lg h-24 flex flex-col justify-between">
          <h2 className="text font-semibold text-muted-foreground">
            Total Race
          </h2>
          <p className="text-2xl font-bold">{dashboardData?.totalRaces}</p>
        </div>
      </Link>
      <Link href={"/races?status=upcoming"}>
        <div className="p-4 rounded-sm shadow-lg h-24 flex flex-col justify-between">
          <h2 className="text font-semibold text-muted-foreground">
            Upcoming Race
          </h2>
          <p className="text-2xl font-bold">{dashboardData?.upcomingRaces}</p>
        </div>
      </Link>
      <Link href={"/payments"}>
        <div className="p-4 rounded-sm shadow-lg h-24 flex flex-col justify-between">
          <h2 className="text font-semibold text-muted-foreground">
            Total Payment
          </h2>
          <p className="text-2xl font-bold">{dashboardData?.totalPayments}</p>
        </div>
      </Link>
    </div>
  );
}
