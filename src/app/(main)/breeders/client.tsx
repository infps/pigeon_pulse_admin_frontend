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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";

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
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);

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

  // Define all available columns
  const allColumns = [
    { key: "idBreeder", label: "ID" },
    { key: "number", label: "Number" },
    { key: "firstName", label: "First Name" },
    { key: "lastName", label: "Last Name" },
    { key: "country", label: "Country" },
    { key: "address1", label: "Address 1" },
    { key: "city1", label: "City 1" },
    { key: "state1", label: "State 1" },
    { key: "zip1", label: "ZIP 1" },
    { key: "address2", label: "Address 2" },
    { key: "city2", label: "City 2" },
    { key: "state2", label: "State 2" },
    { key: "zip2", label: "ZIP 2" },
    { key: "phone", label: "Phone" },
    { key: "cell", label: "Cell" },
    { key: "fax", label: "Fax" },
    { key: "email", label: "Email" },
    { key: "email2", label: "Email 2" },
    { key: "webAddress", label: "Web Address" },
    { key: "socialSecurityNumber", label: "SSN" },
    { key: "status", label: "Status" },
    { key: "statusDate", label: "Status Date" },
    { key: "note", label: "Note" },
    { key: "loginName", label: "Login Name" },
    { key: "sms", label: "SMS" },
    { key: "taxNumber", label: "Tax Number" },
    { key: "defNameAgn", label: "AGN Team Name" },
    { key: "defNameAs", label: "AS Team Name" },
  ];

  const handleOpenExportDialog = () => {
    if (!breeders || breeders.length === 0) {
      return;
    }
    // Initialize with all columns selected
    setSelectedColumns(allColumns.map(col => col.key));
    setIsExportDialogOpen(true);
  };

  const handleToggleColumn = (columnKey: string) => {
    setSelectedColumns(prev => 
      prev.includes(columnKey)
        ? prev.filter(key => key !== columnKey)
        : [...prev, columnKey]
    );
  };

  const handleSelectAllColumns = () => {
    setSelectedColumns(allColumns.map(col => col.key));
  };

  const handleDeselectAllColumns = () => {
    setSelectedColumns([]);
  };

  const handleExportCSV = () => {
    if (!breeders || breeders.length === 0 || selectedColumns.length === 0) {
      return;
    }

    // Filter columns based on selection
    const selectedColumnData = allColumns.filter(col => selectedColumns.includes(col.key));
    const headers = selectedColumnData.map(col => col.label);

    // Convert data to CSV rows
    const csvRows = breeders.map((breeder) => {
      return selectedColumnData.map(col => {
        const key = col.key as keyof BreederAddressBook;
        if (key === "status") {
          return breeder.status === 0 ? "Active" : breeder.status === 1 ? "Inactive" : breeder.status === 2 ? "Prospect" : "";
        }
        return breeder[key] || "";
      });
    });

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
    
    // Close dialog after export
    setIsExportDialogOpen(false);
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
          onClick={handleOpenExportDialog} 
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

      <Dialog open={isExportDialogOpen} onOpenChange={setIsExportDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Export CSV</DialogTitle>
            <DialogDescription>
              Select the columns you want to include in the CSV export. You can select all columns or choose specific ones.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="flex gap-2">
              <Button 
                onClick={handleSelectAllColumns} 
                variant="outline" 
                size="sm"
              >
                Select All
              </Button>
              <Button 
                onClick={handleDeselectAllColumns} 
                variant="outline" 
                size="sm"
              >
                Deselect All
              </Button>
              <div className="ml-auto text-sm text-muted-foreground">
                {selectedColumns.length} of {allColumns.length} columns selected
              </div>
            </div>

            <ScrollArea className="h-[400px] rounded-md border p-4">
              <div className="grid grid-cols-2 gap-4">
                {allColumns.map((column) => (
                  <div key={column.key} className="flex items-center space-x-2">
                    <Checkbox
                      id={column.key}
                      checked={selectedColumns.includes(column.key)}
                      onCheckedChange={() => handleToggleColumn(column.key)}
                    />
                    <label
                      htmlFor={column.key}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      {column.label}
                    </label>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsExportDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleExportCSV}
              disabled={selectedColumns.length === 0}
            >
              <Download className="h-4 w-4 mr-2" />
              Export {selectedColumns.length > 0 && `(${selectedColumns.length} columns)`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
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
