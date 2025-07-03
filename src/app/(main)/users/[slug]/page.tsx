"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { getSingleUser, updateUser } from "@/lib/api/user";
import { use, useState, useEffect } from "react";
import Link from "next/link";
import { CircleArrowRight } from "lucide-react";
import SkeletonLoading from "./SkeletonLoading";

export default function page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const { data, error, isError, isPending, isSuccess } = getSingleUser(slug);
  const [bannedStatus, setBannedStatus] = useState<string>("");
  const [bannedReason, setBannedReason] = useState<string>("");
  const [bannedError, setBannedError] = useState<string>("");
  const updateUserMutation = updateUser(slug);
  console.log("User Data:", data);
  useEffect(() => {
    if (data?.data?.user) {
      setBannedStatus(data.data.user.banned ? "ban" : "active");
      setBannedReason(data.data.user.bannedReason || "");
    }
  }, [data]);

  const handleUpdateUser = async () => {
    try {
      const banned = bannedStatus === "ban";
      if (banned && !bannedReason) {
        setBannedError("Please provide a reason for banning the user.");
        return;
      }
      const updateData = {
        banned: bannedStatus === "ban",
        banReason: bannedStatus === "ban" ? bannedReason : null,
      };

      if (updateUserMutation.mutateAsync) {
        const { status, error, data } = await updateUserMutation.mutateAsync(
          updateData
        );
        if (status === 200) {
          setBannedError("");
          setBannedStatus(bannedStatus);
          setBannedReason(bannedStatus === "ban" ? bannedReason : "");
        } else {
          setBannedError(error || "Failed to update user status");
        }
      }
    } catch (error) {
      alert("Failed to update user status");
    }
  };
  if (isPending) {
    return <SkeletonLoading />;
  }

  if (isError && error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      <div className="grid grid-cols-4">
        <div className="w-full col-span-1 h-32 flex justify-between hover:bg-accent/10 p-4 border-r-2">
          <div>
            <p className="text-3xl font-bold">{data?.data?.totalBirds}</p>
            <p className="text-sm text-gray-500">Total Birds</p>
          </div>
          <Link href={`/birds/${data?.data?.user?.id}`}>
            <CircleArrowRight className="h-8 w-8 hover:stroke-primary" />
          </Link>
        </div>
        <div className="w-full col-span-1 h-32 flex justify-between hover:bg-accent/10 p-4 border-r-2">
          <div>
            <p className="text-3xl font-bold">{data?.data?.racesJoined}</p>
            <p className="text-sm text-gray-500">Race Joined</p>
          </div>
          <Link href={`/birds/${data?.data?.user?.id}`}>
            <CircleArrowRight className="h-8 w-8 hover:stroke-primary" />
          </Link>
        </div>
        <div className="w-full col-span-1 h-32 flex justify-between hover:bg-accent/10 p-4 border-r-2">
          <div>
            <p className="text-3xl font-bold">{data?.data?.totalWins}</p>
            <p className="text-sm text-gray-500">Total Win</p>
          </div>
          <Link href={`/birds/${data?.data?.user?.id}`}>
            <CircleArrowRight className="h-8 w-8 hover:stroke-primary" />
          </Link>
        </div>
        <div className="w-full col-span-1 h-32 flex justify-between hover:bg-accent/10 p-4">
          <div>
            <p className="text-3xl font-bold">{data?.data?.paidAmount}</p>
            <p className="text-sm text-gray-500">Paid Amount</p>
          </div>
          <Link href={`/birds/${data?.data?.user?.id}`}>
            <CircleArrowRight className="h-8 w-8 hover:stroke-primary" />
          </Link>
        </div>
      </div>
      <div className="rounded-lg p-4 border mt-2">
        <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
        <div className="flex items-center gap-4">
          <div>
            <Label className="text-sm font-medium">Name</Label>
            <Input disabled value={data?.data?.user?.name} className="mt-1" />
          </div>
          <div>
            <Label className="text-sm font-medium">Email</Label>
            <Input disabled value={data?.data?.user?.email} className="mt-1" />
          </div>
        </div>
      </div>
      <div className="rounded-lg p-4 border mt-2">
        <h2 className="text-xl font-semibold mb-4">User Control</h2>
        <RadioGroup
          onValueChange={(value) => setBannedStatus(value)}
          value={bannedStatus}
          className="flex items-center space-x-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="ban" id="ban" />
            <Label htmlFor="ban">Ban</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="active" id="active" />
            <Label htmlFor="active">Active</Label>
          </div>
        </RadioGroup>
        {bannedStatus === "ban" && (
          <div className="mt-4">
            <Label className="text-sm font-medium">Reason for Ban</Label>
            <Input
              placeholder="Enter reason for ban"
              className="mt-1"
              value={bannedReason}
              disabled={data?.data?.user?.banned}
              onChange={(e) => setBannedReason(e.target.value)}
            />
            {bannedError && (
              <p className="text-red-500 text-sm mt-1">{bannedError}</p>
            )}
          </div>
        )}
        <div className="mt-4">
          <Button
            onClick={handleUpdateUser}
            disabled={
              updateUserMutation.isPending ||
              data?.data?.user?.banned === (bannedStatus === "ban")
            }
          >
            {updateUserMutation.isPending
              ? "Updating..."
              : "Update User Status"}
          </Button>
        </div>
      </div>
    </div>
  );
}
