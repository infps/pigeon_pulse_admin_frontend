"use client";
import { useGetFees, useGetPrizes } from "@/lib/api/schema";
import EventCreateForm from "./EventCreateForm";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "./ui/dialog";
import { FeeSchema, PrizeSchema } from "@/lib/types";

export default function CreateEventButton() {
  const {
    data: getFeesData,
    error: getFeesError,
    isError: getFeesIsError,
    isPending: getFeesIsPending,
    isSuccess: getFeesIsSuccess,
  } = useGetFees({
    params: {},
  });
  const {
    data: getPrizesData,
    error: getPrizesError,
    isError: getPrizesIsError,
    isPending: getPrizesIsPending,
    isSuccess: getPrizesIsSuccess,
  } = useGetPrizes({
    params: {},
  });
  const feesSchema: FeeSchema[] = getFeesData?.data || [];
  const prizeSchemas: PrizeSchema[] = getPrizesData?.data || [];

  if (getFeesIsPending || getPrizesIsPending) {
    return null;
  }
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Create Event</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Create Event</DialogTitle>
        <EventCreateForm
          action="create"
          feeSchemas={feesSchema}
          prizeSchemas={prizeSchemas}
          id=""
        />
      </DialogContent>
    </Dialog>
  );
}
