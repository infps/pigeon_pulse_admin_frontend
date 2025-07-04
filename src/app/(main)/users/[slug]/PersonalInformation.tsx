import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { getSingleUser, updateUser } from "@/lib/api/user";
import React, { useEffect, useState } from "react";
import { SkeletonPersonalInformation } from "./SkeletonLoading";

export default function PersonalInformation({ slug }: { slug: string }) {
  const { data, error, isError, isPending, isSuccess } = getSingleUser({
    params: {},
    userId: slug,
  });
  const [bannedStatus, setBannedStatus] = useState<string>("");
  const [bannedReason, setBannedReason] = useState<string>("");
  const [bannedError, setBannedError] = useState<string>("");
  const updateUserMutation = updateUser({
    params: {},
    userId: slug,
  });
  useEffect(() => {
    if (data?.data) {
      setBannedStatus(data.data.banned ? "ban" : "active");
      setBannedReason(data.data.bannedReason || "");
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
    return <SkeletonPersonalInformation />;
  }

  if (isError && error) {
    return <div>Error: {error.message}</div>;
  }
  return (
    <>
      <div className="rounded-lg p-4 border mt-2">
        <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
        <div className="flex items-center gap-4">
          <div>
            <Label className="text-sm font-medium">Name</Label>
            <Input disabled value={data?.data?.name} className="mt-1" />
          </div>
          <div>
            <Label className="text-sm font-medium">Email</Label>
            <Input disabled value={data?.data?.email} className="mt-1" />
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
              disabled={data?.data?.banned}
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
              data?.data?.banned === (bannedStatus === "ban")
            }
          >
            {updateUserMutation.isPending
              ? "Updating..."
              : "Update User Status"}
          </Button>
        </div>
      </div>
    </>
  );
}
