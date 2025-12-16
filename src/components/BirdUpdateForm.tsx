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
import { EventInventoryItemDetail } from "@/lib/types";
import { updateEventInventoryItem } from "@/lib/api/eventInventory";

const formSchema = z.object({
  // Band fields
  band_1: z.string().min(1, "Band 1 is required"),
  band_2: z.string().min(1, "Band 2 is required"),
  band_3: z.string().min(1, "Band 3 is required"),
  band_4: z.string().min(1, "Band 4 is required"),
  rfId: z.string().optional(),
  
  // Bird properties
  color: z.string().min(1, "Color is required"),
  birdName: z.string().optional(),
  note: z.string().optional(),
  sex: z.enum(["N/A", "COCK", "HEN"]),
  playAttentionSound: z.boolean().optional(),
  
  // Bird status
  is_active: z.boolean(),
  is_lost: z.boolean(),
  lost_date: z.date().nullable(),
  lostIdRace: z.coerce.number().nullable().optional(),
  
  // Event dates
  arrivalDate: z.date().nullable(),
  departureDate: z.date().nullable(),
  
  // Fees
  perchFeeValue: z.coerce.number().nullable().optional(),
  entryFeeValue: z.coerce.number().nullable().optional(),
  entryFeePaid: z.boolean().optional(),
  entryRefund: z.coerce.number().nullable().optional(),
  betsRefund: z.coerce.number().nullable().optional(),
  hotSpotFeeValue: z.coerce.number().nullable().optional(),
  hotSpotRefund: z.coerce.number().nullable().optional(),
  
  // Backup and transfer
  isBackup: z.boolean().optional(),
  transferDue: z.coerce.number().nullable().optional(),
  
  // Belgian show bets
  belgianShowBet1: z.coerce.number().nullable().optional(),
  belgianShowBet2: z.coerce.number().nullable().optional(),
  belgianShowBet3: z.coerce.number().nullable().optional(),
  belgianShowBet4: z.coerce.number().nullable().optional(),
  belgianShowBet5: z.coerce.number().nullable().optional(),
  belgianShowBet6: z.coerce.number().nullable().optional(),
  belgianShowBet7: z.coerce.number().nullable().optional(),
  
  // Standard show bets
  standardShowBet1: z.coerce.number().nullable().optional(),
  standardShowBet2: z.coerce.number().nullable().optional(),
  standardShowBet3: z.coerce.number().nullable().optional(),
  standardShowBet4: z.coerce.number().nullable().optional(),
  standardShowBet5: z.coerce.number().nullable().optional(),
  standardShowBet6: z.coerce.number().nullable().optional(),
  
  // WTA bets
  wtaBet1: z.coerce.number().nullable().optional(),
  wtaBet2: z.coerce.number().nullable().optional(),
  wtaBet3: z.coerce.number().nullable().optional(),
  wtaBet4: z.coerce.number().nullable().optional(),
  wtaBet5: z.coerce.number().nullable().optional(),
  
  // Bet status
  isBetActive: z.number().nullable().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface BirdUpdateFormProps {
  bird: EventInventoryItemDetail;
}

export default function BirdUpdateForm({ bird }: BirdUpdateFormProps) {
  const { mutateAsync: updateBird } = updateEventInventoryItem(bird.idEventInventoryItem);
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema) as any,
    defaultValues: {
      band_1: bird.bird?.band1 ?? "",
      band_2: bird.bird?.band2 ?? "",
      band_3: bird.bird?.band3 ?? "",
      band_4: bird.bird?.band4 ?? "",
      rfId: bird.bird?.rfId ?? "",
      color: bird.bird?.color ?? "",
      birdName: bird.bird?.birdName ?? "",
      note: bird.bird?.note ?? "",
      sex: bird.bird?.sex === 0 ? "N/A" : bird.bird?.sex === 1 ? "COCK" : "HEN",
      playAttentionSound: bird.bird?.playAttentionSound === 1,
      is_active: bird.bird?.isActive === 1,
      is_lost: bird.bird?.isLost === 1,
      lost_date: bird.bird?.lostDate ? new Date(bird.bird.lostDate) : null,
      lostIdRace: bird.bird?.lostIdRace ?? null,
      arrivalDate: bird.arrivalTime ? new Date(bird.arrivalTime) : null,
      departureDate: bird.departureDate ? new Date(bird.departureDate) : null,
      perchFeeValue: bird.perchFeeValue ?? null,
      entryFeeValue: bird.entryFeeValue ?? null,
      entryFeePaid: bird.entryFeePaid === 1,
      entryRefund: bird.entryRefund ?? null,
      betsRefund: bird.betsRefund ?? null,
      hotSpotFeeValue: bird.hotSpotFeeValue ?? null,
      hotSpotRefund: bird.hotSpotRefund ?? null,
      isBackup: bird.isBackup === 1,
      transferDue: bird.transferDue ?? null,
      belgianShowBet1: bird.belgianShowBet1 ?? null,
      belgianShowBet2: bird.belgianShowBet2 ?? null,
      belgianShowBet3: bird.belgianShowBet3 ?? null,
      belgianShowBet4: bird.belgianShowBet4 ?? null,
      belgianShowBet5: bird.belgianShowBet5 ?? null,
      belgianShowBet6: bird.belgianShowBet6 ?? null,
      belgianShowBet7: bird.belgianShowBet7 ?? null,
      standardShowBet1: bird.standardShowBet1 ?? null,
      standardShowBet2: bird.standardShowBet2 ?? null,
      standardShowBet3: bird.standardShowBet3 ?? null,
      standardShowBet4: bird.standardShowBet4 ?? null,
      standardShowBet5: bird.standardShowBet5 ?? null,
      standardShowBet6: bird.standardShowBet6 ?? null,
      wtaBet1: bird.wtaBet1 ?? null,
      wtaBet2: bird.wtaBet2 ?? null,
      wtaBet3: bird.wtaBet3 ?? null,
      wtaBet4: bird.wtaBet4 ?? null,
      wtaBet5: bird.wtaBet5 ?? null,
      isBetActive: bird.isBetActive ?? null,
    },
  });

  async function onSubmit(values: FormData) {
    try {
      if (!updateBird) return;
      
      const payload = {
        ...values,
        sex: values.sex === "N/A" ? 0 : values.sex === "COCK" ? 1 : 2,
        is_active: values.is_active ? 1 : 0,
        is_lost: values.is_lost ? 1 : 0,
        playAttentionSound: values.playAttentionSound ? 1 : 0,
        entryFeePaid: values.entryFeePaid ? 1 : 0,
        isBackup: values.isBackup ? 1 : 0,
      };
      
      const { data, status, error } = await updateBird(payload);
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

  const calculateTotal = (type: 'belgian' | 'standard' | 'wta') => {
    if (type === 'belgian') {
      return (
        (form.watch("belgianShowBet1") || 0) +
        (form.watch("belgianShowBet2") || 0) +
        (form.watch("belgianShowBet3") || 0) +
        (form.watch("belgianShowBet4") || 0) +
        (form.watch("belgianShowBet5") || 0) +
        (form.watch("belgianShowBet6") || 0) +
        (form.watch("belgianShowBet7") || 0)
      );
    } else if (type === 'standard') {
      return (
        (form.watch("standardShowBet1") || 0) +
        (form.watch("standardShowBet2") || 0) +
        (form.watch("standardShowBet3") || 0) +
        (form.watch("standardShowBet4") || 0) +
        (form.watch("standardShowBet5") || 0) +
        (form.watch("standardShowBet6") || 0)
      );
    } else {
      return (
        (form.watch("wtaBet1") || 0) +
        (form.watch("wtaBet2") || 0) +
        (form.watch("wtaBet3") || 0) +
        (form.watch("wtaBet4") || 0) +
        (form.watch("wtaBet5") || 0)
      );
    }
  };

  const grandTotal = calculateTotal('belgian') + calculateTotal('standard') + calculateTotal('wta');

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 max-w-6xl mx-auto py-6 px-4"
      >
        {/* Breeder Section */}
        <div className="border rounded-lg p-4 bg-white">
          <h3 className="text-sm font-semibold mb-2">Breeder</h3>
          <Input
            value={`${bird.bird?.breeder?.lastName || ""}, ${bird.bird?.breeder?.firstName || ""}`.trim()}
            readOnly
            className="bg-gray-50"
          />
        </div>

        {/* Band ID and Properties */}
        <div className="grid grid-cols-2 gap-4">
          {/* Band ID Section */}
          <div className="border rounded-lg p-4 bg-white">
            <h3 className="text-sm font-semibold mb-3">Band ID</h3>
            <div className="grid grid-cols-4 gap-2 mb-3">
              {[
                { name: "band_1" as const, label: "Assc" },
                { name: "band_2" as const, label: "Year" },
                { name: "band_3" as const, label: "Letter" },
                { name: "band_4" as const, label: "Number" },
              ].map((field) => (
                <FormField
                  key={field.name}
                  control={form.control}
                  name={field.name}
                  render={({ field: formField }) => (
                    <FormItem>
                      <FormLabel className="text-xs">{field.label}</FormLabel>
                      <FormControl>
                        <Input {...formField} value={formField.value || ""} className="h-9" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
            </div>
            <FormField
              control={form.control}
              name="rfId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs">ED</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value || ""} className="h-9" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Properties Section */}
          <div className="border rounded-lg p-4 bg-white">
            <h3 className="text-sm font-semibold mb-3">Properties</h3>
            <div className="space-y-3">
              <FormField
                control={form.control}
                name="color"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs">Color</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value || ""} className="h-9" />
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
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-9">
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="N/A">N/A</SelectItem>
                          <SelectItem value="COCK">Cock</SelectItem>
                          <SelectItem value="HEN">Hen</SelectItem>
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
                        <Input {...field} value={field.value || ""} className="h-9" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Status and Bird Number/Dates */}
        <div className="grid grid-cols-2 gap-4">
          {/* Status Section */}
          <div className="border rounded-lg p-4 bg-white">
            <h3 className="text-sm font-semibold mb-3">Status</h3>
            <div className="space-y-3">
              <div className="flex gap-4">
                <FormField
                  control={form.control}
                  name="is_active"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <FormLabel className="text-xs !mt-0">Active</FormLabel>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="is_lost"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <FormLabel className="text-xs !mt-0">Lost</FormLabel>
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="lost_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={cn("text-xs", !form.watch("is_lost") && "text-gray-400")}>
                      Lost date
                    </FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            disabled={!form.watch("is_lost")}
                            className={cn(
                              "w-full h-9 justify-start text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? format(field.value, "M/d/yyyy") : "Pick a date"}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value as Date | undefined}
                          onSelect={field.onChange}
                          disabled={!form.watch("is_lost")}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lostIdRace"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={cn("text-xs", !form.watch("is_lost") && "text-gray-400")}>
                      Lost race number
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        disabled={!form.watch("is_lost")}
                        value={field.value ?? ""}
                        onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)}
                        className="h-9"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Bird Number and Dates */}
          <div className="border rounded-lg p-4 bg-white">
            <div className="space-y-3">
              <div>
                <FormLabel className="text-xs">Bird number</FormLabel>
                <Input value={bird.birdNo ?? ""} readOnly className="h-9 bg-gray-50" />
              </div>
              <FormField
                control={form.control}
                name="arrivalDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs">Arrival date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full h-9 justify-start text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? format(field.value, "M/d/yyyy") : "Pick a date"}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value as Date | undefined}
                          onSelect={field.onChange}
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
                    <FormLabel className="text-xs">Departure date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full h-9 justify-start text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? format(field.value, "M/d/yyyy") : "Pick a date"}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value as Date | undefined}
                          onSelect={field.onChange}
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

        {/* Note Section */}
        <div className="border rounded-lg p-4 bg-white">
          <h3 className="text-sm font-semibold mb-2">Note</h3>
          <FormField
            control={form.control}
            name="note"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea {...field} value={field.value || ""} className="min-h-[80px] resize-none" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="playAttentionSound"
            render={({ field }) => (
              <FormItem className="flex items-center space-x-2 mt-2">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <FormLabel className="text-xs !mt-0">Play attention sound on basketing</FormLabel>
              </FormItem>
            )}
          />
        </div>

        {/* Fees Section */}
        <div className="border rounded-lg p-4 bg-white">
          <h3 className="text-sm font-semibold mb-3">Fees</h3>
          <div className="grid grid-cols-4 gap-3">
            <FormField
              control={form.control}
              name="perchFeeValue"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center gap-2">
                    <Checkbox defaultChecked={!!bird.perchFeeValue} />
                    <FormLabel className="text-xs">Perch fee</FormLabel>
                  </div>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      step="0.01"
                      value={field.value ?? ""}
                      onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)}
                      className="h-9"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="entryFeeValue"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center gap-2">
                    <Checkbox defaultChecked={!!bird.entryFeeValue} />
                    <FormLabel className="text-xs">Entry fee</FormLabel>
                  </div>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      step="0.01"
                      value={field.value ?? ""}
                      onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)}
                      className="h-9"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="entryFeePaid"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center gap-2">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormLabel className="text-xs">Entry fee paid</FormLabel>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="entryRefund"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center gap-2">
                    <Checkbox defaultChecked={!!bird.entryRefund} />
                    <FormLabel className="text-xs">Entry refund</FormLabel>
                  </div>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      step="0.01"
                      value={field.value ?? ""}
                      onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)}
                      className="h-9"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid grid-cols-4 gap-3 mt-3">
            <FormField
              control={form.control}
              name="isBackup"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center gap-2">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormLabel className="text-xs">Backup brd</FormLabel>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="betsRefund"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center gap-2">
                    <Checkbox defaultChecked={!!bird.betsRefund} />
                    <FormLabel className="text-xs">Bets refund</FormLabel>
                  </div>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      step="0.01"
                      value={field.value ?? ""}
                      onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)}
                      className="h-9"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="hotSpotFeeValue"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center gap-2">
                    <Checkbox defaultChecked={!!bird.hotSpotFeeValue} />
                    <FormLabel className="text-xs">Hot spot fee</FormLabel>
                  </div>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      step="0.01"
                      value={field.value ?? ""}
                      onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)}
                      className="h-9"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="hotSpotRefund"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center gap-2">
                    <Checkbox defaultChecked={!!bird.hotSpotRefund} />
                    <FormLabel className="text-xs">Hot spot refund</FormLabel>
                  </div>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      step="0.01"
                      value={field.value ?? ""}
                      onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)}
                      className="h-9"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid grid-cols-2 gap-3 mt-3">
            <FormField
              control={form.control}
              name="transferDue"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs">Transfer due</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      value={field.value ?? ""}
                      onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)}
                      className="h-9"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Classes Section */}
        <div className="border rounded-lg p-4 bg-white">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Checkbox defaultChecked />
              <h3 className="text-sm font-semibold">Classes</h3>
            </div>
            <div className="text-sm">
              <span className="mr-2">Total</span>
              <span className="font-semibold">${grandTotal.toFixed(2)}</span>
            </div>
          </div>
          
          <p className="text-xs text-gray-500 mb-3">Press table band to check or uncheck classes</p>
          
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="p-2 text-left" colSpan={7}>Belgian show</th>
                  <th className="p-2 text-left" colSpan={6}>Standard show</th>
                  <th className="p-2 text-left" colSpan={5}>WTA</th>
                </tr>
                <tr className="border-b bg-gray-50">
                  <th className="p-2">A<br/>20.00</th>
                  <th className="p-2">B<br/>30.00</th>
                  <th className="p-2">C<br/>50.00</th>
                  <th className="p-2">D<br/>20.00</th>
                  <th className="p-2">E<br/>30.00</th>
                  <th className="p-2">F<br/>50.00</th>
                  <th className="p-2">G<br/>100.00</th>
                  <th className="p-2">A<br/>20.00</th>
                  <th className="p-2">B<br/>30.00</th>
                  <th className="p-2">C<br/>50.00</th>
                  <th className="p-2">D<br/>20.00</th>
                  <th className="p-2">E<br/>30.00</th>
                  <th className="p-2">F<br/>50.00</th>
                  <th className="p-2">G<br/>100.00</th>
                  <th className="p-2">H<br/>100.00</th>
                  <th className="p-2">I<br/>100.00</th>
                  <th className="p-2">J<br/>100.00</th>
                  <th className="p-2">K<br/>100.00</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  {[
                    "belgianShowBet1", "belgianShowBet2", "belgianShowBet3", "belgianShowBet4",
                    "belgianShowBet5", "belgianShowBet6", "belgianShowBet7",
                    "standardShowBet1", "standardShowBet2", "standardShowBet3", "standardShowBet4",
                    "standardShowBet5", "standardShowBet6",
                    "wtaBet1", "wtaBet2", "wtaBet3", "wtaBet4", "wtaBet5",
                  ].map((fieldName) => (
                    <td key={fieldName} className="p-1">
                      <FormField
                        control={form.control}
                        name={fieldName as any}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                {...field}
                                type="number"
                                step="0.01"
                                value={field.value ?? ""}
                                onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)}
                                className="h-8 text-center"
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-2 pt-4">
          <Button type="submit" size="sm">
            Save and New (Ctrl+S)
          </Button>
          <Button type="submit" size="sm">
            Save and Exit (Enter)
          </Button>
          <Button type="button" variant="outline" size="sm">
            Cancel (Esc)
          </Button>
        </div>
      </form>
    </Form>
  );
}
