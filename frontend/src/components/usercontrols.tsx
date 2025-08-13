"use client";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { useAuthStore } from "@/store/store";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { User } from "lucide-react";
import Link from "next/link";
import { useLogout } from "@/lib/api/auth";
import { tokenStorage } from "@/lib/utils";

export default function UserControls() {
  const { user } = useAuthStore();
  if (!user) {
    return null;
  }
  const { mutateAsync: logout } = useLogout();
  const router = useRouter();
  const handleLogout = async () => {
    if (!logout) return;
    try {
      // Remove token from localStorage using utility
      tokenStorage.remove();
      const { data, error } = await logout({});
      if (error) {
        toast.error("Failed to log out");
        return;
      }
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error("An error occurred while logging out");
    }
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <User className="h-6 w-6 cursor-pointer text-gray-500 hover:text-gray-800" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 p-2" align="start">
        <div className="mb-5">
          <p className="text-sm font-semibold text-black">{user?.name}</p>
          <p className="text-xs text-gray-500">{user?.email}</p>
        </div>

        <DropdownMenuItem asChild className="cursor-pointer mb-2">
          <Link href="/profile" className="flex items-center gap-2 w-full">
            <User className="h-4 w-4" />
            <span>Profile</span>
          </Link>
        </DropdownMenuItem>

        <Button onClick={handleLogout} variant="destructive" className="w-full">
          Logout
        </Button>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
