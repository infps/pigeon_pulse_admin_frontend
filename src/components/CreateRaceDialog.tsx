"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SmartDatetimeInput } from "@/components/ui/smart-datetime-input";
import { useCreateRace } from "@/lib/api/races";
import { Event } from "@/lib/types";
import { Plus } from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
  eventId: z.uuid(),
  type: z.enum([
    "TRAINING",
    "INVENTORY",
    "LOFT_FLY",
    "PULLING_FLIGHT",
    "FINAL_RACE",
    "HOTSPOT_1",
    "HOTSPOT_2",
    "HOTSPOT_3",
    "AVG_WINNER",
  ]),
  location: z.string().min(1, "Location is required"),
  startTime: z.date(),
  distance: z.string().min(1, "Distance is required"),
  description: z.string().optional(),
});

interface CreateRaceDialogProps {
  events: Event[];
  selectedEventId?: string;
}

export function CreateRaceDialog({
  events,
  selectedEventId,
}: CreateRaceDialogProps) {
  const [open, setOpen] = useState(false);
  const { mutateAsync: createRace } = useCreateRace();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      eventId: selectedEventId || "",
      type: "TRAINING",
      location: "",
      distance: "",
      startTime: new Date(),
      description: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!createRace) return;
    try {
      const { data, error } = await createRace(values);
      if (error) {
        toast.error("Failed to create race");
        return;
      }
      toast.success("Race created successfully");
      setOpen(false);
      form.reset();
    } catch (error) {
      console.error("Error creating race:", error);
      toast.error("An error occurred while creating the race");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Race
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Race</DialogTitle>
          <DialogDescription>
            Fill in the details to create a new race for your selected event.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Header Row */}
            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="eventId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Event</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select Event" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {events.map((event) => (
                          <SelectItem key={event.id} value={event.id}>
                            {event.name}
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
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select Type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="TRAINING">Training</SelectItem>
                        <SelectItem value="INVENTORY">Inventory</SelectItem>
                        <SelectItem value="LOFT_FLY">Loft Fly</SelectItem>
                        <SelectItem value="PULLING_FLIGHT">
                          Pulling Flight
                        </SelectItem>
                        <SelectItem value="FINAL_RACE">Final Race</SelectItem>
                        <SelectItem value="HOTSPOT_1">Hotspot 1</SelectItem>
                        <SelectItem value="HOTSPOT_2">Hotspot 2</SelectItem>
                        <SelectItem value="HOTSPOT_3">Hotspot 3</SelectItem>
                        <SelectItem value="AVG_WINNER">
                          Average Winner
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="distance"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Distance (miles)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter distance"
                        type="text"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Liberation Section */}
            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Liberation</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter liberation location"
                        type="text"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="startTime"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Start Date</FormLabel>
                    <FormControl>
                      <SmartDatetimeInput
                        value={field.value}
                        onValueChange={field.onChange}
                        placeholder="Select start date and time"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter description (optional)"
                        type="text"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Create Race</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
