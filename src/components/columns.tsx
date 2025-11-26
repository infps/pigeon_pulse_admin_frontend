import {
  BirdEventInventory,
  BreederAddressBook,
  Event,
  EventInventory,
  EventInventoryItemDetail,
  Race,
  RaceItem,
  RaceResult,
} from "@/lib/types";
import { ColumnDef } from "@tanstack/react-table";
import React, { useState } from "react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "./ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Pencil, Settings, EllipsisVertical, ArrowUpDown } from "lucide-react";
import { EventUpdateFetch } from "./EventCreateForm";
import BirdUpdateForm from "./BirdUpdateForm";
import EventInventoryDialog from "./EventInventoryDialog";
import { RaceUpdateDialog } from "./RaceUpdateDialog";
import Link from "next/link";

function EventEditDialog({ eventId }: { eventId: number }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Pencil size={20} className="cursor-pointer text-primary" />
      </DialogTrigger>
      <DialogContent className="max-h-[80vh] overflow-y-auto">
        <DialogTitle>Edit Event</DialogTitle>
        <EventUpdateFetch id={String(eventId)} onClose={() => setIsDialogOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}

function EventInventoryEditDialog({
  eventInventoryId,
}: {
  eventInventoryId: number;
}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Pencil size={20} className="cursor-pointer text-primary" />
      </DialogTrigger>
      <DialogContent className="max-h-[80vh] overflow-y-auto">
        <DialogTitle>Event Inventory</DialogTitle>
        <EventInventoryDialog
          id={String(eventInventoryId)}
          onClose={() => setIsDialogOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}

// Wrapper component for clickable event inventory row
function ClickableEventInventoryRow({
  eventInventoryId,
  children,
}: {
  eventInventoryId: number;
  children: React.ReactNode;
}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <div className="cursor-pointer hover:bg-muted/50 transition-colors">
          {children}
        </div>
      </DialogTrigger>
      <DialogContent className="max-h-[80vh] overflow-y-auto">
        <DialogTitle>Event Inventory</DialogTitle>
        <EventInventoryDialog
          id={String(eventInventoryId)}
          onClose={() => setIsDialogOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}

// Wrapper component for clickable event name
function ClickableEventName({
  eventId,
  name,
}: {
  eventId: number;
  name: string;
}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <span className="cursor-pointer text-primary hover:underline">
          {name}
        </span>
      </DialogTrigger>
      <DialogContent className="max-h-[80vh] overflow-y-auto">
        <DialogTitle>Edit Event</DialogTitle>
        <EventUpdateFetch id={String(eventId)} onClose={() => setIsDialogOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}

// Wrapper component for clickable race location
function ClickableRaceLocation({
  raceId,
  location,
}: {
  raceId: number;
  location: string;
}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <span className="cursor-pointer text-primary hover:underline">
          {location}
        </span>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogTitle>Edit Race</DialogTitle>
        <RaceUpdateDialog
          raceId={String(raceId)}
          onClose={() => setIsDialogOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}

export const EventColumns: ColumnDef<Event>[] = [
  {
    accessorKey: "eventName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <ClickableEventName
        eventId={row.original.idEvent}
        name={row.getValue("eventName")}
      />
    ),
  },
  {
    accessorKey: "eventShortName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Short Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => row.getValue("eventShortName"),
  },
  {
    accessorKey: "eventDate",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = row.getValue("eventDate") as string | null;
      if (!date) return "N/A";
      return new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    },
  },
  {
    accessorKey: "isOpen",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const isOpen = row.original.isOpen;
      return isOpen ? "Open" : "Closed";
    },
  },
  {
    accessorKey: "eventType",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Type
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const type = row.getValue("eventType") as number | null;
      return type === 0 ? "AGN" : type === 1 ? "AS" : "N/A";
    },
  },
  {
    accessorKey: "actions",
    header: () => <div className="text-right">Actions</div>,
    cell: ({ row }) => (
      <div className="flex justify-end">
        <EventEditDialog eventId={row.original.idEvent} />
      </div>
    ),
  },
];

export const EventInventoryColumns: ColumnDef<EventInventory>[] = [
  {
    accessorKey: "loft",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Loft
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <ClickableEventInventoryRow eventInventoryId={row.original.idEventInventory}>
        {row.getValue("loft")}
      </ClickableEventInventoryRow>
    ),
  },
  {
    accessorKey: "breeder.firstName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Breeder
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const fullName = `${row.original.breeder?.firstName || ""} ${row.original.breeder?.lastName || ""}`.trim();
      return (
        <ClickableEventInventoryRow eventInventoryId={row.original.idEventInventory}>
          {fullName || "N/A"}
        </ClickableEventInventoryRow>
      );
    },
  },
  {
    accessorKey: "breeder.state1",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          State
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <ClickableEventInventoryRow eventInventoryId={row.original.idEventInventory}>
        {row.original?.breeder?.state1 ? row.original.breeder.state1 : "-"}
      </ClickableEventInventoryRow>
    ),
  },
  {
    accessorKey: "signInDate",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Registration Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = row.original.signInDate;
      const formattedDate = date
        ? new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })
        : "N/A";
      return (
        <ClickableEventInventoryRow eventInventoryId={row.original.idEventInventory}>
          {formattedDate}
        </ClickableEventInventoryRow>
      );
    },
  },

  {
    accessorKey: "reservedBirds",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Reserved Birds
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <ClickableEventInventoryRow eventInventoryId={row.original.idEventInventory}>
        {row.getValue("reservedBirds")}
      </ClickableEventInventoryRow>
    ),
  },
  {
    accessorKey: "payments",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Perch Fees
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const perchFeePayment = row.original.payments?.find(
        (p) => p.paymentType === 0 // PERCH_FEE
      );
      const formattedPayment = perchFeePayment?.paymentValue
        ? `$${perchFeePayment.paymentValue.toFixed(2)}`
        : "N/A";
      return (
        <ClickableEventInventoryRow eventInventoryId={row.original.idEventInventory}>
          {formattedPayment}
        </ClickableEventInventoryRow>
      );
    },
  },
  {
    accessorKey: "isPaid",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Perch Fees paid
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const perchFeePayment = row.original.payments?.find(
        (p) => p.paymentType === 0 // PERCH_FEE
      );
      const isPaid = perchFeePayment?.paymentValue ? true : false; // Simplified check
      return (
        <ClickableEventInventoryRow eventInventoryId={row.original.idEventInventory}>
          <span className={isPaid ? "text-green-500" : "text-red-500"}>
            {isPaid ? "Yes" : "No"}
          </span>
        </ClickableEventInventoryRow>
      );
    },
  },
];

type FeeType = "PERCH_FEE" | "ENTRY_FEE" | "FINAL_FEES";

const feeTypeLabels: Record<FeeType, string> = {
  PERCH_FEE: "Perch Fees",
  ENTRY_FEE: "Entry Fees",
  FINAL_FEES: "HOT SPOT",
};

export const getEventInventoryColumnsForFeeType = (
  feeType: FeeType
): ColumnDef<EventInventory>[] => {
  const feeLabel = feeTypeLabels[feeType];

  return [
    {
      accessorKey: "loft",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Loft
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <ClickableEventInventoryRow eventInventoryId={row.original.idEventInventory}>
          {row.getValue("loft")}
        </ClickableEventInventoryRow>
      ),
    },
    {
      accessorKey: "breeder.firstName",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Breeder
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const fullName = `${row.original.breeder?.firstName || ""} ${row.original.breeder?.lastName || ""}`.trim();
        return (
          <ClickableEventInventoryRow eventInventoryId={row.original.idEventInventory}>
            {fullName}
          </ClickableEventInventoryRow>
        );
      },
    },
    {
      accessorKey: "breeder.state1",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            State
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <ClickableEventInventoryRow eventInventoryId={row.original.idEventInventory}>
          {row.original?.breeder?.state1 ? row.original.breeder.state1 : "-"}
        </ClickableEventInventoryRow>
      ),
    },
    {
      accessorKey: "signInDate",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Registration Date
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const date = row.original.signInDate;
        const formattedDate = date
          ? new Date(date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })
          : "N/A";
        return (
          <ClickableEventInventoryRow eventInventoryId={row.original.idEventInventory}>
            {formattedDate}
          </ClickableEventInventoryRow>
        );
      },
    },
    {
      accessorKey: "reservedBirds",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Reserved Birds
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <ClickableEventInventoryRow eventInventoryId={row.original.idEventInventory}>
          {row.getValue("reservedBirds")}
        </ClickableEventInventoryRow>
      ),
    },
    {
      accessorKey: "payments",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {feeLabel}
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        let totalPayment = 0;

        if (feeType === "FINAL_FEES") {
          // Aggregate all final-related fees (payment types 2,3,4,5,6)
          const finalFeeTypes = [2, 3, 4, 5, 6];
          finalFeeTypes.forEach((type) => {
            const payment = row.original.payments?.find((p) => p.paymentType === type);
            if (payment?.paymentValue) {
              totalPayment += payment.paymentValue;
            }
          });
        } else {
          // Map fee types: PERCH_FEE=0, ENTRY_FEE=1
          const typeMap = { "PERCH_FEE": 0, "ENTRY_FEE": 1 };
          const payment = row.original.payments?.find((p) => p.paymentType === typeMap[feeType]);
          totalPayment = payment?.paymentValue ?? 0;
        }

        const formattedPayment =
          totalPayment > 0 ? `$${totalPayment.toFixed(2)}` : "N/A";
        return (
          <ClickableEventInventoryRow eventInventoryId={row.original.idEventInventory}>
            {formattedPayment}
          </ClickableEventInventoryRow>
        );
      },
    },
    {
      accessorKey: "isPaid",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {`${feeLabel} Status`}
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        let isPaid = false;
        let isPending = false;

        if (feeType === "FINAL_FEES") {
          // Check if all final fees are completed
          const finalFeeTypes = [2, 3, 4, 5, 6];
          const finalPayments = finalFeeTypes
            .map((type) => row.original.payments?.find((p) => p.paymentType === type))
            .filter((p) => p !== undefined);

          if (finalPayments.length > 0) {
            isPaid = finalPayments.every((p) => p?.paymentValue && p.paymentValue > 0);
            isPending = !isPaid && finalPayments.some((p) => p?.paymentValue);
          }
        } else {
          const typeMap = { "PERCH_FEE": 0, "ENTRY_FEE": 1 };
          const payment = row.original.payments?.find((p) => p.paymentType === typeMap[feeType]);
          isPaid = payment?.paymentValue ? payment.paymentValue > 0 : false;
          isPending = false;
        }

        return (
          <ClickableEventInventoryRow eventInventoryId={row.original.idEventInventory}>
            <span
              className={`px-2 py-1 rounded text-xs font-medium ${
                isPaid
                  ? "bg-green-200 text-green-800"
                  : isPending
                  ? "bg-red-200 text-red-800"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              {isPaid ? "Paid" : isPending ? "Not Paid" : "N/A"}
            </span>
          </ClickableEventInventoryRow>
        );
      },
    },
  ];
};

export const BirdEventInventoryColumns: ColumnDef<EventInventoryItemDetail>[] = [
  {
    accessorKey: "bird.breeder",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Breeder
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const breeder = row.original.bird?.breeder;
      if (!breeder) return "N/A";
      return `${breeder.firstName || ""} ${breeder.lastName || ""}`.trim() || "N/A";
    },
  },
  {
    accessorKey: "bird.birdName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Bird Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => row.original.bird?.birdName || "N/A",
  },
  {
    accessorKey: "birdNo",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Bird No
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => row.original.birdNo || "N/A",
  },
  {
    accessorKey: "bird.band1",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Ascc
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => row.original.bird?.band1 || "N/A",
  },
  {
    accessorKey: "bird.band2",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Year
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => row.original.bird?.band2 || "N/A",
  },
  {
    accessorKey: "bird.band3",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Letter
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => row.original.bird?.band3 || "N/A",
  },
  {
    accessorKey: "bird.band4",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Number
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => row.original.bird?.band4 || "N/A",
  },
  {
    accessorKey: "bird.band",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Full Band
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => row.original.bird?.band || "N/A",
  },
  {
    accessorKey: "bird.color",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Color
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => row.original.bird?.color || "N/A",
  },
  {
    accessorKey: "bird.sex",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Sex
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const sex = row.original.bird?.sex;
      const sexMap: Record<number, string> = {
        0: "N/A",
        1: "Cock",
        2: "Hen",
      };
      return sex !== null && sex !== undefined ? sexMap[sex] || "Unknown" : "N/A";
    },
  },
  {
    accessorKey: "bird.isActive",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Active
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (row.original.bird?.isActive ? "Yes" : "No"),
  },
  {
    accessorKey: "bird.isLost",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Lost
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (row.original.bird?.isLost ? "Yes" : "No"),
  },
  {
    accessorKey: "bird.lostDate",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Lost Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = row.original.bird?.lostDate;
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
    accessorKey: "bird.rfId",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          RFID
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => row.original.bird?.rfId || "N/A",
  },
  {
    accessorKey: "arrivalTime",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Arrival Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = row.original.arrivalTime;
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
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Return to Breeder
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
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
    accessorKey: "isBackup",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Backup
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (row.original.isBackup ? "Yes" : "No"),
  },
  {
    accessorKey: "entryFeePaid",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Entry Fee Paid
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (row.original.entryFeePaid ? "Yes" : "No"),
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
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
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
    accessorKey: "raceNumber",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Race #
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "type",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Type
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <ClickableRaceLocation
        raceId={row.original.idRace}
        location={row.getValue("type")}
      />
    ),
  },
  {
    accessorKey: "location",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Location
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <ClickableRaceLocation
        raceId={row.original.idRace}
        location={row.getValue("location") as string}
      />
    ),
  },
  {
    accessorKey: "distance",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Distance
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "startTime",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Start Time
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
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
    accessorKey: "stats.totalBirds",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Birds in Race
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => row.original.stats?.totalBirds || 0,
  },
  {
    accessorKey: "stats.basketed",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Basketed
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => row.original.stats?.basketed || 0,
  },
  {
    accessorKey: "stats.arrived",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Arrived
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => row.original.stats?.arrived || 0,
  },
  {
    accessorKey: "stats.notArrived",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Not Arrived
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => row.original.stats?.notArrived || 0,
  },
  {
    accessorKey: "stats.lost",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Lost
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => row.original.stats?.lost || 0,
  },
  {
    accessorKey: "isClosed",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (row.original.isClosed ? "Closed" : "Open"),
  },
  {
    accessorKey: "actions",
    header: () => <div className="text-right">Actions</div>,
    cell: ({ row }) => {
      const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

      return (
        <div className="flex justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <EllipsisVertical
                size={20}
                className="cursor-pointer text-primary"
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onSelect={() => setIsEditDialogOpen(true)}>
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  href={`/races/${row.original.idRace}/entries`}
                  className="w-full"
                >
                  Entries
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  href={`/races/${row.original.idRace}/results`}
                  className="w-full"
                >
                  Results
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogTitle>Edit Race</DialogTitle>
              <RaceUpdateDialog
                raceId={String(row.original.idRace)}
                onClose={() => setIsEditDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>
      );
    },
  },
];

export const RaceItemColumns: ColumnDef<RaceItem>[] = [
  {
    accessorKey: "eventInventoryItem.bird.breeder",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Breeder
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const breeder = row.original.inventoryItem?.bird?.breeder;
      if (!breeder) return "N/A";
      return `${breeder.firstName || ""} ${breeder.lastName || ""}`.trim() || "N/A";
    },
  },
  {
    accessorKey: "inventoryItem.bird.birdName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Bird Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "inventoryItem.bird.band",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Band
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => row.original.inventoryItem?.bird?.band || "N/A",
  },
  {
    accessorKey: "inventoryItem.bird.rfId",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          RFID
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => row.original.inventoryItem?.bird?.rfId || "N/A",
  },
  {
    accessorKey: "inventoryItem.bird.color",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Color
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "inventoryItem.bird.isLost",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Lost
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) =>
      row.original.inventoryItem?.bird?.isLost ? "Yes" : "No",
  },
  {
    accessorKey: "isDistBasketted",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Loft Basketed
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (row.original.isDistBasketted ? "Yes" : "No"),
  },
  {
    accessorKey: "raceBasket",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Race Basketed
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (row.original.raceBasket ? "Yes" : "No"),
  },
  {
    accessorKey: "raceBasketTime",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Basket Time
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
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
    accessorKey: "inventoryItem.bird.breeder",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Breeder
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const breeder = row.original.inventoryItem?.bird?.breeder;
      if (!breeder) return "N/A";
      return `${breeder.firstName || ""} ${breeder.lastName || ""}`.trim() || "N/A";
    },
  },
  {
    accessorKey: "inventoryItem.bird.birdName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Bird
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "inventoryItem.bird.band",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Band
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "inventoryItem.bird.rfId",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          RFID
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "inventoryItem.bird.color",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Color
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "raceItemResult.speed",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Speed
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return "N/A"; // Speed not in schema
    },
  },
  {
    accessorKey: "raceItemResult.arrivalTime",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Arrival Time
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
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
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Distance
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return "N/A"; // Distance not in RaceItemResult schema
    },
  },
];

export const BreederAddressBookColumns: ColumnDef<BreederAddressBook>[] = [
  {
    header: "Sl. No.",
    cell: ({ row }) => row.index + 1,
  },
  {
    accessorKey: "number",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Breeder #
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const fullName = `${row.original.firstName || ""} ${row.original.lastName || ""}`.trim();
      return fullName || "N/A";
    },
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => row.getValue("email") || "N/A",
  },
  {
    accessorKey: "email2",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Alternative Email
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => row.getValue("email2") || "N/A",
  },
  {
    accessorKey: "phone",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Phone
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => row.getValue("phone") || "N/A",
  },
  {
    accessorKey: "cell",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Cell Phone
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => row.getValue("cell") || "N/A",
  },
  {
    accessorKey: "fax",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Fax
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => row.getValue("fax") || "N/A",
  },
  {
    accessorKey: "sms",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          SMS
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => row.getValue("sms") || "N/A",
  },
  {
    accessorKey: "country",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Country
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => row.getValue("country") || "N/A",
  },
  {
    accessorKey: "isDefaultAddress1",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Default Address
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (row.getValue("isDefaultAddress1") ? "Address 1" : "Address 2"),
  },
  {
    accessorKey: "address1",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Address 1
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => row.getValue("address1") || "N/A",
  },
  {
    accessorKey: "city1",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          City 1
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => row.getValue("city1") || "N/A",
  },
  {
    accessorKey: "state1",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          State 1
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => row.getValue("state1") || "N/A",
  },
  {
    accessorKey: "zip1",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Zip 1
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => row.getValue("zip1") || "N/A",
  },
  {
    accessorKey: "address2",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Address 2
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => row.getValue("address2") || "N/A",
  },
  {
    accessorKey: "city2",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          City 2
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => row.getValue("city2") || "N/A",
  },
  {
    accessorKey: "state2",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          State 2
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => row.getValue("state2") || "N/A",
  },
  {
    accessorKey: "zip2",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Zip 2
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => row.getValue("zip2") || "N/A",
  },
  {
    accessorKey: "webAddress",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Website
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => row.getValue("webAddress") || "N/A",
  },
  {
    accessorKey: "socialSecurityNumber",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          SSN
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => row.getValue("socialSecurityNumber") || "N/A",
  },
  {
    accessorKey: "taxNumber",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Tax Number
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => row.getValue("taxNumber") || "N/A",
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const status = row.getValue("status") as number | null;
      const statusText = status === 0 ? "ACTIVE" : status === 1 ? "INACTIVE" : "PROSPECT";
      return (
        <span
          className={`px-2 py-1 rounded text-xs font-medium ${
            status === 0
              ? "bg-green-200 text-green-800"
              : status === 1
              ? "bg-red-200 text-red-800"
              : "bg-yellow-200 text-yellow-800"
          }`}
        >
          {statusText}
        </span>
      );
    },
  },
  {
    accessorKey: "statusDate",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Status Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = row.getValue("statusDate") as string | null;
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
    accessorKey: "loginName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Login Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => row.getValue("loginName") || "N/A",
  },
  {
    accessorKey: "defNameAgn",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Default Name AGN
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => row.getValue("defNameAgn") || "N/A",
  },
  {
    accessorKey: "defNameAs",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Default Name AS
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => row.getValue("defNameAs") || "N/A",
  },
  {
    accessorKey: "note",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Note
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => row.getValue("note") || "N/A",
  }
];
