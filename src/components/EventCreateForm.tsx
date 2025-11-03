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
  name: z.string().min(1, "Event name is required"),
  status: z.enum(["OPEN", "CLOSED"]),
  shortName: z.string().min(1, "Short name is required"),
  date: z.date(),
  type: z.enum(["AGN", "AS"]),
  trainingCount: z
    .number()
    .int()
    .min(0, "Training count must be a non-negative integer"),
  inventoryCount: z
    .number()
    .int()
    .min(0, "Inventory count must be a non-negative integer"),
  finalRaceCount: z
    .number()
    .int()
    .min(0, "Final race count must be a non-negative integer"),
  hotspotCount: z
    .number()
    .int()
    .min(0, "Hotspot count must be a non-negative integer"),
  feeSchemaId: z.uuid("Invalid fee schema ID format"),
  bettingSchemeId: z.uuid("Invalid betting schema ID format").optional(),
  finalRacePrizeSchemaId: z.uuid("Invalid prize schema ID format"),
  hotspot1PrizeSchemaId: z.uuid("Invalid prize schema ID format"),
  hotspot2PrizeSchemaId: z.uuid("Invalid prize schema ID format"),
  hotspot3PrizeSchemaId: z.uuid("Invalid prize schema ID format"),
  avgWinnerPrizeSchemaId: z.uuid("Invalid prize schema ID format"),
});

export function EventUpdateFetch({ id, onClose }: { id: string; onClose?: () => void }) {
  const { data, isPending, error, isError, isSuccess } = useGetEvent(id);
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
  id: string;
  onClose?: () => void;
}) {
  const { mutateAsync: createEvent } = useCreateEvent();
  const { mutateAsync: updateEvent } = useUpdateEvent(id);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      status: defaultValues?.status || "OPEN",
      name: defaultValues?.name || "",
      shortName: defaultValues?.shortName || "",
      type: defaultValues?.type || "AGN",
      trainingCount: defaultValues?.trainingCount || 0,
      inventoryCount: defaultValues?.inventoryCount || 0,
      finalRaceCount: defaultValues?.finalRaceCount || 0,
      hotspotCount: defaultValues?.hotspotCount || 0,
      feeSchemaId: defaultValues?.feeSchemaId || "",
      bettingSchemeId: defaultValues?.bettingSchemeId || undefined,
      finalRacePrizeSchemaId: defaultValues?.finalRacePrizeSchemaId || "",
      hotspot1PrizeSchemaId: defaultValues?.hotspot1PrizeSchemaId || "",
      hotspot2PrizeSchemaId: defaultValues?.hotspot2PrizeSchemaId || "",
      hotspot3PrizeSchemaId: defaultValues?.hotspot3PrizeSchemaId || "",
      avgWinnerPrizeSchemaId: defaultValues?.avgWinnerPrizeSchemaId || "",
      date: defaultValues?.date ? new Date(defaultValues.date) : new Date(),
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
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={form.formState.isSubmitting}
              >
                <FormControl className="w-[300px]">
                  <SelectTrigger>
                    <SelectValue placeholder="" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="OPEN">Open</SelectItem>
                  <SelectItem value="CLOSED">Closed</SelectItem>
                </SelectContent>
              </Select>

              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
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
            name="shortName"
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
            name="date"
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
            name="type"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={form.formState.isSubmitting}
                >
                  <FormControl className="w-full">
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="AGN">AGN</SelectItem>
                    <SelectItem value="AS">AS</SelectItem>
                  </SelectContent>
                </Select>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <h4 className="font-semibold mt-4 mb-2">Race Number Range</h4>
        <div className="grid grid-cols-4 gap-4">
          <FormField
            control={form.control}
            name="trainingCount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Training</FormLabel>
                <FormControl>
                  <Input
                    placeholder=""
                    type="text"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    disabled={form.formState.isSubmitting}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="inventoryCount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Inventory/Loft fly/Pulling Flight</FormLabel>
                <FormControl>
                  <Input
                    placeholder=""
                    type="text"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    disabled={form.formState.isSubmitting}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="finalRaceCount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Final Race</FormLabel>
                <FormControl>
                  <Input
                    placeholder=""
                    type="text"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    disabled={form.formState.isSubmitting}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="hotspotCount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hotspot</FormLabel>
                <FormControl>
                  <Input
                    placeholder=""
                    type="text"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    disabled={form.formState.isSubmitting}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <h4 className="font-semibold mt-4 mb-2">Schemas</h4>
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="feeSchemaId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fee Schema</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={form.formState.isSubmitting}
                >
                  <FormControl className="w-full">
                    <SelectTrigger>
                      <SelectValue placeholder="Select Fee Schema" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {feeSchemas.map((fee: FeeSchema) => (
                      <SelectItem key={fee.id} value={fee.id}>
                        {fee.name}
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
            name="bettingSchemeId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Betting Schema (Optional)</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={form.formState.isSubmitting}
                >
                  <FormControl className="w-full">
                    <SelectTrigger>
                      <SelectValue placeholder="Select Betting Schema" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {bettingSchemas.map((betting: BettingSchema) => (
                      <SelectItem key={betting.id} value={betting.id}>
                        {betting.name}
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
            name="finalRacePrizeSchemaId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Final Race</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={form.formState.isSubmitting}
                >
                  <FormControl className="w-full">
                    <SelectTrigger>
                      <SelectValue placeholder="Select Final Race Prize" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {prizeSchemas.map((prize: PrizeSchema) => (
                      <SelectItem key={prize.id} value={prize.id}>
                        {prize.name}
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
            name="hotspot1PrizeSchemaId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hot spot 1</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={form.formState.isSubmitting}
                >
                  <FormControl className="w-full">
                    <SelectTrigger>
                      <SelectValue placeholder="Select Hotspot 1 Prize" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {prizeSchemas.map((prize: PrizeSchema) => (
                      <SelectItem key={prize.id} value={prize.id}>
                        {prize.name}
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
            name="hotspot2PrizeSchemaId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hot spot 2</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={form.formState.isSubmitting}
                >
                  <FormControl className="w-full">
                    <SelectTrigger>
                      <SelectValue placeholder="Select Hotspot 2 Prize" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {prizeSchemas.map((prize: PrizeSchema) => (
                      <SelectItem key={prize.id} value={prize.id}>
                        {prize.name}
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
            name="hotspot3PrizeSchemaId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hot spot 3</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={form.formState.isSubmitting}
                >
                  <FormControl className="w-full">
                    <SelectTrigger>
                      <SelectValue placeholder="Select Hotspot 3 Prize" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {prizeSchemas.map((prize: PrizeSchema) => (
                      <SelectItem key={prize.id} value={prize.id}>
                        {prize.name}
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
            name="avgWinnerPrizeSchemaId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Avg Winner</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={form.formState.isSubmitting}
                >
                  <FormControl className="w-full">
                    <SelectTrigger>
                      <SelectValue placeholder="Select Avg Winner Prize" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {prizeSchemas.map((prize: PrizeSchema) => (
                      <SelectItem key={prize.id} value={prize.id}>
                        {prize.name}
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
