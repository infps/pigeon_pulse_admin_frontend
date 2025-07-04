"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { getUserSummary } from "@/lib/api/user";
import { use, useState, useEffect } from "react";
import Link from "next/link";
import { CircleArrowRight } from "lucide-react";
import { SkeletonLoading } from "./SkeletonLoading";
import PersonalInformation from "./PersonalInformation";
import Birds from "./Birds";
import RacesJoinedComponent from "./RacesJoined";
import UserWinComponent from "./UsersWinComponent";
import UserPaymentsComponent from "./UserPaymentsComponent";

export default function page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const { data, error, isError, isPending, isSuccess } = getUserSummary(slug);

  const [toShow, setToShow] = useState<
    "total_birds" | "races_joined" | "total_wins" | "paid_amount" | "personal"
  >("personal");

  if (isPending) {
    return <SkeletonLoading />;
  }

  if (isError && error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      <div className="grid grid-cols-4">
        <div
          onClick={() => setToShow("total_birds")}
          className="w-full col-span-1 h-32 flex justify-between cursor-pointer hover:bg-accent/10 p-4 border-r-2"
        >
          <div className={toShow === "total_birds" ? "text-accent" : ""}>
            <p className="text-3xl font-bold">{data?.data?.totalBirds}</p>
            <p className="text-sm">Total Birds</p>
          </div>
          <CircleArrowRight className="h-8 w-8 hover:stroke-primary" />
        </div>
        <div
          onClick={() => setToShow("races_joined")}
          className="w-full col-span-1 h-32 flex justify-between cursor-pointer hover:bg-accent/10 p-4 border-r-2"
        >
          <div className={toShow === "races_joined" ? "text-accent" : ""}>
            <p className="text-3xl font-bold">{data?.data?.racesJoined}</p>
            <p className="text-sm">Race Joined</p>
          </div>
          <CircleArrowRight className="h-8 w-8 hover:stroke-primary" />
        </div>
        <div
          onClick={() => setToShow("total_wins")}
          className="w-full col-span-1 h-32 flex justify-between cursor-pointer hover:bg-accent/10 p-4 border-r-2"
        >
          <div className={toShow === "total_wins" ? "text-accent" : ""}>
            <p className="text-3xl font-bold">{data?.data?.totalWins}</p>
            <p className="text-sm">Total Win</p>
          </div>
          <CircleArrowRight className="h-8 w-8 hover:stroke-primary" />
        </div>
        <div
          onClick={() => setToShow("paid_amount")}
          className="w-full col-span-1 h-32 flex justify-between cursor-pointer hover:bg-accent/10 p-4"
        >
          <div className={toShow === "paid_amount" ? "text-accent" : ""}>
            <p className="text-3xl font-bold">{data?.data?.paidAmount}</p>
            <p className="text-sm">Paid Amount</p>
          </div>
          <CircleArrowRight className="h-8 w-8 hover:stroke-primary" />
        </div>
      </div>
      {toShow === "personal" && <PersonalInformation slug={slug} />}
      {toShow === "total_birds" && <Birds userId={slug} />}
      {toShow === "races_joined" && <RacesJoinedComponent userId={slug} />}
      {toShow === "total_wins" && <UserWinComponent userId={slug} />}
      {toShow === "paid_amount" && <UserPaymentsComponent userId={slug} />}
    </div>
  );
}
