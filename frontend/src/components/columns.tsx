import {
  BirdEventInventory,
  Event,
  EventInventory,
  Race,
  RaceItem,
  RaceResult,
} from "@/lib/types";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "./ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Pencil, Settings, EllipsisVertical } from "lucide-react";
import { EventUpdateFetch } from "./EventCreateForm";
import BirdUpdateForm from "./BirdUpdateForm";
import Link from "next/link";

export const EventColumns: ColumnDef<Event>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => row.getValue("name"),
  },
  {
    accessorKey: "shortName",
    header: "Short Name",
    cell: ({ row }) => row.getValue("shortName"),
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
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => row.getValue("status"),
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => row.getValue("type"),
  },
  {
    accessorKey: "actions",
    header: () => <div className="text-right">Actions</div>,
    cell: ({ row }) => (
      <div className="flex justify-end">
        <Dialog>
          <DialogTrigger asChild>
            <Pencil size={20} className="cursor-pointer text-primary" />
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>Edit Event</DialogTitle>
            <EventUpdateFetch id={row.original.id} />
          </DialogContent>
        </Dialog>
      </div>
    ),
  },
];

export const EventInventoryColumns: ColumnDef<EventInventory>[] = [
  {
    accessorKey: "loft",
    header: "Loft",
    cell: ({ row }) => row.getValue("loft"),
  },
  {
    accessorKey: "breeder.name",
    header: "Breeder",
  },
  {
    accessorKey: "breeder.state",
    header: "State",
  },
  {
    accessorKey: "registration_date",
    header: "Registration Date",
  },

  {
    accessorKey: "reserved_birds",
    header: "Reserved Birds",
  },
  {
    accessorKey: "payment.paymentValue",
    header: "Payment Value",
    cell: ({ row }) => {
      const payment = row.original.payment?.paymentValue;
      return payment ? `$${payment.toFixed(2)}` : "N/A";
    },
  },
  {
    accessorKey: "isPaid",
    header: "Paid",
    cell: ({ row }) => (row.getValue("isPaid") ? "Yes" : "No"),
  },
];

export const BirdEventInventoryColumns: ColumnDef<BirdEventInventory>[] = [
  {
    accessorKey: "bird.breeder.name",
    header: "Breeder",
  },
  {
    accessorKey: "bird.birdName",
    header: "Bird Name",
  },
  {
    accessorKey: "band_1",
    header: "Ascc",
  },
  {
    accessorKey: "band_2",
    header: "Year",
  },
  {
    accessorKey: "band_3",
    header: "Letter",
  },
  {
    accessorKey: "band_4",
    header: "Number",
  },
  {
    accessorKey: "bird.color",
    header: "Color",
  },
  {
    accessorKey: "bird.sex",
    header: "Sex",
  },
  {
    accessorKey: "bird.is_active",
    header: "Active",
    cell: ({ row }) => (row.original.bird.is_active ? "Yes" : "No"),
  },
  {
    accessorKey: "bird.is_lost",
    header: "Lost",
    cell: ({ row }) => (row.original.bird.is_lost ? "Yes" : "No"),
  },
  {
    accessorKey: "bird.lost_date",
    header: "Lost Date",
    cell: ({ row }) => {
      const date = row.original.bird.lost_date;
      return date
        ? new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })
        : "N/A";
    },
  },
  {
    accessorKey: "rfId",
    header: "RFID",
  },
  {
    accessorKey: "arrivalDate",
    header: "Arrival Date",
    cell: ({ row }) => {
      const date = row.original.arrivalDate;
      return date
        ? new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })
        : "N/A";
    },
  },
  {
    accessorKey: "departureDate",
    header: "Return to Breeder",
    cell: ({ row }) => {
      const date = row.original.departureDate;
      return date
        ? new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })
        : "N/A";
    },
  },
  {
    accessorKey: "actions",
    header: () => <div className="text-right">Actions</div>,
    cell: ({ row }) => (
      <div className="flex justify-end">
        <Dialog>
          <DialogTrigger asChild>
            <Pencil size={20} className="cursor-pointer text-primary" />
          </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <DialogTitle>Edit Bird</DialogTitle>
            <BirdUpdateForm bird={row.original} />
          </DialogContent>
        </Dialog>
      </div>
    ),
  },
];

export const RaceColumns: ColumnDef<Race>[] = [
  {
    accessorKey: "externalRaceId",
    header: "Race Number",
  },
  {
    accessorKey: "type",
    header: "Type",
  },
  {
    accessorKey: "location",
    header: "Location",
  },
  {
    accessorKey: "distance",
    header: "Distance",
  },
  {
    accessorKey: "startTime",
    header: "Start Time",
    cell: ({ row }) => {
      const date = row.original.startTime;
      return date
        ? new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })
        : "N/A";
    },
  },
  {
    accessorKey: "sunrise",
    header: "Sunrise",
  },
  {
    accessorKey: "sunset",
    header: "Sunset",
  },
  {
    accessorKey: "isClosed",
    header: "Status",
    cell: ({ row }) => (row.getValue("isClosed") ? "Closed" : "Open"),
  },
  {
    accessorKey: "actions",
    header: () => <div className="text-right">Actions</div>,
    cell: ({ row }) => (
      <div className="flex justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <EllipsisVertical
              size={20}
              className="cursor-pointer text-primary"
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link
                href={`/races/${row.original.id}/entries`}
                className="w-full"
              >
                Entries
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link
                href={`/races/${row.original.id}/results`}
                className="w-full"
              >
                Results
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    ),
  },
];

export const RaceItemColumns: ColumnDef<RaceItem>[] = [
  {
    accessorKey: "eventInventoryItem.bird.breeder.name",
    header: "Breeder",
  },
  {
    accessorKey: "eventInventoryItem.band",
    header: "Band",
  },
  {
    accessorKey: "eventInventoryItem.rfId",
    header: "RFID",
  },
  {
    accessorKey: "eventInventoryItem.bird.color",
    header: "Color",
  },
  {
    accessorKey: "eventInventoryItem.bird.is_lost",
    header: "Lost",
    cell: ({ row }) =>
      row.original.eventInventoryItem.bird.is_lost ? "Yes" : "No",
  },
  {
    accessorKey: "loftBasketed",
    header: "Loft Basketed",
    cell: ({ row }) => (row.original.loftBasketed ? "Yes" : "No"),
  },
  {
    accessorKey: "raceBasketed",
    header: "Race Basketed",
    cell: ({ row }) => (row.original.raceBasketed ? "Yes" : "No"),
  },
  {
    accessorKey: "raceBasketTime",
    header: "Basket Time",
    cell: ({ row }) => {
      const date = row.original.raceBasketTime;
      return date
        ? new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })
        : "N/A";
    },
  },
];

export const RaceResultColumns: ColumnDef<RaceResult>[] = [
  {
    header: "Position",
    cell: ({ row }) => {
      const pos = row.original.raceItemResult ? row.index + 1 : "-";
      return <span className="font-bold">{pos}</span>;
    },
  },
  {
    accessorKey: "eventInventoryItem.bird.breeder.name",
    header: "Breeder",
  },
  {
    accessorKey: "eventInventoryItem.bird.birdName",
    header: "Bird",
  },
  {
    accessorKey: "eventInventoryItem.band",
    header: "Band",
  },
  {
    accessorKey: "eventInventoryItem.rfId",
    header: "RFID",
  },
  {
    accessorKey: "eventInventoryItem.bird.color",
    header: "Color",
  },
  {
    accessorKey: "raceItemResult.speed",
    header: "Speed",
    cell: ({ row }) => {
      const speed = row.original.raceItemResult?.speed;
      return speed ? `${speed.toFixed(2)} MPH` : "N/A";
    },
  },
  {
    accessorKey: "raceItemResult.arrivalTime",
    header: "Arrival Time",
    cell: ({ row }) => {
      const date = row.original.raceItemResult?.arrivalTime;
      return date
        ? new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })
        : "N/A";
    },
  },
  {
    accessorKey: "raceItemResult.distance",
    header: "Distance",
    cell: ({ row }) => {
      const distance = row.original.raceItemResult?.distance;
      return distance ? `${distance} miles` : "N/A";
    },
  },
];
