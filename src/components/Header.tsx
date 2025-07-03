import useUserStore from "@/store/store";
import React from "react";
import Search from "./Search";
import UserControls from "./UserControls";

export default function Header() {
  const { userData } = useUserStore();
  return (
    <div className="h-24 flex bg-card z-50 gap-20 items-center justify-between px-6 shadow-2xl sticky top-0 left-0">
      <div>
        <p className="text-2xl font-bold text-nowrap text-black">
          Welcome, {userData?.user?.name}
        </p>
        <p className="text-sm text-accent-foreground text-nowrap">
          Today is{" "}
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>
      <UserControls />
    </div>
  );
}
