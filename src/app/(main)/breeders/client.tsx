"use client";

import { useState } from "react";
import { BreederAddressBookColumns, EventColumns } from "@/components/columns";
import { DataTable } from "@/components/data-table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TableSkeleton } from "@/components/loading-skeletons";
import { useDebounce } from "@/hooks/useDebounce";
import { useGetBreederAddressBook } from "@/lib/api/user";
import { useListEvents } from "@/lib/api/events";
import { BreederAddressBook, Event } from "@/lib/types";
import { useQueryState } from "nuqs";
import { BreederUpdateDialog } from "@/components/BreederUpdateDialog";
import { BreederCreateDialog } from "@/components/BreederCreateDialog";
import { Plus, Download, Printer } from "lucide-react";
import jsPDF from "jspdf";

export default function BreedersTable() {
  const [q, setQ] = useQueryState("q", {
    defaultValue: "",
  });
  const [searchField, setSearchField] = useQueryState("searchField", {
    defaultValue: "idBreeder",
  });
  const [eventId, setEventId] = useQueryState("eventId", {
    defaultValue: "",
  });
  const [status, setStatus] = useQueryState("status", {
    defaultValue: "",
  });
  const [selectedBreederId, setSelectedBreederId] = useState<number | null>(null);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [copiedBreederData, setCopiedBreederData] = useState<BreederAddressBook | null>(null);

  const debouncedSearchTerm = useDebounce(q, 300);
  const { data, error, isError, isPending, isSuccess } =
    useGetBreederAddressBook({
      ...(debouncedSearchTerm ? { q: debouncedSearchTerm } : {}),
      ...(searchField ? { searchField } : {}),
      ...(eventId ? { eventId } : {}),
      ...(status ? { status } : {}),
    });
  
  if (isPending) {
    return <TableSkeleton rows={8} columns={5} />;
  }
  
  if (isError) {
    return (
      <div className="flex h-96 w-full items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-destructive mb-2">Failed to load breeders</p>
          <p className="text-sm text-muted-foreground">{error.message}</p>
        </div>
      </div>
    );
  }
  
  const breeders: BreederAddressBook[] = data?.data || [];

  const handleRowClick = (breeder: BreederAddressBook) => {
    setSelectedBreederId(breeder.idBreeder);
    setIsUpdateDialogOpen(true);
  };

  const handleAddNewBreeder = () => {
    setCopiedBreederData(null);
    setIsCreateDialogOpen(true);
  };

  const handleCopyBreeder = (breeder: BreederAddressBook) => {
    setCopiedBreederData(breeder);
    setIsUpdateDialogOpen(false);
    setIsCreateDialogOpen(true);
  };

  const handleExportCSV = () => {
    if (!breeders || breeders.length === 0) {
      return;
    }

    // Define CSV headers
    const headers = [
      "ID",
      "Number",
      "First Name",
      "Last Name",
      "Country",
      "Address 1",
      "City 1",
      "State 1",
      "ZIP 1",
      "Address 2",
      "City 2",
      "State 2",
      "ZIP 2",
      "Phone",
      "Cell",
      "Fax",
      "Email",
      "Email 2",
      "Web Address",
      "SSN",
      "Status",
      "Status Date",
      "Note",
      "Login Name",
      "SMS",
      "Tax Number",
      "AGN Team Name",
      "AS Team Name",
    ];

    // Convert data to CSV rows
    const csvRows = breeders.map((breeder) => [
      breeder.idBreeder || "",
      breeder.number || "",
      breeder.firstName || "",
      breeder.lastName || "",
      breeder.country || "",
      breeder.address1 || "",
      breeder.city1 || "",
      breeder.state1 || "",
      breeder.zip1 || "",
      breeder.address2 || "",
      breeder.city2 || "",
      breeder.state2 || "",
      breeder.zip2 || "",
      breeder.phone || "",
      breeder.cell || "",
      breeder.fax || "",
      breeder.email || "",
      breeder.email2 || "",
      breeder.webAddress || "",
      breeder.socialSecurityNumber || "",
      breeder.status === 0 ? "Active" : breeder.status === 1 ? "Inactive" : breeder.status === 2 ? "Prospect" : "",
      breeder.statusDate || "",
      breeder.note || "",
      breeder.loginName || "",
      breeder.sms || "",
      breeder.taxNumber || "",
      breeder.defNameAgn || "",
      breeder.defNameAs || "",
    ]);

    // Escape CSV values (handle quotes and commas)
    const escapeCSV = (value: string | number) => {
      const stringValue = String(value);
      if (stringValue.includes('"') || stringValue.includes(',') || stringValue.includes('\n')) {
        return `"${stringValue.replace(/"/g, '""')}"`;
      }
      return stringValue;
    };

    // Build CSV content
    const csvContent = [
      headers.map(escapeCSV).join(","),
      ...csvRows.map(row => row.map(escapeCSV).join(","))
    ].join("\n");

    // Create blob and download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `breeders_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrintLabels = () => {
    if (!breeders || breeders.length === 0) {
      return;
    }

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "letter",
    });

    // Label dimensions (standard Avery 5160 - 3 columns x 10 rows)
    const pageWidth = 215.9; // Letter width in mm
    const pageHeight = 279.4; // Letter height in mm
    const labelWidth = 66.675; // Width of each label
    const labelHeight = 25.4; // Height of each label
    const marginLeft = 4.76;
    const marginTop = 12.7;
    const columns = 3;
    const rows = 10;
    const labelsPerPage = columns * rows;

    let currentPage = 0;
    let labelIndex = 0;

    breeders.forEach((breeder, index) => {
      // Add new page if needed
      if (index > 0 && index % labelsPerPage === 0) {
        pdf.addPage();
        currentPage++;
        labelIndex = 0;
      }

      const col = labelIndex % columns;
      const row = Math.floor(labelIndex / columns);

      const x = marginLeft + col * labelWidth;
      const y = marginTop + row * labelHeight;

      // Draw border
      pdf.setDrawColor(200, 200, 200);
      pdf.setLineWidth(0.1);
      pdf.rect(x, y, labelWidth, labelHeight);

      // Set font for name
      pdf.setFontSize(11);
      pdf.setFont("helvetica", "bold");
      
      const name = `${breeder.firstName || ""} ${breeder.lastName || ""}`.trim();
      if (name) {
        pdf.text(name, x + 3, y + 6);
      }

      // Set font for address
      pdf.setFontSize(9);
      pdf.setFont("helvetica", "normal");

      let addressY = y + 11;
      
      // Address Line 1
      if (breeder.address1) {
        pdf.text(breeder.address1, x + 3, addressY);
        addressY += 4;
      }

      // Address Line 2
      if (breeder.address2) {
        pdf.text(breeder.address2, x + 3, addressY);
        addressY += 4;
      }

      // City, State ZIP
      const cityStateZip = [
        breeder.city1 || "",
        breeder.state1 || "",
        breeder.zip1 || ""
      ].filter(Boolean).join(", ");
      
      if (cityStateZip) {
        pdf.text(cityStateZip, x + 3, addressY);
        addressY += 4;
      }

      // Country
      if (breeder.country) {
        pdf.text(breeder.country, x + 3, addressY);
      }

      labelIndex++;
    });

    // Save the PDF
    pdf.save(`breeder_labels_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  return (
    <>
      <div className="mb-4 flex justify-end gap-2">
        <Button 
          onClick={handlePrintLabels} 
          variant="outline"
          className="gap-2"
          disabled={!breeders || breeders.length === 0}
        >
          <Printer className="h-4 w-4" />
          Print Labels
        </Button>
        <Button 
          onClick={handleExportCSV} 
          variant="outline"
          className="gap-2"
          disabled={!breeders || breeders.length === 0}
        >
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
        <Button onClick={handleAddNewBreeder} className="gap-2">
          <Plus className="h-4 w-4" />
          Add New Breeder
        </Button>
      </div>
      
      <DataTable 
        columns={BreederAddressBookColumns} 
        data={breeders} 
        onRowClick={handleRowClick}
      />
      
      {selectedBreederId && (
        <BreederUpdateDialog
          breederId={selectedBreederId}
          open={isUpdateDialogOpen}
          onOpenChange={setIsUpdateDialogOpen}
          onCopyBreeder={handleCopyBreeder}
        />
      )}

      <BreederCreateDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        initialData={copiedBreederData}
      />
    </>
  );
}

export function BreederSearch() {
  const [q, setQ] = useQueryState("q", {
    defaultValue: "",
  });
  const [searchField, setSearchField] = useQueryState("searchField", {
    defaultValue: "idBreeder",
  });
  const [eventId, setEventId] = useQueryState("eventId", {
    defaultValue: "",
  });
  const [status, setStatus] = useQueryState("status", {
    defaultValue: "",
  });

  const { data: eventsData, isPending: isLoadingEvents } = useListEvents({});
  const events: Event[] = eventsData?.data?.events || [];

  return (
    <div className="flex gap-4 items-end">
      <div>
        <Label htmlFor="search-field">Search By</Label>
        <Select
          value={searchField}
          onValueChange={(value) => setSearchField(value)}
        >
          <SelectTrigger className="w-[180px] mt-2">
            <SelectValue placeholder="Select field" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="idBreeder">ID Breeder</SelectItem>
            <SelectItem value="firstName">First Name</SelectItem>
            <SelectItem value="lastName">Last Name</SelectItem>
            <SelectItem value="address">Address</SelectItem>
            <SelectItem value="city">City</SelectItem>
            <SelectItem value="state">State</SelectItem>
            <SelectItem value="zip">Zip</SelectItem>
            <SelectItem value="country">Country</SelectItem>
            <SelectItem value="phone">Phone</SelectItem>
            <SelectItem value="cell">Cell</SelectItem>
            <SelectItem value="email">Email</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label htmlFor="breeder-search">Search Breeders</Label>
        <Input
          type="text"
          placeholder="Search users..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="border rounded-lg px-3 py-2 w-[300px] mt-2"
        />
      </div>
      
      <div>
        <Label htmlFor="event-filter">Filter by Event</Label>
        <Select
          value={eventId}
          onValueChange={(value) => setEventId(value === "all" ? "" : value)}
        >
          <SelectTrigger className="w-[250px] mt-2">
            <SelectValue placeholder="All Events" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Events</SelectItem>
            {isLoadingEvents ? (
              <SelectItem value="loading" disabled>
                Loading...
              </SelectItem>
            ) : (
              events.map((event) => (
                <SelectItem key={event.idEvent} value={String(event.idEvent)}>
                  {event.eventName}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="status-filter">Filter by Status</Label>
        <Select
          value={status}
          onValueChange={(value) => setStatus(value === "all" ? "" : value)}
        >
          <SelectTrigger className="w-[200px] mt-2">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="0">Active</SelectItem>
            <SelectItem value="1">Inactive</SelectItem>
            <SelectItem value="2">Prospect</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
