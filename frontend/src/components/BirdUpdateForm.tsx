"use client";

import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon } from "lucide-react";
import { BirdEventInventory } from "@/lib/types";
import { updateEventInventoryItem } from "@/lib/api/eventInventory";

const formSchema = z.object({
  band_1: z.string().min(1, "Band 1 is required"),
  band_2: z.string().min(1, "Band 2 is required"),
  band_3: z.string().min(1, "Band 3 is required"),
  band_4: z.string().min(1, "Band 4 is required"),
  rfId: z.string().optional(),
  color: z.string().min(1, "Color is required"),
  birdName: z.string().min(1, "Bird Name is required"),
  note: z.string().optional(),
  sex: z.enum(["HEN", "COCK"]),
  is_active: z.boolean(),
  is_lost: z.boolean(),
  lost_date: z.date().nullable(),
  arrivalDate: z.date().nullable(),
  departureDate: z.date().nullable(),
});

type FormData = z.infer<typeof formSchema>;

interface BirdUpdateFormProps {
  bird: BirdEventInventory;
}

export default function BirdUpdateForm({ bird }: BirdUpdateFormProps) {
  const { mutateAsync: updateBird } = updateEventInventoryItem(bird.id);
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      band_1: bird.band_1 ?? "",
      band_2: bird.band_2 ?? "",
      band_3: bird.band_3 ?? "",
      band_4: bird.band_4 ?? "",
      rfId: bird.rfId ?? "",
      color: bird.bird.color ?? "",
      birdName: bird.bird.birdName ?? "",
      note: bird.note ?? "",
      sex: bird.bird.sex ?? "HEN",
      is_active: bird.bird.is_active ?? true,
      is_lost: bird.bird.is_lost ?? false,
      lost_date: bird.bird.lost_date ? new Date(bird.bird.lost_date) : null,
      arrivalDate: bird.arrivalDate ? new Date(bird.arrivalDate) : new Date(),
      departureDate: bird.departureDate ? new Date(bird.departureDate) : null,
    },
  });

  async function onSubmit(values: FormData) {
    try {
      if (!updateBird) return;
      const { data, status, error } = await updateBird(values);
      if (error) {
        toast.error("Failed to update bird: " + error);
        return;
      }
      toast.success("Bird updated successfully");
    } catch (error) {
      console.error("Error updating bird:", error);
      toast.error("Failed to update bird");
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 max-w-4xl mx-auto py-6"
      >
        {/* Breeder */}
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-gray-700 border-b pb-1">
            Breeder
          </h3>
          <Input
            value={bird.bird.breeder?.name || "N/A"}
            readOnly
            className="bg-gray-50 h-8 text-sm"
          />
        </div>

        {/* Band ID and Properties in same row */}
        <div className="grid grid-cols-2 gap-6">
          {/* Band ID */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-gray-700 border-b pb-1">
              Band ID
            </h3>
            <div className="grid grid-cols-4 gap-2">
              {(["band_1", "band_2", "band_3", "band_4"] as const).map(
                (band, idx) => (
                  <FormField
                    key={band}
                    control={form.control}
                    name={band}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">
                          {["Assc", "Year", "Letter", "Number"][idx]}
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            value={field.value || ""}
                            className="h-8 text-sm"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )
              )}
            </div>

            {/* RFID below band fields */}
            <FormField
              control={form.control}
              name="rfId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs">RFID</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      value={field.value || ""}
                      className="h-8 text-sm"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Properties */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-gray-700 border-b pb-1">
              Properties
            </h3>
            <div className="space-y-2">
              <FormField
                control={form.control}
                name="color"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs">Color</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        value={field.value || ""}
                        className="h-8 text-sm"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-2">
                <FormField
                  control={form.control}
                  name="sex"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Sex</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="h-8 text-sm w-full">
                            <SelectValue placeholder="N/A" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="HEN">Hen</SelectItem>
                          <SelectItem value="COCK">Cock</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="birdName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Name</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          value={field.value || ""}
                          className="h-8 text-sm"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Status and Event Dates in same row */}
        <div className="grid grid-cols-2 gap-6">
          {/* Status */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-gray-700 border-b pb-1">
              Status
            </h3>
            <div className="space-y-2">
              <div className="flex items-center gap-4">
                <FormField
                  control={form.control}
                  name="is_active"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="h-4 w-4"
                        />
                      </FormControl>
                      <FormLabel className="text-xs">Active</FormLabel>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="is_lost"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="h-4 w-4"
                        />
                      </FormControl>
                      <FormLabel className="text-xs">Lost</FormLabel>
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="lost_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel
                      className={cn(
                        "text-xs",
                        !form.watch("is_lost") && "text-gray-400"
                      )}
                    >
                      Lost Date
                    </FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            disabled={!form.watch("is_lost")}
                            className={cn(
                              "w-full h-8 pl-3 text-left font-normal text-sm",
                              !field.value && "text-muted-foreground",
                              !form.watch("is_lost") &&
                                "bg-gray-50 cursor-not-allowed"
                            )}
                          >
                            {field.value ? (
                              format(field.value as Date, "MMM dd, yyyy")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-3 w-3 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value as Date | undefined}
                          onSelect={field.onChange}
                          disabled={!form.watch("is_lost")}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Event Dates */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-gray-700 border-b pb-1">
              Dates
            </h3>
            <div className="space-y-2">
              <FormField
                control={form.control}
                name="arrivalDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs">Arrival Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full h-8 pl-3 text-left font-normal text-sm",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value as Date, "MMM dd, yyyy")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-3 w-3 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value as Date | undefined}
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
                name="departureDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs">Departure Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full h-8 pl-3 text-left font-normal text-sm",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value as Date, "MMM dd, yyyy")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-3 w-3 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value as Date | undefined}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-gray-700 border-b pb-1">
            Notes
          </h3>
          <FormField
            control={form.control}
            name="note"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    {...field}
                    value={field.value || ""}
                    className="resize-none h-20 text-sm"
                    placeholder="Add notes here..."
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end pt-2">
          <Button type="submit" size="sm">
            Update Bird
          </Button>
        </div>
      </form>
    </Form>
  );
}
