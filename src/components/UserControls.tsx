"use client";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import useUserStore from "@/store/store";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { User } from "lucide-react";
import Link from "next/link";

export default function UserControls() {
  const { userData } = useUserStore();
  if (!userData) {
    return null;
  }
  const router = useRouter();
  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          toast.success("Logged out successfully");
          useUserStore.setState({
            userData: {
              session: null,
              user: null,
            },
          });
          router.push("/login");
        },
      },
    });
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex items-center gap-2 cursor-pointer">
          <Avatar>
            {userData?.user?.image ? (
              <AvatarImage src={userData?.user?.image} alt="profile" />
            ) : (
              <AvatarFallback>CN</AvatarFallback>
            )}
          </Avatar>
          <div>
            <p className="text-sm font-semibold text-black">
              {userData?.user?.name.split(" ")[0]}
            </p>
          </div>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 p-2" align="start">
        <div className="mb-5">
          <p className="text-sm font-semibold text-black">
            {userData?.user?.name}
          </p>
          <p className="text-xs text-gray-500">{userData?.user?.email}</p>
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
