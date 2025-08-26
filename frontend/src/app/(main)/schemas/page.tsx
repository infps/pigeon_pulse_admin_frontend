"use client";
import SchemaComponent from "@/components/SchemaComponent";
import SchemaForm from "@/components/SchemaForm";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useGetFees, useGetPrizes } from "@/lib/api/schema";
import { FeeSchema, PrizeSchema } from "@/lib/types";
import React, { useState } from "react";

export default function page() {
  const [isFeeDialogOpen, setIsFeeDialogOpen] = useState(false);
  const [isPrizeDialogOpen, setIsPrizeDialogOpen] = useState(false);
  
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
  return (
    <div className="flex h-screen">
      <div className="w-1/2 p-4 border-r">
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
        {isFeePending && <p>Loading fees...</p>}
        {isFeeError && <p>Error loading fees: {feeError.message}</p>}
        {isFeeSuccess && feeSchema.length === 0 && (
          <p>No fee schemas available.</p>
        )}
        {isFeeSuccess &&
          feeSchema.map((schema) => (
            <SchemaComponent key={schema.id} schema={schema} type="fee" />
          ))}
      </div>
      <div className="w-1/2 p-4">
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
        {isPrizePending && <p>Loading prizes...</p>}
        {isPrizeError && <p>Error loading prizes: {prizeError.message}</p>}
        {isPrizeSuccess && prizeSchema.length === 0 && (
          <p>No prize schemas available.</p>
        )}
        {isPrizeSuccess &&
          prizeSchema.map((schema) => (
            <SchemaComponent key={schema.id} schema={schema} type="prize" />
          ))}
      </div>
    </div>
  );
}
