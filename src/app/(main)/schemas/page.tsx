"use client";
import SchemaComponent from "@/components/SchemaComponent";
import SchemaForm from "@/components/SchemaForm";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CardSkeleton } from "@/components/loading-skeletons";
import { useGetFees, useGetPrizes, useGetBettings } from "@/lib/api/schema";
import { BettingSchema, FeeSchema, PrizeSchema } from "@/lib/types";
import React, { useState } from "react";

export default function page() {
  const [isFeeDialogOpen, setIsFeeDialogOpen] = useState(false);
  const [isPrizeDialogOpen, setIsPrizeDialogOpen] = useState(false);
  const [isBettingDialogOpen, setIsBettingDialogOpen] = useState(false);
  
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
  const {
    data: bettingData,
    isPending: isBettingPending,
    isSuccess: isBettingSuccess,
    isError: isBettingError,
    error: bettingError,
  } = useGetBettings({ params: {} });

  const prizeSchema: PrizeSchema[] = prizeData?.data || [];
  const feeSchema: FeeSchema[] = feeData?.data || [];
  const bettingSchema: BettingSchema[] = bettingData?.data || [];

  return (
    <div className="flex h-screen">
      <div className="w-1/3 p-4 border-r">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Fee Schema</h1>
          <Dialog open={isFeeDialogOpen} onOpenChange={setIsFeeDialogOpen}>
            <DialogTrigger asChild>
              <Button>Create Fee Scheme</Button>
            </DialogTrigger>
            <DialogContent className="max-w-5xl w-full max-h-[80vh] overflow-y-auto">
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
            <DialogContent className="max-w-5xl w-full max-h-[80vh] overflow-y-auto">
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
            <DialogContent className="max-w-5xl w-full max-h-[90vh] overflow-y-auto">
              <SchemaForm 
                type="betting" 
                action="create" 
                onClose={() => setIsBettingDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>
        {isBettingPending && (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        )}
        {isBettingError && (
          <div className="text-center p-8">
            <p className="text-lg text-destructive mb-2">Failed to load betting schemas</p>
            <p className="text-sm text-muted-foreground">{bettingError.message}</p>
          </div>
        )}
        {isBettingSuccess && bettingSchema.length === 0 && (
          <div className="text-center p-8">
            <p className="text-lg text-muted-foreground">No betting schemas available.</p>
          </div>
        )}
        {isBettingSuccess &&
          bettingSchema.map((schema) => (
            <SchemaComponent key={schema.id} schema={schema} type="betting" />
          ))}
      </div>
    </div>
  );
}
