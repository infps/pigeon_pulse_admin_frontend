"use client";
import SchemaComponent from "@/components/SchemaComponent";
import SchemaForm from "@/components/SchemaForm";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CardSkeleton } from "@/components/loading-skeletons";
import { useGetFees, useGetPrizes } from "@/lib/api/schema";
import { FeeSchema, PrizeSchema } from "@/lib/types";
import React, { useState } from "react";

export default function page() {
  const [isFeeDialogOpen, setIsFeeDialogOpen] = useState(false);
  const [isPrizeDialogOpen, setIsPrizeDialogOpen] = useState(false);
  const [isBettingDialogOpen, setIsBettingDialogOpen] = useState(false);
  const [bettingSchemaName, setBettingSchemaName] = useState("");
  
  const {
    data: prizeData,
    isPending: isPrizePending,
    isSuccess: isPrizeSuccess,
    isError: isPrizeError,
    error: prizeError,
  } = useGetPrizes({ params: {} });
  const {
    data: feeData,
    isPending: isFeePending,
    isSuccess: isFeeSuccess,
    isError: isFeeError,
    error: feeError,
  } = useGetFees({ params: {} });

  const prizeSchema: PrizeSchema[] = prizeData?.data || [];
  const feeSchema: FeeSchema[] = feeData?.data || [];

  const handleCreateBettingSchema = () => {
    // TODO: Implement backend functionality
    console.log("Creating betting schema:", bettingSchemaName);
    setBettingSchemaName("");
    setIsBettingDialogOpen(false);
  };

  return (
    <div className="flex h-screen">
      <div className="w-1/3 p-4 border-r">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Fee Schema</h1>
          <Dialog open={isFeeDialogOpen} onOpenChange={setIsFeeDialogOpen}>
            <DialogTrigger asChild>
              <Button>Create Fee Scheme</Button>
            </DialogTrigger>
            <DialogContent className="max-w-5xl w-full">
              <SchemaForm 
                type="fee" 
                action="create" 
                onClose={() => setIsFeeDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>
        {isFeePending && (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        )}
        {isFeeError && (
          <div className="text-center p-8">
            <p className="text-lg text-destructive mb-2">Failed to load fee schemas</p>
            <p className="text-sm text-muted-foreground">{feeError.message}</p>
          </div>
        )}
        {isFeeSuccess && feeSchema.length === 0 && (
          <div className="text-center p-8">
            <p className="text-lg text-muted-foreground">No fee schemas available.</p>
          </div>
        )}
        {isFeeSuccess &&
          feeSchema.map((schema) => (
            <SchemaComponent key={schema.id} schema={schema} type="fee" />
          ))}
      </div>
      <div className="w-1/3 p-4 border-r">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Prize Schema</h1>
          <Dialog open={isPrizeDialogOpen} onOpenChange={setIsPrizeDialogOpen}>
            <DialogTrigger asChild>
              <Button>Create Prize Scheme</Button>
            </DialogTrigger>
            <DialogContent className="max-w-5xl w-full">
              <SchemaForm 
                type="prize" 
                action="create" 
                onClose={() => setIsPrizeDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>
        {isPrizePending && (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        )}
        {isPrizeError && (
          <div className="text-center p-8">
            <p className="text-lg text-destructive mb-2">Failed to load prize schemas</p>
            <p className="text-sm text-muted-foreground">{prizeError.message}</p>
          </div>
        )}
        {isPrizeSuccess && prizeSchema.length === 0 && (
          <div className="text-center p-8">
            <p className="text-lg text-muted-foreground">No prize schemas available.</p>
          </div>
        )}
        {isPrizeSuccess &&
          prizeSchema.map((schema) => (
            <SchemaComponent key={schema.id} schema={schema} type="prize" />
          ))}
      </div>
      <div className="w-1/3 p-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Betting Schema</h1>
          <Dialog open={isBettingDialogOpen} onOpenChange={setIsBettingDialogOpen}>
            <DialogTrigger asChild>
              <Button>Create Betting Scheme</Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <div className="space-y-4 p-4">
                <h2 className="text-lg font-semibold">Create Betting Schema</h2>
                <div className="space-y-2">
                  <Label htmlFor="betting-name">Schema Name</Label>
                  <Input
                    id="betting-name"
                    placeholder="Enter schema name"
                    value={bettingSchemaName}
                    onChange={(e) => setBettingSchemaName(e.target.value)}
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsBettingDialogOpen(false);
                      setBettingSchemaName("");
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCreateBettingSchema}
                    disabled={!bettingSchemaName.trim()}
                  >
                    Create
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        <div className="text-center p-8">
          <p className="text-lg text-muted-foreground">No betting schemas available.</p>
        </div>
      </div>
    </div>
  );
}
