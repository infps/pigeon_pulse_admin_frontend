"use client";
import { getEventInventoryItem } from "@/lib/api/eventInventory";
import { EventInventoryItem, EventInventoryItemDetail, EventInventoryPayment } from "@/lib/types";
import { LoadingSpinner } from "@/components/loading-spinner";
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
  bird: EventInventoryItemDetail;
  birdName: string;
}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  if (!bird.bird) return <div className="font-medium">{birdName}</div>;
  
  // Map new structure to old BirdEventInventory structure for BirdUpdateForm
  const mappedBird = {
    ...bird,
    band: bird.bird.band,
    band_1: bird.bird.band1,
    band_2: bird.bird.band2,
    band_3: bird.bird.band3,
    band_4: bird.bird.band4,
    rfId: bird.bird.rfId,
    note: bird.bird.note,
    arrivalDate: bird.arrivalTime ? new Date(bird.arrivalTime) : null,
    departureDate: bird.departureDate ? new Date(bird.departureDate) : null,
    updatedAt: new Date(),
    bird: {
      ...bird.bird,
      imageUrl: bird.bird.idPicture,
      is_active: bird.bird.isActive,
      is_lost: bird.bird.isLost,
      lost_date: bird.bird.lostDate,
      lost_race_id: bird.bird.lostIdRace,
      breeder: {
        id: bird.bird.breeder?.idBreeder || 0,
        name: `${bird.bird.breeder?.firstName || ""} ${bird.bird.breeder?.lastName || ""}`,
      },
    },
  };
  
  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <div className="font-medium cursor-pointer text-primary hover:underline">
          {birdName}
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogTitle>Edit Bird</DialogTitle>
        <BirdUpdateForm bird={mappedBird as any} />
      </DialogContent>
    </Dialog>
  );
}

// Column definitions for payments table
const paymentsColumns: ColumnDef<EventInventoryPayment>[] = [
  {
    accessorKey: "paymentType",
    header: "Type",
    cell: ({ row }) => {
      const type = row.getValue("paymentType") as number;
      const typeMap: Record<number, string> = {
        0: "Perch Fee",
        1: "Entry Fee",
        2: "Classes",
        3: "Hotspot Fee",
        4: "Entry Refund",
        5: "Unknown",
        6: "Unknown",
        7: "Transfer Due",
        8: "Winner Payout"
      };
      return <div className="font-medium">{typeMap[type] || "Other"}</div>;
    },
  },
  {
    accessorKey: "paymentDate",
    header: "Date",
    cell: ({ row }) => {
      const date = row.getValue("paymentDate") as string;
      return <div>{date ? new Date(date).toLocaleDateString() : "-"}</div>;
    },
  },
  {
    accessorKey: "paymentValue",
    header: "Value",
    cell: ({ row }) => {
      const value = row.getValue("paymentValue") as number | null;
      return <div>${value ? value.toFixed(2) : "0.00"}</div>;
    },
  },
  {
    accessorKey: "paymentMethod",
    header: "Method",
    cell: ({ row }) => {
      const method = row.getValue("paymentMethod") as number | null;
      const methodMap: Record<number, string> = {
        0: "Bank Transfer",
        1: "Credit Card",
        2: "Cash",
        3: "Check",
      };
      return <div>{method !== null ? methodMap[method] || "Other" : "-"}</div>;
    },
  },
  {
    accessorKey: "paymentValue",
    header: "Status",
    cell: ({ row }) => {
      const value = row.getValue("paymentValue") as number | null;
      const isPaid = value !== null && value > 0;
      return (
        <div
          className={`font-medium ${
            isPaid ? "text-green-600" : "text-red-600"
          }`}
        >
          {isPaid ? "Paid" : "Pending"}
        </div>
      );
    },
  },
];

// Column definitions for birds table
const birdsColumns: ColumnDef<EventInventoryItemDetail>[] =
  [
    {
      accessorKey: "bird.birdName",
      header: "Bird Name",
      cell: ({ row }) => {
        const birdName = row.original.bird?.birdName || "N/A";
        return <ClickableBirdName bird={row.original} birdName={birdName} />;
      },
    },
    {
      accessorKey: "bird.band",
      header: "Band",
      cell: ({ row }) => {
        const band = row.original.bird?.band;
        return <div>{band || "N/A"}</div>;
      },
    },
    {
      accessorKey: "bird.color",
      header: "Color",
      cell: ({ row }) => {
        const color = row.original.bird?.color;
        return <div>{color || "N/A"}</div>;
      },
    },
    {
      accessorKey: "bird.sex",
      header: "Sex",
      cell: ({ row }) => {
        const sex = row.original.bird?.sex;
        const sexMap: Record<number, string> = {
          0: "Male",
          1: "Female",
        };
        return <div>{sex !== null && sex !== undefined ? sexMap[sex] || "Unknown" : "N/A"}</div>;
      },
    },
    {
      accessorKey: "arrivalTime",
      header: "Arrival Date",
      cell: ({ row }) => {
        const date = row.getValue("arrivalTime") as string;
        return <div>{date ? new Date(date).toLocaleDateString() : "N/A"}</div>;
      },
    },
    {
      accessorKey: "departureDate",
      header: "Departure Date",
      cell: ({ row }) => {
        const date = row.getValue("departureDate") as string;
        return <div>{date ? new Date(date).toLocaleDateString() : "N/A"}</div>;
      },
    },
  ];

export default function EventInventoryDialog({
  id,
  onClose,
}: EventInventoryDialogContentProps) {
  const { data, error, isError, isPending, isSuccess } =
    getEventInventoryItem(parseInt(id));

  const eventInventoryItem: EventInventoryItem = data?.data;

  if (isPending) {
    return (
      <div className="flex items-center justify-center h-32">
        <LoadingSpinner text="Loading inventory..." />
      </div>
    );
  }

  if (isError || !eventInventoryItem) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="text-center">
          <p className="text-lg text-destructive mb-2">Failed to load event inventory</p>
          <p className="text-sm text-muted-foreground">Please try again</p>
        </div>
      </div>
    );
  }

  // Calculate fees and totals from eventInventoryItems
  const calculateFees = () => {
    const fees = {
      perchFee: 0,
      entryFee: 0,
      hotSpotFee: 0,
      classes: 0,
      total: 0,
    };

    eventInventoryItem.eventInventoryItems?.forEach((item) => {
      if (item.perchFeeValue) fees.perchFee += item.perchFeeValue;
      if (item.entryFeeValue) fees.entryFee += item.entryFeeValue;
      if (item.hotSpotFeeValue) fees.hotSpotFee += item.hotSpotFeeValue;
    });

    fees.total = fees.perchFee + fees.entryFee + fees.hotSpotFee + fees.classes;

    return fees;
  };

  const fees = calculateFees();

  // Calculate total payments
  const totalPayments = eventInventoryItem.payments?.reduce(
    (sum, payment) => sum + (payment.paymentValue || 0),
    0
  ) || 0;

  const balance = totalPayments - fees.total;

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
        <div>
          <div className="font-semibold">Event</div>
          <div>{eventInventoryItem.event?.eventName || "N/A"}</div>
          <div className="text-sm text-gray-600">
            {eventInventoryItem.event?.eventDate ? new Date(eventInventoryItem.event.eventDate).toLocaleDateString() : "N/A"}
          </div>
        </div>
        <div>
          <div className="font-semibold">Breeder</div>
          <div>{`${eventInventoryItem.breeder?.firstName || ""} ${eventInventoryItem.breeder?.lastName || ""}`}</div>
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
                {`${eventInventoryItem.breeder?.firstName || ""} ${eventInventoryItem.breeder?.lastName || ""}`}
              </div>
              <div>
                <span className="font-medium">Reserved bird count:</span>{" "}
                {eventInventoryItem.reservedBirds || 0}
              </div>
              <div>
                <span className="font-medium">Loft:</span>{" "}
                {eventInventoryItem.loft || "N/A"}
              </div>
            </div>
          </div>

          {/* Payments Section */}
          <div className="space-y-2">
            <div className="font-semibold">Payments</div>
            <DataTable
              columns={paymentsColumns}
              data={eventInventoryItem.payments || []}
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
                <span>${totalPayments.toFixed(2)}</span>
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
          data={eventInventoryItem.eventInventoryItems || []}
        />
      </div>
    </div>
  );
}
