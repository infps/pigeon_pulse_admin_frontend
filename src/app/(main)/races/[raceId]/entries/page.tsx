"use client";
import { useListRaceItems } from "@/lib/api/races";
import { RaceItem } from "@/lib/types";
import { useParams } from "next/navigation";
import React, { useState } from "react";
import { DataTable } from "@/components/data-table";
import { RaceItemColumns } from "@/components/columns";
import { LoadingSpinner } from "@/components/loading-spinner";
import { ErrorState } from "@/components/error-state";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BasketManagement } from "@/components/BasketManagement";
import { EditRaceItemBasketDialog } from "@/components/EditRaceItemBasketDialog";

export default function RaceEntriesPage() {
  const { raceId } = useParams<{ raceId: string }>();
  const [selectedRaceItem, setSelectedRaceItem] = useState<RaceItem | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data, error, isPending, isError } = useListRaceItems(raceId);
  const raceItems: RaceItem[] = data?.data || [];

  const handleRowClick = (raceItem: RaceItem) => {
    setSelectedRaceItem(raceItem);
    setIsDialogOpen(true);
  };

  if (isPending) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto py-8">
        <ErrorState message={error?.message || "Failed to load race entries"} />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-6">
      <h1 className="text-3xl font-bold mb-6">Race Entries</h1>
      
      <div className="flex gap-6">
        {/* Left side - 70% - Race Items Table */}
        <div className="w-[70%]">
          <div className="rounded-lg border bg-card">
            <div className="p-4 border-b">
              <h2 className="text-xl font-semibold">Race Items</h2>
              <p className="text-sm text-muted-foreground">
                Total entries: {raceItems.length}
              </p>
            </div>
            <div className="p-4">
              <DataTable 
                columns={RaceItemColumns} 
                data={raceItems}
                onRowClick={handleRowClick}
              />
            </div>
          </div>
        </div>

        {/* Right side - 30% - Baskets */}
        <div className="w-[30%]">
          <div className="rounded-lg border bg-card">
            <div className="p-4 border-b">
              <h2 className="text-xl font-semibold">Baskets</h2>
            </div>
            <div className="p-4">
              <Tabs defaultValue="loft" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="loft">Loft Baskets</TabsTrigger>
                  <TabsTrigger value="race">Race Baskets</TabsTrigger>
                </TabsList>
                <TabsContent value="loft" className="mt-4">
                  <BasketManagement raceId={raceId} isRaceBasket={false} />
                </TabsContent>
                <TabsContent value="race" className="mt-4">
                  <BasketManagement raceId={raceId} isRaceBasket={true} />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Race Item Basket Dialog */}
      {selectedRaceItem && (
        <EditRaceItemBasketDialog
          raceItem={selectedRaceItem}
          raceId={raceId}
          isOpen={isDialogOpen}
          onClose={() => {
            setIsDialogOpen(false);
            setSelectedRaceItem(null);
          }}
        />
      )}
    </div>
  );
}
