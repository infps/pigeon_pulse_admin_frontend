import { Event, EventInventory } from "@/lib/types";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Pencil } from "lucide-react";
import { EventUpdateFetch } from "./EventCreateForm";

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
