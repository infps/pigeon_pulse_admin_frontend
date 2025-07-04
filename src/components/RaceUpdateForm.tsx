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
import { Input } from "@/components/ui/input";
import { SmartDatetimeInput } from "@/components/ui/smart-datetime-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CloudUpload, Paperclip } from "lucide-react";
import {
  FileInput,
  FileUploader,
  FileUploaderContent,
  FileUploaderItem,
} from "@/components/ui/file-upload";
import { createRace, updateRace } from "@/lib/api/races";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  date: z.date(),
  distanceKm: z.number().min(1),
  startLocation: z.string().min(1, "Start location is required"),
  endLocation: z.string().min(1, "End location is required"),
  entryFee: z.number().min(0),
  maxParticipants: z.number().min(1),
  status: z.enum(["UPCOMING", "LIVE", "COMPLETED"]),
  rules: z.string().min(1, "Race rules are required"),
  description: z.string().min(1, "Race Description is required"),
  image: z
    .instanceof(File)
    .refine((file) => file.size <= 1024 * 1024 * 4, {
      message: "File size must be less than 4MB",
    })
    .optional(),
});

export default function RaceUpdateForm({
  initalData,
  raceId,
}: {
  initalData?: z.infer<typeof formSchema>;
  raceId: string;
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initalData?.name || "",
      distanceKm: initalData?.distanceKm || 0,
      startLocation: initalData?.startLocation || "",
      endLocation: initalData?.endLocation || "",
      entryFee: initalData?.entryFee || 0,
      maxParticipants: initalData?.maxParticipants || 0,
      status: initalData?.status || "UPCOMING",
      date: initalData?.date ? new Date(initalData.date) : new Date(),
      rules: initalData?.rules || "",
      description: initalData?.description || "",
    },
  });

  const { mutateAsync, isPending: isCreatingRace } = updateRace({
    params: {},
    raceId,
  });
  const router = useRouter();
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      if (!mutateAsync) return;
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("date", values.date.toISOString());
      formData.append("distanceKm", values.distanceKm.toString());
      formData.append("startLocation", values.startLocation);
      formData.append("endLocation", values.endLocation);
      formData.append("entryFee", values.entryFee.toString());
      formData.append("maxParticipants", values.maxParticipants.toString());
      formData.append("status", values.status);
      formData.append("rules", values.rules);
      formData.append("description", values.description);
      const res = await mutateAsync(formData);
      if (res.error) {
        toast.error("Failed to update race");
      } else {
        toast.success("Race updated successfully");
        router.refresh();
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
        className="space-y-8 p-4 border rounded-lg bg-card mx-auto py-10"
      >
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Race Name</FormLabel>
                <FormControl>
                  <Input placeholder="" type="text" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Event time</FormLabel>
                <FormControl>
                  <SmartDatetimeInput
                    value={field.value instanceof Date ? field.value : null}
                    onValueChange={field.onChange}
                    placeholder="e.g. Tomorrow morning 9am"
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="distanceKm"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Distance (in km)</FormLabel>
                <FormControl>
                  <Input
                    placeholder=""
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="startLocation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start Location</FormLabel>
                <FormControl>
                  <Input placeholder="" type="text" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="endLocation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>End Location</FormLabel>
                <FormControl>
                  <Input placeholder="" type="text" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="entryFee"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Entry Fee</FormLabel>
                <FormControl>
                  <Input
                    placeholder=""
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="maxParticipants"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Max Participants</FormLabel>
                <FormControl>
                  <Input
                    placeholder=""
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl className="w-full">
                    <SelectTrigger>
                      <SelectValue placeholder="" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="UPCOMING">UPCOMING</SelectItem>
                    <SelectItem value="LIVE">LIVE</SelectItem>
                    <SelectItem value="COMPLETED">COMPLETED</SelectItem>
                  </SelectContent>
                </Select>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="rules"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Race Rules</FormLabel>
              <FormControl>
                <Textarea placeholder="" className="resize-none" {...field} />
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
              <FormLabel>Race Description</FormLabel>
              <FormControl>
                <Textarea placeholder="" className="resize-none" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <Button disabled={isCreatingRace} className="w-full" type="submit">
          Update Race
        </Button>
      </form>
    </Form>
  );
}
