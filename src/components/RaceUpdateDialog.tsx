"use client";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
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
import { Button } from "@/components/ui/button";
import { SmartDatetimeInput } from "@/components/ui/smart-datetime-input";
import { useGetRace, useUpdateRace } from "@/lib/api/races";
import { useListEvents } from "@/lib/api/events";
import { toast } from "sonner";
import { Event } from "@/lib/types";

const formSchema = z.object({
  eventId: z.string().min(1, "Event is required"),
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
  liberation: z.string().min(1, "Liberation is required"),
  distance: z.string().min(1, "Distance is required"),
  description: z.string().optional(),
  startTime: z.date(),
  sunrise: z.string().min(1, "Sunrise is required"),
  sunset: z.string().min(1, "Sunset is required"),
  arrivalDate: z.date(),
  // Release conditions
  releaseWeather: z.string().optional(),
  releaseWind: z.string().optional(),
  releaseTemperature: z.string().optional(),
  // Arrival conditions
  arrivalWeather: z.string().optional(),
  arrivalWind: z.string().optional(),
  arrivalTemperature: z.string().optional(),
});

interface RaceUpdateDialogProps {
  raceId: string;
  onClose: () => void;
}

export function RaceUpdateDialog({ raceId, onClose }: RaceUpdateDialogProps) {
  const { data: raceData, isPending: isLoadingRace } = useGetRace(parseInt(raceId));
  const { data: eventsData } = useListEvents({});
  const events: Event[] = eventsData?.data?.events || [];
  const { mutateAsync: updateRace } = useUpdateRace(parseInt(raceId));

  const race = raceData?.data;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      eventId: "",
      type: "TRAINING",
      liberation: "",
      distance: "",
      description: "",
      startTime: new Date(),
      sunrise: "12:00:00 AM",
      sunset: "07:00:00 PM",
      arrivalDate: new Date(),
      releaseWeather: "",
      releaseWind: "",
      releaseTemperature: "",
      arrivalWeather: "",
      arrivalWind: "",
      arrivalTemperature: "",
    },
  });

  useEffect(() => {
    console.log("hello")
    if (race) {
      form.reset({
        eventId: race.eventId || "",
        type: race.type || "TRAINING",
        liberation: race.location || "",
        distance: race.distance || "",
        description: race.description || "",
        startTime: race.startTime ? new Date(race.startTime) : new Date(),
        sunrise: race.sunrise || "12:00:00 AM",
        sunset: race.sunset || "07:00:00 PM",
        arrivalDate: race.endTime ? new Date(race.endTime) : new Date(),
        releaseWeather: race.weather || "",
        releaseWind: race.wind || "",
        releaseTemperature: race.temperature || "",
        arrivalWeather: race.arrivalWeather || "",
        arrivalWind: race.arrivalWind || "",
        arrivalTemperature: race.arrivalTemperature || "",
      });
    }
  }, [race, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!updateRace) {
      toast.error("Unable to update race");
      return;
    }

    try {
      const { data, error } = await updateRace({
        eventId: values.eventId,
        type: values.type,
        location: values.liberation,
        distance: values.distance,
        description: values.description,
        startTime: values.startTime,
        sunrise: values.sunrise,
        sunset: values.sunset,
        endTime: values.arrivalDate,
        weather: values.releaseWeather,
        wind: values.releaseWind,
        temperature: values.releaseTemperature,
        arrivalWeather: values.arrivalWeather,
        arrivalWind: values.arrivalWind,
        arrivalTemperature: values.arrivalTemperature,
      });

      if (error) {
        toast.error("Failed to update race");
        return;
      }

      toast.success("Race updated successfully");
      onClose();
    } catch (error) {
      console.error("Error updating race:", error);
      toast.error("An error occurred while updating the race");
    }
  };

  if (isLoadingRace) {
    return <div className="p-4">Loading race details...</div>;
  }

  return (
    <div className="max-h-[70vh] overflow-y-auto px-1">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* First Row */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <FormField
              control={form.control}
              name="eventId"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Event</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select event" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {events.map((event) => (
                        <SelectItem key={event.idEvent} value={String(event.idEvent)}>
                          {event.eventName}
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
                <FormItem className="md:col-span-1">
                  <FormLabel>Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select type" />
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
                      <SelectItem value="AVG_WINNER">Avg Winner</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="startTime"
              render={({ field }) => (
                <FormItem className="">
                  <FormLabel>Start Date & Time</FormLabel>
                  <FormControl>
                    <SmartDatetimeInput
                      value={field.value}
                      onValueChange={field.onChange}
                      placeholder="Pick date and time"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="sunrise"
              render={({ field }) => (
                <FormItem className="w-max">
                  <FormLabel>Sunrise</FormLabel>
                  <FormControl>
                    <Input {...field} type="time" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Second Row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <FormField
              control={form.control}
              name="liberation"
              render={({ field }) => (
                <FormItem className="md:col-span-1">
                  <FormLabel>Liberation</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter liberation" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="distance"
              render={({ field }) => (
                <FormItem className="md:col-span-1">
                  <FormLabel>Distance (miles)</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter distance" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="arrivalDate"
              render={({ field }) => (
                <FormItem className="md:col-span-1">
                  <FormLabel>Arrival Date</FormLabel>
                  <FormControl>
                    <SmartDatetimeInput
                      value={field.value}
                      onValueChange={field.onChange}
                      placeholder="Pick arrival date"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="sunset"
              render={({ field }) => (
                <FormItem className="w-max">
                  <FormLabel>Sunset</FormLabel>
                  <FormControl>
                    <Input {...field} type="time" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Description Row */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter description" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Release Conditions */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Release conditions</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="releaseWeather"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Weather</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter weather" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="releaseWind"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Wind</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter wind" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="releaseTemperature"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Temperature</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter temperature" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Arrival Conditions */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Arrival conditions</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="arrivalWeather"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Weather</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter weather" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="arrivalWind"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Wind</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter wind" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="arrivalTemperature"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Temperature</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter temperature" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Update Race</Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
