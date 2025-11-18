"use client";
import { getEventInventoryColumnsForFeeType } from "@/components/columns";
import { DataTable } from "@/components/data-table";
import EventInventoryDialog from "@/components/EventInventoryDialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { SelectSkeleton, TableSkeleton, SearchSkeleton } from "@/components/loading-skeletons";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDebounce } from "@/hooks/useDebounce";
import { getEventInventory } from "@/lib/api/eventInventory";
import { useListEvents } from "@/lib/api/events";
import { useGetBreeders } from "@/lib/api/user";
import { Breeders, Event, EventInventory, EventInventoryPayment } from "@/lib/types";
import { useQueryState } from "nuqs";
import { useMemo, useState } from "react";

export default function EventInventoryPage() {
  const [eventId, setEventId] = useQueryState("eventId", {
    defaultValue: "",
  });
  const { data, error, isError, isPending } = useListEvents();
  
  if (isPending) {
    return (
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">Event Inventory</h2>
        <div className="flex items-center justify-between gap-2">
          <SelectSkeleton />
          <SearchSkeleton />
        </div>
        <div className="mt-4">
          <TableSkeleton rows={6} columns={4} />
        </div>
      </div>
    );
  }
  
  if (isError) {
    return (
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">Event Inventory</h2>
        <div className="flex h-96 w-full items-center justify-center">
          <div className="text-center">
            <p className="text-lg text-destructive mb-2">Failed to load events</p>
            <p className="text-sm text-muted-foreground">{error.message}</p>
          </div>
        </div>
      </div>
    );
  }
  
  if (!data || data.length === 0) {
    return (
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">Event Inventory</h2>
        <div className="flex h-96 w-full items-center justify-center">
          <p className="text-lg text-muted-foreground">No events found.</p>
        </div>
      </div>
    );
  }
  
  const events: Event[] = data.data.events || [];
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Event Inventory</h2>
      
      {/* Event Selection Dropdown - Always visible */}
      <div className="mb-4">
        <Label htmlFor="main-event-select">Select Event</Label>
        <Select
          onValueChange={(e) => {
            if (e === "all") {
              setEventId("");
            } else {
              setEventId(e);
            }
          }}
          value={eventId}
        >
          <SelectTrigger className="w-[300px] mt-2" id="main-event-select">
            <SelectValue placeholder="Select an event" />
          </SelectTrigger>
          <SelectContent>
            {events.map((event) => (
              <SelectItem
                key={event.id}
                value={event.id}
              >
                {event.name} ({event.shortName})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {eventId ? (
        <div className="mt-4">
          <EventInventoryTable events={events} />
        </div>
      ) : (
        <div className="mt-4">
          <p className="text-gray-500">
            Select an event to view its inventory.
          </p>
        </div>
      )}
    </div>
  );
}

type FeeType = "PERCH_FEE" | "ENTRY_FEE" | "FINAL_FEES";

function EventInventoryTable({ events }: { events: Event[] }) {
  const [eventId, setEventId] = useQueryState("eventId", {
    defaultValue: "",
  });
  const [selectedBreeder, setSelectedBreeder] = useState<string>("all");
  const [paymentStatus, setPaymentStatus] = useState<string>("all");
  const [feeView, setFeeView] = useState<FeeType>("PERCH_FEE");
  const [showBirds, setShowBirds] = useState(false);
  const [showNote, setShowNote] = useState(false);
  const [showPartners, setShowPartners] = useState(false);
  const [showOnlyRefunds, setShowOnlyRefunds] = useState(false);

  const { data, error, isError, isPending } = getEventInventory(eventId, {});
  
  const inventory: EventInventory[] = data?.data || [];

  // Get unique breeders from inventory
  const breeders = useMemo(() => {
    const uniqueBreeders = inventory.map(inv => ({
      id: inv.breederId,
      name: `${inv.breeder.firstName} ${inv.breeder.lastName}`.trim()
    }));
    
    // Remove duplicates
    const seen = new Set();
    return uniqueBreeders.filter(breeder => {
      const duplicate = seen.has(breeder.id);
      seen.add(breeder.id);
      return !duplicate;
    });
  }, [inventory]);

  // Filter inventory based on selected filters
  const filteredInventory = useMemo(() => {
    return inventory.filter(inv => {
      // Filter by breeder
      if (selectedBreeder !== "all" && inv.breederId !== selectedBreeder) {
        return false;
      }

      // Filter by payment status
      if (paymentStatus !== "all") {
        if (feeView === "FINAL_FEES") {
          // For final fees, check if ANY of the hotspot or final race fees match the status
          const finalPayments = inv.payments.filter(p => 
            p.type === "HOTSPOT_FEE_1" || 
            p.type === "HOTSPOT_FEE_2" || 
            p.type === "HOTSPOT_FEE_3" || 
            p.type === "HOTSPOT_FEE_4" ||
            p.type === "FINAL_RACE_FEE"
          );
          
          if (paymentStatus === "paid") {
            // Show if all final payments are completed
            const allPaid = finalPayments.every(p => p.status === "COMPLETED");
            if (!allPaid) return false;
          } else if (paymentStatus === "pending") {
            // Show if any final payment is not completed
            const anyPending = finalPayments.some(p => p.status !== "COMPLETED");
            if (!anyPending) return false;
          }
        } else {
          const payment = inv.payments.find(p => p.type === feeView);
          if (paymentStatus === "paid" && payment?.status !== "COMPLETED") {
            return false;
          }
          if (paymentStatus === "pending" && payment?.status === "COMPLETED") {
            return false;
          }
        }
      }

      return true;
    });
  }, [inventory, selectedBreeder, paymentStatus, feeView]);

  // Calculate summary statistics
  const summary = useMemo(() => {
    const stats = {
      totalBirdsRegistered: 0,
      totalPerchFees: 0,
      totalPerchFeesDue: 0,
      totalEntryFees: 0,
      totalEntryFeesDue: 0,
      totalFinalFees: 0,
      totalFinalFeesDue: 0,
    };

    filteredInventory.forEach(inv => {
      // Count birds registered
      stats.totalBirdsRegistered += inv.reservedBirds;

      // Perch Fees
      const perchFee = inv.payments.find(p => p.type === "PERCH_FEE");
      if (perchFee) {
        stats.totalPerchFees += perchFee.paymentValue;
        if (perchFee.status !== "COMPLETED") {
          stats.totalPerchFeesDue += perchFee.paymentValue;
        }
      }

      // Entry Fees
      const entryFee = inv.payments.find(p => p.type === "ENTRY_FEE");
      if (entryFee) {
        stats.totalEntryFees += entryFee.paymentValue;
        if (entryFee.status !== "COMPLETED") {
          stats.totalEntryFeesDue += entryFee.paymentValue;
        }
      }

      // Final Fees (Aggregate of Hotspot 1, 2, 3, 4 and Final Race)
      const finalFeeTypes = ["HOTSPOT_FEE_1", "HOTSPOT_FEE_2", "HOTSPOT_FEE_3", "HOTSPOT_FEE_4", "FINAL_RACE_FEE"];
      finalFeeTypes.forEach(feeType => {
        const fee = inv.payments.find(p => p.type === feeType);
        if (fee) {
          stats.totalFinalFees += fee.paymentValue;
          if (fee.status !== "COMPLETED") {
            stats.totalFinalFeesDue += fee.paymentValue;
          }
        }
      });
    });

    return stats;
  }, [filteredInventory]);
  
  if (isPending) {
    return <TableSkeleton rows={6} columns={6} />;
  }
  
  if (isError) {
    return (
      <div className="flex h-96 w-full items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-destructive mb-2">Failed to load event inventory</p>
          <p className="text-sm text-muted-foreground">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filters Section */}
      <div className="bg-gray-50 p-4 rounded-lg border">
        <h3 className="font-semibold mb-3">Filters</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Event Filter */}
          <div>
            <Label htmlFor="event-select">Event</Label>
            <Select
              onValueChange={(e) => {
                if (e === "all") {
                  setEventId("");
                } else {
                  setEventId(e);
                }
              }}
              value={eventId}
            >
              <SelectTrigger className="w-full mt-2" id="event-select">
                <SelectValue placeholder="Select an event" />
              </SelectTrigger>
              <SelectContent>
                {events.map((event) => (
                  <SelectItem
                    key={event.id}
                    value={event.id}
                  >
                    {event.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* View (Fee Type) Filter */}
          <div>
            <Label htmlFor="fee-view">View</Label>
            <Select
              onValueChange={(value) => setFeeView(value as FeeType)}
              value={feeView}
            >
              <SelectTrigger className="w-full mt-2" id="fee-view">
                <SelectValue placeholder="Select fee type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PERCH_FEE">Perch Fees</SelectItem>
                <SelectItem value="ENTRY_FEE">Entry Fees</SelectItem>
                <SelectItem value="FINAL_FEES">HOT SPOT</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Loft (Breeder) Filter */}
          <div>
            <Label htmlFor="breeder-select">Breeder</Label>
            <Select
              onValueChange={(value) => setSelectedBreeder(value)}
              value={selectedBreeder}
            >
              <SelectTrigger className="w-full mt-2" id="breeder-select">
                <SelectValue placeholder="Select breeder" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Breeders</SelectItem>
                {breeders.map((breeder) => (
                  <SelectItem key={breeder.id} value={breeder.id}>
                    {breeder.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Payment Status Filter */}
          <div>
            <Label htmlFor="payment-status">Payment status</Label>
            <Select
              onValueChange={(value) => setPaymentStatus(value)}
              value={paymentStatus}
            >
              <SelectTrigger className="w-full mt-2" id="payment-status">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Checkboxes */}
        {/* <div className="flex flex-wrap gap-4 mt-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="show-birds"
              checked={showBirds}
              onCheckedChange={(checked) => setShowBirds(checked as boolean)}
            />
            <Label htmlFor="show-birds" className="cursor-pointer">
              Show birds
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="show-note"
              checked={showNote}
              onCheckedChange={(checked) => setShowNote(checked as boolean)}
            />
            <Label htmlFor="show-note" className="cursor-pointer">
              Show note
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="show-partners"
              checked={showPartners}
              onCheckedChange={(checked) => setShowPartners(checked as boolean)}
            />
            <Label htmlFor="show-partners" className="cursor-pointer">
              Show partners
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="show-refunds"
              checked={showOnlyRefunds}
              onCheckedChange={(checked) => setShowOnlyRefunds(checked as boolean)}
            />
            <Label htmlFor="show-refunds" className="cursor-pointer">
              Show only refunds
            </Label>
          </div>
        </div> */}
      </div>

      {/* Payment Status Legend */}
      {/* <div className="flex items-center gap-4 bg-gray-50 p-3 rounded-lg border">
        <span className="font-semibold">Payment status legend</span>
        <div className="flex items-center gap-2">
          <div className="w-20 h-6 bg-green-200 rounded flex items-center justify-center text-xs">
            Paid
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-28 h-6 bg-yellow-200 rounded flex items-center justify-center text-xs">
            Partial payment
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-20 h-6 bg-red-200 rounded flex items-center justify-center text-xs">
            Not paid
          </div>
        </div>
      </div> */}

      {/* Summary Section */}
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <h3 className="font-semibold mb-3">Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4">
          <div className="bg-white p-3 rounded shadow-sm">
            <p className="text-xs text-gray-600">Birds Registered</p>
            <p className="text-lg font-bold text-blue-600">
              {summary.totalBirdsRegistered}
            </p>
          </div>
          <div className="bg-white p-3 rounded shadow-sm">
            <p className="text-xs text-gray-600">Total Perch Fees</p>
            <p className="text-lg font-bold text-green-600">
              ${summary.totalPerchFees.toFixed(2)}
            </p>
          </div>
          <div className="bg-white p-3 rounded shadow-sm">
            <p className="text-xs text-gray-600">Perch Fees Due</p>
            <p className="text-lg font-bold text-red-600">
              ${summary.totalPerchFeesDue.toFixed(2)}
            </p>
          </div>
          <div className="bg-white p-3 rounded shadow-sm">
            <p className="text-xs text-gray-600">Total Entry Fees</p>
            <p className="text-lg font-bold text-green-600">
              ${summary.totalEntryFees.toFixed(2)}
            </p>
          </div>
          <div className="bg-white p-3 rounded shadow-sm">
            <p className="text-xs text-gray-600">Entry Fees Due</p>
            <p className="text-lg font-bold text-red-600">
              ${summary.totalEntryFeesDue.toFixed(2)}
            </p>
          </div>
          <div className="bg-white p-3 rounded shadow-sm">
            <p className="text-xs text-gray-600">Total HOT SPOT</p>
            <p className="text-lg font-bold text-green-600">
              ${summary.totalFinalFees.toFixed(2)}
            </p>
          </div>
          <div className="bg-white p-3 rounded shadow-sm">
            <p className="text-xs text-gray-600">HOT SPOT Due</p>
            <p className="text-lg font-bold text-red-600">
              ${summary.totalFinalFeesDue.toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <DataTable columns={getEventInventoryColumnsForFeeType(feeView)} data={filteredInventory} />
    </div>
  );
}
