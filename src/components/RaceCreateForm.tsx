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
import { createRace } from "@/lib/api/races";

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

export default function RaceCreateForm() {
  const [files, setFiles] = useState<File[] | null>(null);

  const dropZoneConfig = {
    maxFiles: 5,
    maxSize: 1024 * 1024 * 4,
    multiple: true,
  };
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      distanceKm: 0,
      startLocation: "",
      endLocation: "",
      entryFee: 0,
      maxParticipants: 0,
      status: "UPCOMING",
      date: new Date(),
      rules: "",
      description: "",
    },
  });

  const { mutateAsync, isPending: isCreatingRace } = createRace();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      console.log("Form values:", values);
      if (!files || files.length === 0) {
        toast.error("Please upload an image file.");
        return;
      }
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
      formData.append("image", files[0]);
      const res = await mutateAsync(formData);
      if (res.error) {
        toast.error("Failed to create meeting");
      } else {
        toast.success("Meeting created successfully");
        form.reset();
        setFiles(null);
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
        className="space-y-8 border rounded-lg mx-auto py-10 p-4 bg-card"
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

        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image</FormLabel>
              <FormControl>
                <FileUploader
                  value={files}
                  onValueChange={setFiles}
                  dropzoneOptions={dropZoneConfig}
                  className="relative bg-background rounded-lg p-2"
                >
                  <FileInput
                    id="fileInput"
                    className="outline-dashed outline-1 outline-slate-500"
                  >
                    <div className="flex items-center justify-center flex-col p-8 w-full ">
                      <CloudUpload className="text-gray-500 w-10 h-10" />
                      <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
                        <span className="font-semibold">Click to upload</span>
                        &nbsp; or drag and drop
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        SVG, PNG, JPG or GIF
                      </p>
                    </div>
                  </FileInput>
                  <FileUploaderContent>
                    {files &&
                      files.length > 0 &&
                      files.map((file, i) => (
                        <FileUploaderItem key={i} index={i}>
                          <Paperclip className="h-4 w-4 stroke-current" />
                          <span>{file.name}</span>
                        </FileUploaderItem>
                      ))}
                  </FileUploaderContent>
                </FileUploader>
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <Button disabled={isCreatingRace} className="w-full" type="submit">
          Submit
        </Button>
      </form>
    </Form>
  );
}
