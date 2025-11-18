import {
  BirdEventInventory,
  BreederAddressBook,
  Event,
  EventInventory,
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
import { Pencil, Settings, EllipsisVertical } from "lucide-react";
import { EventUpdateFetch } from "./EventCreateForm";
import BirdUpdateForm from "./BirdUpdateForm";
import EventInventoryDialog from "./EventInventoryDialog";
import { RaceUpdateDialog } from "./RaceUpdateDialog";
import Link from "next/link";

function EventEditDialog({ eventId }: { eventId: string }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Pencil size={20} className="cursor-pointer text-primary" />
      </DialogTrigger>
      <DialogContent className="max-h-[80vh] overflow-y-auto">
        <DialogTitle>Edit Event</DialogTitle>
        <EventUpdateFetch id={eventId} onClose={() => setIsDialogOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}

function EventInventoryEditDialog({
  eventInventoryId,
}: {
  eventInventoryId: string;
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
          id={eventInventoryId}
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
  eventInventoryId: string;
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
          id={eventInventoryId}
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
  eventId: string;
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
        <EventUpdateFetch id={eventId} onClose={() => setIsDialogOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}

// Wrapper component for clickable race location
function ClickableRaceLocation({
  raceId,
  location,
}: {
  raceId: string;
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
          raceId={raceId}
          onClose={() => setIsDialogOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}

export const EventColumns: ColumnDef<Event>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <ClickableEventName
        eventId={row.original.id}
        name={row.getValue("name")}
      />
    ),
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
    cell: ({ row }) => {
      const isOpen = row.original.isOpen;
      return isOpen ? "Open" : "Closed";
    },
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
        <EventEditDialog eventId={row.original.id} />
      </div>
    ),
  },
];

export const EventInventoryColumns: ColumnDef<EventInventory>[] = [
  {
    accessorKey: "loft",
    header: "Loft",
    cell: ({ row }) => (
      <ClickableEventInventoryRow eventInventoryId={row.original.id}>
        {row.getValue("loft")}
      </ClickableEventInventoryRow>
    ),
  },
  {
    accessorKey: "breeder.firstName",
    header: "Breeder",
    cell: ({ row }) => {
      const fullName = `${row.original.breeder.firstName} ${row.original.breeder.lastName}`;
      return (
        <ClickableEventInventoryRow eventInventoryId={row.original.id}>
          {fullName}
        </ClickableEventInventoryRow>
      );
    },
  },
  {
    accessorKey: "breeder.state1",
    header: "State",
    cell: ({ row }) => (
      <ClickableEventInventoryRow eventInventoryId={row.original.id}>
        {row.original?.breeder.state1 ? row.original.breeder.state1 : "-"}
      </ClickableEventInventoryRow>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Registration Date",
    cell: ({ row }) => {
      const date = row.original.createdAt;
      const formattedDate = date
        ? new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })
        : "N/A";
      return (
        <ClickableEventInventoryRow eventInventoryId={row.original.id}>
          {formattedDate}
        </ClickableEventInventoryRow>
      );
    },
  },

  {
    accessorKey: "reservedBirds",
    header: "Reserved Birds",
    cell: ({ row }) => (
      <ClickableEventInventoryRow eventInventoryId={row.original.id}>
        {row.getValue("reservedBirds")}
      </ClickableEventInventoryRow>
    ),
  },
  {
    accessorKey: "payment.paymentValue",
    header: "Perch Fees",
    cell: ({ row }) => {
      const perchFeePayment = row.original.payments.find(
        (p) => p.type === "PERCH_FEE"
      );
      const formattedPayment = perchFeePayment
        ? `$${perchFeePayment.paymentValue.toFixed(2)}`
        : "N/A";
      return (
        <ClickableEventInventoryRow eventInventoryId={row.original.id}>
          {formattedPayment}
        </ClickableEventInventoryRow>
      );
    },
  },
  {
    accessorKey: "isPaid",
    header: "Perch Fees paid",
    cell: ({ row }) => {
      const perchFeePayment = row.original.payments.find(
        (p) => p.type === "PERCH_FEE"
      );
      const isPaid = perchFeePayment?.status === "COMPLETED";
      return (
        <ClickableEventInventoryRow eventInventoryId={row.original.id}>
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
      header: "Loft",
      cell: ({ row }) => (
        <ClickableEventInventoryRow eventInventoryId={row.original.id}>
          {row.getValue("loft")}
        </ClickableEventInventoryRow>
      ),
    },
    {
      accessorKey: "breeder.firstName",
      header: "Breeder",
      cell: ({ row }) => {
        const fullName = `${row.original.breeder.firstName} ${row.original.breeder.lastName}`;
        return (
          <ClickableEventInventoryRow eventInventoryId={row.original.id}>
            {fullName}
          </ClickableEventInventoryRow>
        );
      },
    },
    {
      accessorKey: "breeder.state1",
      header: "State",
      cell: ({ row }) => (
        <ClickableEventInventoryRow eventInventoryId={row.original.id}>
          {row.original?.breeder.state1 ? row.original.breeder.state1 : "-"}
        </ClickableEventInventoryRow>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Registration Date",
      cell: ({ row }) => {
        const date = row.original.createdAt;
        const formattedDate = date
          ? new Date(date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })
          : "N/A";
        return (
          <ClickableEventInventoryRow eventInventoryId={row.original.id}>
            {formattedDate}
          </ClickableEventInventoryRow>
        );
      },
    },
    {
      accessorKey: "reservedBirds",
      header: "Reserved Birds",
      cell: ({ row }) => (
        <ClickableEventInventoryRow eventInventoryId={row.original.id}>
          {row.getValue("reservedBirds")}
        </ClickableEventInventoryRow>
      ),
    },
    {
      accessorKey: "payment.paymentValue",
      header: feeLabel,
      cell: ({ row }) => {
        let totalPayment = 0;

        if (feeType === "FINAL_FEES") {
          // Aggregate all final-related fees
          const finalFeeTypes = [
            "HOTSPOT_FEE_1",
            "HOTSPOT_FEE_2",
            "HOTSPOT_FEE_3",
            "HOTSPOT_FEE_4",
            "FINAL_RACE_FEE",
          ];
          finalFeeTypes.forEach((type) => {
            const payment = row.original.payments.find((p) => p.type === type);
            if (payment) {
              totalPayment += payment.paymentValue;
            }
          });
        } else {
          const payment = row.original.payments.find((p) => p.type === feeType);
          totalPayment = payment ? payment.paymentValue : 0;
        }

        const formattedPayment =
          totalPayment > 0 ? `$${totalPayment.toFixed(2)}` : "N/A";
        return (
          <ClickableEventInventoryRow eventInventoryId={row.original.id}>
            {formattedPayment}
          </ClickableEventInventoryRow>
        );
      },
    },
    {
      accessorKey: "isPaid",
      header: `${feeLabel} Status`,
      cell: ({ row }) => {
        let isPaid = false;
        let isPending = false;

        if (feeType === "FINAL_FEES") {
          // Check if all final fees are completed
          const finalFeeTypes = [
            "HOTSPOT_FEE_1",
            "HOTSPOT_FEE_2",
            "HOTSPOT_FEE_3",
            "HOTSPOT_FEE_4",
            "FINAL_RACE_FEE",
          ];
          const finalPayments = finalFeeTypes
            .map((type) => row.original.payments.find((p) => p.type === type))
            .filter((p) => p !== undefined);

          if (finalPayments.length > 0) {
            isPaid = finalPayments.every((p) => p.status === "COMPLETED");
            isPending = finalPayments.some((p) => p.status !== "COMPLETED");
          }
        } else {
          const payment = row.original.payments.find((p) => p.type === feeType);
          isPaid = payment?.status === "COMPLETED" || false;
          isPending = payment?.status === "PENDING" || false;
        }

        return (
          <ClickableEventInventoryRow eventInventoryId={row.original.id}>
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

export const BirdEventInventoryColumns: ColumnDef<BirdEventInventory>[] = [
  {
    accessorKey: "bird.breeder",
    header: "Breeder",
    cell: ({ row }) => {
      const breeder = row.original.bird.breeder;
      return `${breeder.firstName} ${breeder.lastName}`;
    },
  },
  {
    accessorKey: "bird.birdName",
    header: "Bird Name",
  },
  {
    accessorKey: "birdNo",
    header: "Bird No",
    cell: ({ row }) => row.original.birdNo || "N/A",
  },
  {
    accessorKey: "bird.band1",
    header: "Ascc",
    cell: ({ row }) => row.original.bird.band1 || "N/A",
  },
  {
    accessorKey: "bird.band2",
    header: "Year",
    cell: ({ row }) => row.original.bird.band2 || "N/A",
  },
  {
    accessorKey: "bird.band3",
    header: "Letter",
    cell: ({ row }) => row.original.bird.band3 || "N/A",
  },
  {
    accessorKey: "bird.band4",
    header: "Number",
    cell: ({ row }) => row.original.bird.band4 || "N/A",
  },
  {
    accessorKey: "bird.band",
    header: "Full Band",
    cell: ({ row }) => row.original.bird.band || "N/A",
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
    accessorKey: "bird.isActive",
    header: "Active",
    cell: ({ row }) => (row.original.bird.isActive ? "Yes" : "No"),
  },
  {
    accessorKey: "bird.isLost",
    header: "Lost",
    cell: ({ row }) => (row.original.bird.isLost ? "Yes" : "No"),
  },
  {
    accessorKey: "bird.lostDate",
    header: "Lost Date",
    cell: ({ row }) => {
      const date = row.original.bird.lostDate;
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
    header: "RFID",
    cell: ({ row }) => row.original.bird.rfId || "N/A",
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
    accessorKey: "isBackup",
    header: "Backup",
    cell: ({ row }) => (row.original.isBackup ? "Yes" : "No"),
  },
  {
    accessorKey: "entryFeePaid",
    header: "Entry Fee Paid",
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
    header: "Race Number",
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => (
      <ClickableRaceLocation
        raceId={row.original.id}
        location={row.getValue("type")}
      />
    ),
  },
  {
    accessorKey: "location",
    header: "Location",
    cell: ({ row }) => (
      <ClickableRaceLocation
        raceId={row.original.id}
        location={row.getValue("location")}
      />
    ),
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

          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogTitle>Edit Race</DialogTitle>
              <RaceUpdateDialog
                raceId={row.original.id}
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
    header: "Breeder",
    cell: ({ row }) => {
      const breeder = row.original.eventInventoryItem.bird.breeder;
      return `${breeder.firstName} ${breeder.lastName}`;
    },
  },
  {
    accessorKey: "eventInventoryItem.bird.birdName",
    header: "Bird Name",
  },
  {
    accessorKey: "eventInventoryItem.bird.band",
    header: "Band",
    cell: ({ row }) => row.original.eventInventoryItem.bird.band || "N/A",
  },
  {
    accessorKey: "eventInventoryItem.bird.rfId",
    header: "RFID",
    cell: ({ row }) => row.original.eventInventoryItem.bird.rfId || "N/A",
  },
  {
    accessorKey: "eventInventoryItem.bird.color",
    header: "Color",
  },
  {
    accessorKey: "eventInventoryItem.bird.isLost",
    header: "Lost",
    cell: ({ row }) =>
      row.original.eventInventoryItem.bird.isLost ? "Yes" : "No",
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

export const BreederAddressBookColumns: ColumnDef<BreederAddressBook>[] = [
  {
    header: "Sl. No.",
    cell: ({ row }) => row.index + 1,
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
    accessorKey: "primaryPhone",
    header: "Phone",
  },
  {
    accessorKey: "address",
    header: "Address",
  },
  {
    accessorKey: "city",
    header: "City",
  },
  {
    accessorKey: "state",
    header: "State",
  },
  {
    accessorKey: "zip",
    header: "Zip",
  },
  {
    accessorKey: "country",
    header: "Country",
  },
  {
    accessorKey: "ssn",
    header: "SSN",
  },
  {
    accessorKey: "taxNumber",
    header: "Tax Number",
  },
  {
    accessorKey: "cellPhone",
    header: "Cell Phone",
  },
  {
    accessorKey: "role",
    header: "Role",
  },
  {
    accessorKey: "alternativeEmail",
    header: "Alternative Email",
  },
];
