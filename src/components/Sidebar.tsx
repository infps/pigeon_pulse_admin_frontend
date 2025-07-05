"use client";
import {
  LayoutDashboard,
  SquareArrowRight,
  Users,
  DollarSign,
  TrendingUp,
  Bird,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

export default function Sidebar() {
  const sidebarItems = [
    {
      name: "Dashboard",
      href: "/",
      leftIcon: LayoutDashboard,
      rightIcon: <SquareArrowRight />,
    },
    {
      name: "Users",
      href: "/users",
      leftIcon: Users,
      rightIcon: <SquareArrowRight />,
    },
    {
      name: "Races",
      leftIcon: Bird,
      href: "/races",
      rightIcon: <SquareArrowRight />,
    },
    {
      name: "Payments",
      leftIcon: DollarSign,
      href: "/payments",
      rightIcon: <SquareArrowRight />,
    },
    {
      name: "Race Statistics",
      leftIcon: TrendingUp,
      href: "/race-statistics",
      rightIcon: <SquareArrowRight />,
    },
  ];
  const pathname = usePathname();
  return (
    <div className="w-sm sticky top-0 left-0 h-full">
      <h1 className="text-4xl font-bold text-center text-primary h-24 flex items-center justify-center">
        AGN
      </h1>
      <div>
        {sidebarItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={`${
              pathname === item.href
                ? "bg-accent/20 text-primary border-l-4 border-primary"
                : "border-l-4 border-transparent"
            } flex items-center gap-2 p-4 transition-colors hover:bg-accent/10`}
          >
            {item.leftIcon && (
              <span className="text-lg">
                <item.leftIcon className="fill-primary" />
              </span>
            )}
            <span className="flex-1">{item.name}</span>
            {item.rightIcon && (
              <span className="text-lg">{item.rightIcon}</span>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
