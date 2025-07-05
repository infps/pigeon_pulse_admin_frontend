"use client";

import { getRank } from "@/lib/numtoRank";
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

export const UserColumns: ColumnDef<User>[] = [
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

export type Bird = {
  id: string;
  name: string;
  bandNumber: string;
  breed: string | null;
  color: string | null;
  gender: string | null;
  loft: {
    name: string;
    loftId: string;
  };
};

export const BirdColumns: ColumnDef<Bird>[] = [
  {
    accessorKey: "loft.loftId",
    header: "Loft ID",
  },
  {
    accessorKey: "loft.name",
    header: "Loft Name",
  },
  {
    accessorKey: "name",
    header: "Bird Name",
  },
  {
    accessorKey: "bandNumber",
    header: "Band Number",
  },
  {
    accessorKey: "breed",
    header: "Breed",
  },
  {
    accessorKey: "color",
    header: "Color",
  },
  {
    accessorKey: "gender",
    header: "Gender",
  },
];

export type RacesJoined = {
  bird: {
    name: string;
    bandNumber: string;
    breed: string | null;
    color: string | null;
  };
  race: {
    status: "UPCOMING" | "LIVE" | "COMPLETED";
    name: string;
  };
  status: "PENDING" | "PAID" | "CANCELLED";
  birdStatus: "UNKNOWN" | "ARRIVED" | "DISQUALIFIED" | "RETIRED" | "MISSING";
  id: string;
  createdAt: Date;
  userId: string;
  raceId: string;
  birdId: string;
  paymentId: string | null;
  arrivalTime: Date | null;
  position: number | null;
  speed: number | null;
};

export const RacesJoinedColumns: ColumnDef<RacesJoined>[] = [
  {
    accessorKey: "race.status",
    header: "Race Status",
    cell: ({ row }) => {
      const status = row.getValue("race.status") as
        | "UPCOMING"
        | "LIVE"
        | "COMPLETED";
      return (
        <span
          className={`${
            status === "UPCOMING"
              ? "text-yellow-500"
              : status === "LIVE"
              ? "text-green-500"
              : "text-gray-500"
          } font-bold`}
        >
          {status}
        </span>
      );
    },
  },
  {
    accessorKey: "race.name",
    header: "Race Name",
  },
  {
    accessorKey: "bird.name",
    header: "Bird Name",
  },
  {
    accessorKey: "bird.bandNumber",
    header: "Band Number",
  },
  {
    accessorKey: "position",
    header: () => <div className="text-right">Position</div>,
    cell: ({ row }) => {
      const position = row.original.position;
      return position !== null ? (
        <span className="font-bold">{position}</span>
      ) : (
        <span className="text-gray-500">N/A</span>
      );
    },
  },
];

export type UserWins = {
  bird: {
    name: string;
    bandNumber: string;
    breed: string | null;
    color: string | null;
  };
  race: {
    name: string;
  };
  status: "PENDING" | "PAID" | "CANCELLED";
  birdStatus: "UNKNOWN" | "ARRIVED" | "DISQUALIFIED" | "RETIRED" | "MISSING";
  id: string;
  createdAt: Date;
  userId: string;
  raceId: string;
  birdId: string;
  paymentId: string | null;
  arrivalTime: Date | null;
  position: number | null;
  speed: number | null;
};

export const UserWinsColumns: ColumnDef<UserWins>[] = [
  {
    accessorKey: "race.name",
    header: "Race Name",
  },
  {
    accessorKey: "bird.name",
    header: "Bird Name",
  },
  {
    accessorKey: "bird.bandNumber",
    header: "Band Number",
  },
  {
    accessorKey: "bird.color",
    header: "Color",
  },
  {
    accessorKey: "bird.breed",
    header: "Breed",
  },
  {
    accessorKey: "position",
    header: () => <div className="text-right">Position</div>,
    cell: ({ row }) => {
      const position = row.original.position;
      return position !== null ? (
        position === 1 ? (
          <span className="font-bold text-green-500">Winners</span>
        ) : (
          <span className="font-bold">{getRank(position)}</span>
        )
      ) : (
        <span className="text-gray-500">N/A</span>
      );
    },
  },
];

export type UserPayments = {
  raceEntries: {
    bird: {
      name: string;
      loft: {
        name: string;
        loftId: string;
      };
    };
    race: {
      name: string;
    };
  };
  status: "PENDING" | "SUCCESS" | "FAILED";
  amount: number;
  id: string;
  createdAt: Date;
  userId: string;
  paypalTransactionId: string;
  payerEmail: string;
  currency: string;
  paymentTime: Date;
};

export const UserPaymentsColumns: ColumnDef<UserPayments>[] = [
  {
    accessorKey: "raceEntries.race.name",
    header: "Race Name",
  },
  {
    accessorKey: "raceEntries.bird.name",
    header: "Bird Name",
  },
  {
    accessorKey: "raceEntries.bird.loft.name",
    header: "Loft Name",
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => {
      const amount = row.original.amount;
      return <span className="font-bold">${amount.toFixed(2)}</span>;
    },
  },
  {
    accessorKey: "status",
    header: "Payment Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as "PENDING" | "SUCCESS" | "FAILED";
      return (
        <span
          className={`${
            status === "PENDING"
              ? "text-yellow-500"
              : status === "SUCCESS"
              ? "text-green-500"
              : "text-red-500"
          } font-bold`}
        >
          {status}
        </span>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Payment Date",
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"));
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    },
  },
];

export type Races = {
  _count: {
    entries: number;
  };
} & {
  id: string;
  name: string;
  date: Date;
  distanceKm: number;
  startLocation: string;
  endLocation: string;
  entryFee: number;
  maxParticipants: number;
  status: "UPCOMING" | "LIVE" | "COMPLETED";
  rules: string | null;
  description: string | null;
  createdAt: Date;
};

export const RacesColumns: ColumnDef<Races>[] = [
  {
    accessorKey: "name",
    header: "Race Name",
  },
  {
    accessorKey: "distanceKm",
    header: "Distance (Km)",
    cell: ({ row }) => {
      const distance = row.original.distanceKm;
      return <span className="font-bold">{distance} Km</span>;
    },
  },
  {
    accessorKey: "_count.entries",
    header: "Participants",
    cell: ({ row }) => {
      const entries = row.original._count.entries;
      return <span className="font-bold">{entries}</span>;
    },
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => {
      const date = new Date(row.getValue("date"));
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    },
  },
  {
    accessorKey: "date",
    header: "Time",
    id: "time",
    cell: ({ row }) => {
      const date = new Date(row.getValue("date"));
      return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as
        | "UPCOMING"
        | "LIVE"
        | "COMPLETED";
      return (
        <span
          className={`${
            status === "UPCOMING"
              ? "text-yellow-500"
              : status === "LIVE"
              ? "text-green-500"
              : "text-gray-500"
          } font-bold`}
        >
          {status}
        </span>
      );
    },
  },
  {
    accessorKey: "action",
    header: () => <div className="text-right">Action</div>,
    cell: ({ row }) => {
      const id = row.original.id;
      return (
        <Link
          href={`/races/update/${id}`}
          className="flex items-center justify-end"
        >
          <CircleArrowRight />
        </Link>
      );
    },
  },
];

export type Payments = {
  user: {
    id: string;
    name: string | null;
  };
  raceEntries: {
    race: {
      name: string;
    };
    bird: {
      loft: {
        loftId: string;
      };
    };
  };
  id: string;
  paypalTransactionId: string;
  payerEmail: string;
  amount: number;
  currency: string;
  status: "PENDING" | "SUCCESS" | "FAILED";
  paymentTime: Date;
  userId: string;
  createdAt: Date;
};

export const PaymentsColumns: ColumnDef<Payments>[] = [
  {
    accessorKey: "user.name",
    header: "User Name",
  },
  {
    accessorKey: "payerEmail",
    header: "Email",
  },
  {
    accessorKey: "raceEntries.race.name",
    header: "Race Name",
  },
  {
    accessorKey: "raceEntries.bird.loft.loftId",
    header: "Loft ID",
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => {
      const amount = row.original.amount;
      return <span className="font-bold">${amount.toFixed(2)}</span>;
    },
  },
  {
    accessorKey: "status",
    header: "Payment Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as "PENDING" | "SUCCESS" | "FAILED";
      return (
        <span
          className={`${
            status === "PENDING"
              ? "text-yellow-500"
              : status === "SUCCESS"
              ? "text-green-500"
              : "text-red-500"
          } font-bold`}
        >
          {status}
        </span>
      );
    },
  },
  {
    accessorKey: "paypalTransactionId",
    header: "Transaction ID",
    cell: ({ row }) => {
      const transactionId = row.original.paypalTransactionId;
      return <span className="font-mono">{transactionId}</span>;
    },
  },
  {
    accessorKey: "createdAt",
    header: "Payment Date",
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"));
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    },
  },
];

export type RaceStats = {
  name: string;
  id: string;
  entries: RaceStatsEntries[];
};

export type RaceStatsEntries = {
  arrivalTime: Date | null;
  position: number | null;
  bird: {
    name: string;
    bandNumber: string;
    loft: {
      name: string;
      loftId: string;
    };
  };
};

export const RaceStatsColumns: ColumnDef<RaceStatsEntries>[] = [
  {
    accessorKey: "entries.position",
    header: "Rank",
  },
  {
    accessorKey: "entries.bird.name",
    header: "Bird Name",
  },
  {
    accessorKey: "entries.bird.bandNumber",
    header: "Band Number",
  },
  {
    accessorKey: "entries.bird.loft.name",
    header: "Loft Name",
  },
  {
    accessorKey: "entries.bird.loft.loftId",
    header: "Loft ID",
  },
  {
    accessorKey: "entries.arrivalTime",
    header: "Arrival Time",
    cell: ({ row }) => {
      const arrivalTime = row.original.arrivalTime;
      return arrivalTime
        ? new Date(arrivalTime).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
          })
        : "N/A";
    },
  },
];
