"use client";
import { LayoutDashboard, SquareArrowRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

export default function Sidebar() {
  const sidebarItems = [
    {
      name: "Dashboard",
      href: "/",
      leftIcon: LayoutDashboard,
    },
    {
      name: "Users",
      href: "/users",
      rightIcon: <SquareArrowRight />,
    },
    {
      name: "Races",
      href: "/races",
      rightIcon: <SquareArrowRight />,
    },
    {
      name: "Payments",
      href: "/payments",
      rightIcon: <SquareArrowRight />,
    },
    {
      name: "Race Statistics",
      href: "/race-statistics",
      rightIcon: <SquareArrowRight />,
    },
    {
      name: "Support Center",
      href: "/support",
      rightIcon: <SquareArrowRight />,
    },
  ];
  const pathname = usePathname();
  console.log(pathname);
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
              pathname === item.href && "bg-accent/20 text-primary"
            } flex items-center gap-2 p-4 transition-colors`}
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
