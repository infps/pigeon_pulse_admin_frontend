"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CircleArrowRight } from "lucide-react";
import Link from "next/link";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type User = {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  banned: boolean;
};

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "SL.No",
    header: "SL.No",
    cell: ({ row }) => row.index + 1, // Display the index as SL
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "createdAt",
    header: "Registered On",
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"));
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    },
  },
  {
    accessorKey: "banned",
    header: "Status",
    cell: ({ row }) => {
      const isBanned = row.getValue("banned");
      return (
        <span
          className={`${
            isBanned ? "text-red-500" : "text-green-500"
          } font-bold`}
        >
          {isBanned ? "BANNED" : "ACTIVE"}
        </span>
      );
    },
  },
  {
    accessorKey: "action",
    header: () => <div className="text-right">Action</div>,
    cell: ({ row }) => {
      const user = row.original;
      return (
        <Link
          href={`/users/${user.id}`}
          className="flex items-center justify-end"
        >
          <CircleArrowRight />
        </Link>
      );
    },
  },
];
