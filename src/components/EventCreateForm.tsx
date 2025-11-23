"use client";
import { useState } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon } from "lucide-react";
import { Event, FeeSchema, PrizeSchema, BettingSchema } from "@/lib/types";
import { useCreateEvent, useGetEvent, useUpdateEvent } from "@/lib/api/events";
import { useGetFees, useGetPrizes, useGetBettings } from "@/lib/api/schema";

const formSchema = z.object({
  eventName: z.string().min(1, "Event name is required"),
  eventShortName: z.string().min(1, "Short name is required"),
  eventDate: z.date(),
  eventType: z.number().int().min(0).max(1),
  isOpen: z.number().int().min(0).max(1),
  idBettingScheme: z.number().int().nullable().optional(),
  idFeeScheme: z.number().int(),
  idFinalPrizeScheme: z.number().int().nullable().optional(),
  idHotSpot1PrizeScheme: z.number().int().nullable().optional(),
  idHotSpot2PrizeScheme: z.number().int().nullable().optional(),
  idHotSpot3PrizeScheme: z.number().int().nullable().optional(),
  idHotSpotAvgPrizeScheme: z.number().int().nullable().optional(),
});

export function EventUpdateFetch({ id, onClose }: { id: string; onClose?: () => void }) {
  const { data, isPending, error, isError, isSuccess } = useGetEvent(parseInt(id));
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
  const {
    data: getBettingsData,
    error: getBettingsError,
    isError: getBettingsIsError,
    isPending: getBettingsIsPending,
    isSuccess: getBettingsIsSuccess,
  } = useGetBettings({
    params: {},
  });
  const feesSchema: FeeSchema[] = getFeesData?.data || [];
  const prizeSchemas: PrizeSchema[] = getPrizesData?.data || [];
  const bettingSchemas: BettingSchema[] = getBettingsData?.data || [];
  const event: Event = data?.data;
  if (isPending || getPrizesIsPending || getFeesIsPending || getBettingsIsPending)
    return <p>Loading...</p>;
  if (isError) return <p>Error: {error.message}</p>;
  return (
    <EventCreateForm
      action="update"
      id={id}
      defaultValues={event}
      feeSchemas={feesSchema}
      prizeSchemas={prizeSchemas}
      bettingSchemas={bettingSchemas}
      onClose={onClose}
    />
  );
}

export default function EventCreateForm({
  defaultValues,
  action,
  feeSchemas,
  prizeSchemas,
  bettingSchemas,
  id,
  onClose,
}: {
  defaultValues?: Event;
  action: "create" | "update";
  feeSchemas: FeeSchema[];
  prizeSchemas: PrizeSchema[];
  bettingSchemas: BettingSchema[];
  id?: string;
  onClose?: () => void;
}) {
  const { mutateAsync: createEvent } = useCreateEvent();
  const { mutateAsync: updateEvent } = useUpdateEvent(id ? parseInt(id) : 0);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      isOpen: defaultValues?.isOpen ?? 1,
      eventName: defaultValues?.eventName || "",
      eventShortName: defaultValues?.eventShortName || "",
      eventType: defaultValues?.eventType ?? 0,
      idFeeScheme: defaultValues?.idFeeScheme || 0,
      idBettingScheme: defaultValues?.idBettingScheme || null,
      idFinalPrizeScheme: defaultValues?.idFinalPrizeScheme || null,
      idHotSpot1PrizeScheme: defaultValues?.idHotSpot1PrizeScheme || null,
      idHotSpot2PrizeScheme: defaultValues?.idHotSpot2PrizeScheme || null,
      idHotSpot3PrizeScheme: defaultValues?.idHotSpot3PrizeScheme || null,
      idHotSpotAvgPrizeScheme: defaultValues?.idHotSpotAvgPrizeScheme || null,
      eventDate: defaultValues?.eventDate ? new Date(defaultValues.eventDate) : new Date(),
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      if (action === "create") {
        if (!createEvent) return;
        const { data, error, status } = await createEvent(values);
        if (error) {
          toast.error(error);
          return;
        }
        toast.success("Event created successfully!");
        form.reset();
        onClose?.();
      } else if (action === "update" && id) {
        if (!updateEvent) return;
        const { data, error, status } = await updateEvent(values);
        if (error) {
          toast.error(error);
          return;
        }
        toast.success("Event updated successfully!");
        onClose?.();
      }
    } catch (error) {
      console.error("Form submission error", error);
      toast.error("Failed to submit the form. Please try again.");
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 w-full mx-auto pb-10"
      >
        <FormField
          control={form.control}
          name="isOpen"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select
                onValueChange={(value) => field.onChange(value === "true" ? 1 : 0)}
                value={field.value === 1 ? "true" : "false"}
                disabled={form.formState.isSubmitting}
              >
                <FormControl className="w-[300px]">
                  <SelectTrigger>
                    <SelectValue placeholder="" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="true">Open</SelectItem>
                  <SelectItem value="false">Closed</SelectItem>
                </SelectContent>
              </Select>

              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="eventName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder=""
                    type="text"
                    {...field}
                    disabled={form.formState.isSubmitting}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="eventShortName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Short Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder=""
                    type="text"
                    {...field}
                    disabled={form.formState.isSubmitting}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="eventDate"
            render={({ field }) => (
              <FormItem className="flex flex-col w-full">
                <FormLabel>Projected Final Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                        disabled={form.formState.isSubmitting}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      disabled={(date) => date < new Date()}
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="eventType"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Type</FormLabel>
                <Select
                  onValueChange={(value) => field.onChange(parseInt(value))}
                  value={field.value?.toString()}
                  disabled={form.formState.isSubmitting}
                >
                  <FormControl className="w-full">
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="0">AGN</SelectItem>
                    <SelectItem value="1">AS</SelectItem>
                  </SelectContent>
                </Select>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <h4 className="font-semibold mt-4 mb-2">Schemas</h4>
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="idFeeScheme"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fee Schema</FormLabel>
                <Select
                  onValueChange={(value) => field.onChange(parseInt(value))}
                  value={field.value?.toString()}
                  disabled={form.formState.isSubmitting}
                >
                  <FormControl className="w-full">
                    <SelectTrigger>
                      <SelectValue placeholder="Select Fee Schema" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {feeSchemas.map((fee: FeeSchema) => (
                      <SelectItem key={fee.idFeeScheme} value={fee.idFeeScheme.toString()}>
                        {fee.feeSchemeName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="idBettingScheme"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Betting Schema (Optional)</FormLabel>
                <Select
                  onValueChange={(value) => field.onChange(value ? parseInt(value) : null)}
                  value={field.value?.toString() || undefined}
                  disabled={form.formState.isSubmitting}
                >
                  <FormControl className="w-full">
                    <SelectTrigger>
                      <SelectValue placeholder="Select Betting Schema" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {bettingSchemas.map((betting: BettingSchema) => (
                      <SelectItem key={betting.idBettingScheme} value={betting.idBettingScheme.toString()}>
                        {betting.bettingSchemeName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="idFinalPrizeScheme"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Final Race</FormLabel>
                <Select
                  onValueChange={(value) => field.onChange(value ? parseInt(value) : null)}
                  value={field.value?.toString() || undefined}
                  disabled={form.formState.isSubmitting}
                >
                  <FormControl className="w-full">
                    <SelectTrigger>
                      <SelectValue placeholder="Select Final Race Prize" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {prizeSchemas.map((prize: PrizeSchema) => (
                      <SelectItem key={prize.idPrizeScheme} value={prize.idPrizeScheme.toString()}>
                        {prize.prizeName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="idHotSpot1PrizeScheme"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hot spot 1</FormLabel>
                <Select
                  onValueChange={(value) => field.onChange(value ? parseInt(value) : null)}
                  value={field.value?.toString() || undefined}
                  disabled={form.formState.isSubmitting}
                >
                  <FormControl className="w-full">
                    <SelectTrigger>
                      <SelectValue placeholder="Select Hotspot 1 Prize" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {prizeSchemas.map((prize: PrizeSchema) => (
                      <SelectItem key={prize.idPrizeScheme} value={prize.idPrizeScheme.toString()}>
                        {prize.prizeName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="idHotSpot2PrizeScheme"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hot spot 2</FormLabel>
                <Select
                  onValueChange={(value) => field.onChange(value ? parseInt(value) : null)}
                  value={field.value?.toString() || undefined}
                  disabled={form.formState.isSubmitting}
                >
                  <FormControl className="w-full">
                    <SelectTrigger>
                      <SelectValue placeholder="Select Hotspot 2 Prize" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {prizeSchemas.map((prize: PrizeSchema) => (
                      <SelectItem key={prize.idPrizeScheme} value={prize.idPrizeScheme.toString()}>
                        {prize.prizeName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="idHotSpot3PrizeScheme"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hot spot 3</FormLabel>
                <Select
                  onValueChange={(value) => field.onChange(value ? parseInt(value) : null)}
                  value={field.value?.toString() || undefined}
                  disabled={form.formState.isSubmitting}
                >
                  <FormControl className="w-full">
                    <SelectTrigger>
                      <SelectValue placeholder="Select Hotspot 3 Prize" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {prizeSchemas.map((prize: PrizeSchema) => (
                      <SelectItem key={prize.idPrizeScheme} value={prize.idPrizeScheme.toString()}>
                        {prize.prizeName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="idHotSpotAvgPrizeScheme"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Avg Winner</FormLabel>
                <Select
                  onValueChange={(value) => field.onChange(value ? parseInt(value) : null)}
                  value={field.value?.toString() || undefined}
                  disabled={form.formState.isSubmitting}
                >
                  <FormControl className="w-full">
                    <SelectTrigger>
                      <SelectValue placeholder="Select Avg Winner Prize" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {prizeSchemas.map((prize: PrizeSchema) => (
                      <SelectItem key={prize.idPrizeScheme} value={prize.idPrizeScheme.toString()}>
                        {prize.prizeName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {action === "create" ? "Create Event" : "Update Event"}
        </Button>
      </form>
    </Form>
  );
}