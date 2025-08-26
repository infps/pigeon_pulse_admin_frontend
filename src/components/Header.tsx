"use client";
import { useAuthStore } from "@/store/store";
import React, { useCallback, useEffect, useRef, useState } from "react";
import UserControls from "./usercontrols";
import Image from "next/image";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

export default function Header() {
  const { user } = useAuthStore();
  return (
    <div className="h-24 flex bg-card z-50 gap-20 items-center justify-between px-6 border-b sticky top-0 left-0">
      <div>
        <p className="text-2xl font-bold text-nowrap text-black">
          Welcome, {user?.name}
        </p>
        <p className="text-sm text-accent-foreground text-nowrap flex items-center gap-4">
          <span>
            Today is{" "}
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </p>
      </div>
      <UserControls />
    </div>
  );
}
