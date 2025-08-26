"use client";
import { getEventInventoryItem } from "@/lib/api/eventInventory";
import { EventInventoryItem } from "@/lib/types";
import React, { useState } from "react";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  Dialog,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DataTable } from "@/components/data-table";
import { ColumnDef } from "@tanstack/react-table";
import BirdUpdateForm from "./BirdUpdateForm";

interface EventInventoryDialogContentProps {
  id: string;
  onClose: () => void;
}

// Clickable bird name component for the birds table
function ClickableBirdName({
  bird,
  birdName,
}: {
  bird: EventInventoryItem["eventInventoryItems"][0];
  birdName: string;
}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  console.log(bird);
  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <div className="font-medium cursor-pointer text-primary hover:underline">
          {birdName}
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-4xl">
        <DialogTitle>Edit Bird</DialogTitle>
        <BirdUpdateForm bird={bird} />
      </DialogContent>
    </Dialog>
  );
}

// Column definitions for payments table
const paymentsColumns: ColumnDef<EventInventoryItem["payments"][0]>[] = [
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => {
      const type = row.getValue("type") as string;
      return <div className="font-medium">{type.replace(/_/g, " ")}</div>;
    },
  },
  {
    accessorKey: "paymentDate",
    header: "Date",
    cell: ({ row }) => {
      const date = row.getValue("paymentDate") as Date;
      return <div>{date ? new Date(date).toLocaleDateString() : "-"}</div>;
    },
  },
  {
    accessorKey: "paymentValue",
    header: "Value",
    cell: ({ row }) => {
      const value = row.getValue("paymentValue") as number;
      return <div>${value.toFixed(2)}</div>;
    },
  },
  {
    accessorKey: "paymentMethod",
    header: "Method",
    cell: ({ row }) => {
      const method = row.getValue("paymentMethod") as string;
      return <div>{method}</div>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const isCompleted =
        status.toLowerCase() === "completed" || status.toLowerCase() === "paid";
      return (
        <div
          className={`font-medium ${
            isCompleted ? "text-green-600" : "text-red-600"
          }`}
        >
          {status}
        </div>
      );
    },
  },
];

// Column definitions for birds table
const birdsColumns: ColumnDef<EventInventoryItem["eventInventoryItems"][0]>[] =
  [
    {
      accessorKey: "bird.birdName",
      header: "Bird Name",
      cell: ({ row }) => {
        const birdName = row.original.bird.birdName;
        return <ClickableBirdName bird={row.original} birdName={birdName} />;
      },
    },
    {
      accessorKey: "band",
      header: "Band",
      cell: ({ row }) => {
        const band = row.getValue("band") as string;
        return <div>{band || "N/A"}</div>;
      },
    },
    {
      accessorKey: "bird.color",
      header: "Color",
      cell: ({ row }) => {
        const color = row.original.bird.color;
        return <div>{color}</div>;
      },
    },
    {
      accessorKey: "bird.sex",
      header: "Sex",
      cell: ({ row }) => {
        const sex = row.original.bird.sex;
        return <div>{sex}</div>;
      },
    },
    {
      accessorKey: "arrivalDate",
      header: "Arrival Date",
      cell: ({ row }) => {
        const date = row.getValue("arrivalDate") as Date;
        return <div>{date ? new Date(date).toLocaleDateString() : "N/A"}</div>;
      },
    },
    {
      accessorKey: "departureDate",
      header: "Departure Date",
      cell: ({ row }) => {
        const date = row.getValue("departureDate") as Date;
        return <div>{date ? new Date(date).toLocaleDateString() : "N/A"}</div>;
      },
    },
  ];

export default function EventInventoryDialog({
  id,
  onClose,
}: EventInventoryDialogContentProps) {
  const { data, error, isError, isPending, isSuccess } =
    getEventInventoryItem(id);

  const eventInventoryItem: EventInventoryItem = data?.data;

  if (isPending) {
    return (
      <div className="flex items-center justify-center h-32">
        <div>Loading...</div>
      </div>
    );
  }

  if (isError || !eventInventoryItem) {
    return (
      <div className="flex items-center justify-center h-32">
        <div>Error loading event inventory</div>
      </div>
    );
  }

  // Calculate fees and totals
  const calculateFees = () => {
    const fees = {
      perchFee: 0,
      entryFee: 0,
      hotSpotFee: 0,
      classes: 0,
      total: 0,
    };

    eventInventoryItem.payments.forEach((payment) => {
      switch (payment.type) {
        case "PERCH_FEE":
          fees.perchFee += payment.paymentValue;
          break;
        case "ENTRY_FEE":
          fees.entryFee += payment.paymentValue;
          break;
        case "HOTSPOT_FEE_1":
        case "HOTSPOT_FEE_2":
        case "HOTSPOT_FEE_3":
        case "HOTSPOT_FEE_4":
          fees.hotSpotFee += payment.paymentValue;
          break;
        default:
          fees.classes += payment.paymentValue;
      }
      fees.total += payment.paymentValue;
    });

    return fees;
  };

  const fees = calculateFees();

  // Only count completed payments for balance calculation
  const completedPayments = eventInventoryItem.payments.filter(
    (payment) =>
      payment.status.toLowerCase() === "completed" ||
      payment.status.toLowerCase() === "paid"
  );

  const totalCompletedPayments = completedPayments.reduce(
    (sum, payment) => sum + payment.paymentValue,
    0
  );

  const balance = totalCompletedPayments - fees.total;

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
        <div>
          <div className="font-semibold">Event</div>
          <div>{eventInventoryItem.event.name}</div>
          <div className="text-sm text-gray-600">
            {new Date(eventInventoryItem.event.date).toLocaleDateString()}
          </div>
        </div>
        <div>
          <div className="font-semibold">Breeder</div>
          <div>{eventInventoryItem.breeder.name}</div>
        </div>
        <div className="text-right">
          <div className="text-lg font-semibold">OPEN</div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Left Side - 2 parts */}
        <div className="col-span-2 space-y-4">
          {/* Breeder Info */}
          <div className="space-y-2">
            <div className="font-semibold">Breeder Information</div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="font-medium">Name:</span>{" "}
                {eventInventoryItem.breeder.name}
              </div>
              <div>
                <span className="font-medium">Sign-up date:</span>{" "}
                {new Date(
                  eventInventoryItem.registration_date
                ).toLocaleDateString()}
              </div>
              <div>
                <span className="font-medium">Reserved bird count:</span>{" "}
                {eventInventoryItem.reserved_birds}
              </div>
              <div>
                <span className="font-medium">Loft:</span>{" "}
                {eventInventoryItem.loft}
              </div>
            </div>
          </div>

          {/* Payments Section */}
          <div className="space-y-2">
            <div className="font-semibold">Payments</div>
            <DataTable
              columns={paymentsColumns}
              data={eventInventoryItem.payments}
            />
          </div>
        </div>

        {/* Right Side - Fees Summary - 1 part */}
        <div className="col-span-1 space-y-4">
          <div className="space-y-2">
            <div className="font-semibold">Fees</div>
            <div className="bg-gray-50 p-4 rounded space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Perch fee:</span>
                <span>${fees.perchFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Entry fee:</span>
                <span>${fees.entryFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Hot spot:</span>
                <span>${fees.hotSpotFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Classes:</span>
                <span>${fees.classes.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-semibold border-t pt-2">
                <span>Total:</span>
                <span>${fees.total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Payments:</span>
                <span>${totalCompletedPayments.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Transfer due:</span>
                <span>$0.00</span>
              </div>
              <div className="flex justify-between font-semibold text-lg border-t pt-2">
                <span>Balance:</span>
                <span
                  className={
                    balance < 0
                      ? "text-red-600"
                      : balance > 0
                      ? "text-green-600"
                      : ""
                  }
                >
                  ${Math.abs(balance).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Birds Section */}
      <div className="space-y-2">
        <div className="font-semibold">Birds</div>
        <DataTable
          columns={birdsColumns}
          data={eventInventoryItem.eventInventoryItems}
        />
      </div>
    </div>
  );
}
