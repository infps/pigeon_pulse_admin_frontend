"use client";
import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { LoadingSpinner } from "@/components/loading-spinner";
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
import { Checkbox } from "@/components/ui/checkbox";
import {
  useCreateFee,
  useCreatePrize,
  useGetFee,
  useGetPrize,
  useUpdateFee,
  useUpdatePrize,
  useCreateBetting,
  useGetBetting,
  useUpdateBetting,
} from "@/lib/api/schema";
import { FullFeeSchema, FullPrizeSchema } from "@/lib/types";
import { DialogTitle } from "./ui/dialog";
import { toast } from "sonner";

const feeSchema = z
  .object({
    name: z.string().min(1, "Fee name is required"),
    entryFee: z.number().min(0, "Entry fee must be a non-negative number"),
    isRefundable: z.boolean(),
    minEntryFees: z
      .number()
      .int()
      .min(0, "Minimum entry fees must be a non-negative integer"),
    maxBirdCount: z
      .number()
      .int()
      .min(0, "Maximum number of birds must be at least 0"),
    maxBackupBirdCount: z
      .number()
      .int()
      .min(0, "Maximum number of backup birds must be at least 0"),
    isFloatingBackup: z.boolean(),
    feesCutPercent: z
      .number()
      .min(0, "Fees cut percent must be a non-negative number")
      .max(100, "Fees cut percent cannot exceed 100"),
    hotSpot1Fee: z
      .number()
      .min(0, "Hot spot 1 fee must be a non-negative number"),
    hotSpot2Fee: z
      .number()
      .min(0, "Hot spot 2 fee must be a non-negative number"),
    hotSpot3Fee: z
      .number()
      .min(0, "Hot spot 3 fee must be a non-negative number"),
    hotSpotFinalFee: z
      .number()
      .min(0, "Hot spot final fee must be a non-negative number"),
    perchFees: z.array(
      z.object({
        birdNo: z.number().int().min(1, "Bird number must be at least 1"),
        perchFee: z
          .number()
          .min(0, "Perch fee must be a non-negative number"),
      })
    ),
  })
  .refine((data) => data.perchFees.length === data.maxBirdCount, {
    message: "Perch fees length must match max bird count",
    path: ["perchFees"],
  });

const prizeSchema = z.object({
  name: z.string().min(1, "Prize name is required"),
  distributions: z.array(
    z.object({
      fromPosition: z.number().int().min(1, "From position must be at least 1"),
      toPosition: z.number().int().min(1, "To position must be at least 1"),
      prizeValue: z
        .number()
        .min(0, "Prize value must be a non-negative number")
        .max(100, "Prize value cannot exceed 100"),
    })
  ),
});

const bettingSchema = z.object({
  name: z.string().min(1, "Betting name is required"),
  bettingCutPercent: z
    .number()
    .min(0, "Betting cut percent must be a non-negative number")
    .max(100, "Betting cut percent cannot exceed 100"),
  belgianShow1: z
    .number()
    .min(0, "Belgian Show 1 must be a non-negative number")
    .max(100, "Belgian Show 1 cannot exceed 100")
    .optional(),
  belgianShow2: z
    .number()
    .min(0, "Belgian Show 2 must be a non-negative number")
    .max(100, "Belgian Show 2 cannot exceed 100")
    .optional(),
  belgianShow3: z
    .number()
    .min(0, "Belgian Show 3 must be a non-negative number")
    .max(100, "Belgian Show 3 cannot exceed 100")
    .optional(),
  belgianShow4: z
    .number()
    .min(0, "Belgian Show 4 must be a non-negative number")
    .max(100, "Belgian Show 4 cannot exceed 100")
    .optional(),
  belgianShow5: z
    .number()
    .min(0, "Belgian Show 5 must be a non-negative number")
    .max(100, "Belgian Show 5 cannot exceed 100")
    .optional(),
  belgianShow6: z
    .number()
    .min(0, "Belgian Show 6 must be a non-negative number")
    .max(100, "Belgian Show 6 cannot exceed 100")
    .optional(),
  belgianShow7: z
    .number()
    .min(0, "Belgian Show 7 must be a non-negative number")
    .max(100, "Belgian Show 7 cannot exceed 100")
    .optional(),
  standardShow1: z
    .number()
    .min(0, "Standard Show 1 must be a non-negative number")
    .max(100, "Standard Show 1 cannot exceed 100")
    .optional(),
  standardShow2: z
    .number()
    .min(0, "Standard Show 2 must be a non-negative number")
    .max(100, "Standard Show 2 cannot exceed 100")
    .optional(),
  standardShow3: z
    .number()
    .min(0, "Standard Show 3 must be a non-negative number")
    .max(100, "Standard Show 3 cannot exceed 100")
    .optional(),
  standardShow4: z
    .number()
    .min(0, "Standard Show 4 must be a non-negative number")
    .max(100, "Standard Show 4 cannot exceed 100")
    .optional(),
  standardShow5: z
    .number()
    .min(0, "Standard Show 5 must be a non-negative number")
    .max(100, "Standard Show 5 cannot exceed 100")
    .optional(),
  standardShow6: z
    .number()
    .min(0, "Standard Show 6 must be a non-negative number")
    .max(100, "Standard Show 6 cannot exceed 100")
    .optional(),
  wta1: z
    .number()
    .min(0, "WTA 1 must be a non-negative number")
    .max(100, "WTA 1 cannot exceed 100")
    .optional(),
  wta2: z
    .number()
    .min(0, "WTA 2 must be a non-negative number")
    .max(100, "WTA 2 cannot exceed 100")
    .optional(),
  wta3: z
    .number()
    .min(0, "WTA 3 must be a non-negative number")
    .max(100, "WTA 3 cannot exceed 100")
    .optional(),
  wta4: z
    .number()
    .min(0, "WTA 4 must be a non-negative number")
    .max(100, "WTA 4 cannot exceed 100")
    .optional(),
  wta5: z
    .number()
    .min(0, "WTA 5 must be a non-negative number")
    .max(100, "WTA 5 cannot exceed 100")
    .optional(),
  standardShowPercentages: z.array(
    z.object({
      place: z.number().int().min(1, "Place must be at least 1"),
      percValue: z
        .number()
        .min(0, "Percentage value must be a non-negative number")
        .max(100, "Percentage value cannot exceed 100"),
    })
  ),
});

export default function SchemaForm({
  type,
  action,
  id,
  onClose,
}: {
  type?: "fee" | "prize" | "betting";
  action: "update" | "create";
  id?: string;
  onClose?: () => void;
}) {
  if (type === "fee" && action === "create") {
    return (
      <>
        <DialogTitle>Create Fee</DialogTitle>
        <FeeSchemaForm action="create" onClose={onClose} />
      </>
    );
  }
  if (type === "fee" && action === "update" && id) {
    return (
      <>
        <DialogTitle>Update Fee</DialogTitle>
        <FeeSchemaFormFetch id={id} onClose={onClose} />
      </>
    );
  }

  if (type === "prize" && action === "update" && id) {
    return (
      <>
        <DialogTitle>Update Prize</DialogTitle>
        <PrizeSchemaFormFetch id={id} onClose={onClose} />
      </>
    );
  }

  if (type === "prize" && action === "create") {
    return (
      <>
        <DialogTitle>Create Prize</DialogTitle>
        <PrizeSchemaForm action="create" onClose={onClose} />
      </>
    );
  }

  if (type === "betting" && action === "create") {
    return (
      <>
        <DialogTitle>Create Betting Schema</DialogTitle>
        <BettingSchemaForm action="create" onClose={onClose} />
      </>
    );
  }

  if (type === "betting" && action === "update" && id) {
    return (
      <>
        <DialogTitle>Update Betting Schema</DialogTitle>
        <BettingSchemaFormFetch id={id} onClose={onClose} />
      </>
    );
  }
}

function FeeSchemaFormFetch({ id, onClose }: { id: string; onClose?: () => void }) {
  const { data, isPending, error, isError, isSuccess } = useGetFee(id);
  const feeSchema: FullFeeSchema = data?.data;
  
  if (isPending) {
    return (
      <div className="flex items-center justify-center p-8">
        <LoadingSpinner text="Loading fee schema..." />
      </div>
    );
  }
  
  if (isError) {
    return (
      <div className="text-center p-8">
        <p className="text-lg text-destructive mb-2">Failed to load fee schema</p>
        <p className="text-sm text-muted-foreground">{error.message}</p>
      </div>
    );
  }
  
  return <FeeSchemaForm action="update" id={id} defaultValues={feeSchema} onClose={onClose} />;
}

function PrizeSchemaFormFetch({ id, onClose }: { id: string; onClose?: () => void }) {
  const { data, isPending, error, isError, isSuccess } = useGetPrize(id);
  const prizeSchema: FullPrizeSchema = data?.data;
  
  if (isPending) {
    return (
      <div className="flex items-center justify-center p-8">
        <LoadingSpinner text="Loading prize schema..." />
      </div>
    );
  }
  
  if (isError) {
    return (
      <div className="text-center p-8">
        <p className="text-lg text-destructive mb-2">Failed to load prize schema</p>
        <p className="text-sm text-muted-foreground">{error.message}</p>
      </div>
    );
  }
  
  return (
    <PrizeSchemaForm action="update" id={id} defaultValues={prizeSchema} onClose={onClose} />
  );
}

function PrizeSchemaForm({
  action,
  id,
  defaultValues,
  onClose,
}: {
  action: "update" | "create";
  id?: string;
  defaultValues?: FullPrizeSchema;
  onClose?: () => void;
}) {
    const { mutateAsync: createPrize } = useCreatePrize();
  const { mutateAsync: updatePrize } = useUpdatePrize(id ? id : "");
  const form = useForm<z.infer<typeof prizeSchema>>({
    resolver: zodResolver(prizeSchema),
    defaultValues: defaultValues || {
      name: "",
      distributions: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    name: "distributions",
    control: form.control,
  });

  async function onSubmit(values: z.infer<typeof prizeSchema>) {
    try {
      if (action === "create") {
        if (!createPrize) return;
        const { data, error, status } = await createPrize(values);
        if (error) {
          toast.error(error);
          return;
        }
        toast.success("Prize created successfully!");
        form.reset();
        onClose?.();
      } else if (action === "update" && id) {
        if (!updatePrize) return;
        const { data, error, status } = await updatePrize(values);
        if (error) {
          toast.error(error);
          return;
        }
        toast.success("Prize updated successfully!");
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
        className="space-y-4 max-w-5xl w-full mx-auto"
      >
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
        {fields.map((field, index) => (
          <div className="flex items-start space-x-4" key={field.id}>
            <FormField
              control={form.control}
              name={`distributions.${index}.fromPosition`}
              render={({ field: fromField }) => (
                <FormItem className="w-full">
                  <FormLabel>From Position</FormLabel>
                  <FormControl>
                    <Input
                      placeholder=""
                      type="text"
                      {...fromField}
                      onChange={(e) =>
                        fromField.onChange(Number(e.target.value))
                      }
                      disabled={form.formState.isSubmitting}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`distributions.${index}.toPosition`}
              render={({ field: toField }) => (
                <FormItem className="w-full">
                  <FormLabel>To Position</FormLabel>
                  <FormControl>
                    <Input
                      placeholder=""
                      type="text"
                      {...toField}
                      onChange={(e) => toField.onChange(Number(e.target.value))}
                      disabled={form.formState.isSubmitting}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`distributions.${index}.prizeValue`}
              render={({ field: prizeValueField }) => (
                <FormItem className="w-full">
                  <FormLabel>Prize Value</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder=""
                        type="text"
                        {...prizeValueField}
                        onChange={(e) =>
                          prizeValueField.onChange(Number(e.target.value))
                        }
                        disabled={form.formState.isSubmitting}
                        className="pr-8"
                      />
                      <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                        %
                      </span>
                    </div>
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              className="mt-5"
              type="button"
              variant="destructive"
              onClick={() => remove(index)}
              disabled={form.formState.isSubmitting}
            >
              Remove
            </Button>
          </div>
        ))}
        <div className="flex items-center justify-between">
          <Button
            type="button"
            onClick={() =>
              append({ fromPosition: 1, toPosition: 1, prizeValue: 0 })
            }
            disabled={form.formState.isSubmitting}
          >
            Add Distribution
          </Button>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {action === "create" ? "Create Prize" : "Update Prize"}
          </Button>
        </div>
      </form>
    </Form>
  );
}function BettingSchemaFormFetch({ id, onClose }: { id: string; onClose?: () => void }) {
  const { data, isPending, error, isError, isSuccess } = useGetBetting(id);
  const bettingSchemaData = data?.data;
  
  if (isPending) {
    return (
      <div className="flex items-center justify-center p-8">
        <LoadingSpinner text="Loading betting schema..." />
      </div>
    );
  }
  
  if (isError) {
    return (
      <div className="text-center p-8">
        <p className="text-lg text-destructive mb-2">Failed to load betting schema</p>
        <p className="text-sm text-muted-foreground">{error.message}</p>
      </div>
    );
  }
  
  return (
    <BettingSchemaForm action="update" id={id} defaultValues={bettingSchemaData} onClose={onClose} />
  );
}

function BettingSchemaForm({
  action,
  id,
  defaultValues,
  onClose,
}: {
  action: "update" | "create";
  id?: string;
  defaultValues?: any;
  onClose?: () => void;
}) {
  const { mutateAsync: createBetting } = useCreateBetting();
  const { mutateAsync: updateBetting } = useUpdateBetting(id ? id : "");
  const form = useForm<z.infer<typeof bettingSchema>>({
    resolver: zodResolver(bettingSchema),
    defaultValues: defaultValues || {
      name: "",
      belgianShow1: 0,
      belgianShow2: 0,
      belgianShow3: 0,
      belgianShow4: 0,
      belgianShow5: 0,
      belgianShow6: 0,
      belgianShow7: 0,
      standardShow1: 0,
      standardShow2: 0,
      standardShow3: 0,
      standardShow4: 0,
      standardShow5: 0,
      standardShow6: 0,
      wta1: 0,
      wta2: 0,
      wta3: 0,
      wta4: 0,
      wta5: 0,
      bettingCutPercent: 0,
      standardShowPercentages: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    name: "standardShowPercentages",
    control: form.control,
  });

  async function onSubmit(values: z.infer<typeof bettingSchema>) {
    try {
      if (action === "create") {
        if (!createBetting) return;
        const { data, error, status } = await createBetting(values);
        if (error) {
          toast.error(error);
          return;
        }
        toast.success("Betting schema created successfully!");
        form.reset();
        onClose?.();
      } else if (action === "update" && id) {
        if (!updateBetting) return;
        const { data, error, status } = await updateBetting(values);
        if (error) {
          toast.error(error);
          return;
        }
        toast.success("Betting schema updated successfully!");
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
        className="space-y-6 max-w-5xl w-full mx-auto"
      >
        {/* Name Field */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter betting schema name"
                  type="text"
                  {...field}
                  disabled={form.formState.isSubmitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Belgian Show Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Belgian Show</h3>
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6, 7].map((num) => (
              <FormField
                key={`belgianShow${num}`}
                control={form.control}
                name={`belgianShow${num}` as any}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Show {num}</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder="0"
                          type="text"
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                          disabled={form.formState.isSubmitting}
                          className="pr-8"
                        />
                        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                          %
                        </span>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
          </div>
        </div>

        {/* Standard Show Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Standard Show</h3>
          <div className="grid grid-cols-2 gap-8">
            {/* Left side - Standard Show checkboxes */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {[1, 2, 3, 4, 5, 6].map((num) => (
                  <FormField
                    key={`standardShow${num}`}
                    control={form.control}
                    name={`standardShow${num}` as any}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Show {num}</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              placeholder="0"
                              type="text"
                              {...field}
                              onChange={(e) => field.onChange(Number(e.target.value))}
                              disabled={form.formState.isSubmitting}
                              className="pr-8"
                            />
                            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                              %
                            </span>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
              </div>
            </div>

            {/* Right side - Standard Show Percentages Table */}
            <div className="space-y-4">
              <h4 className="font-medium">Position Percentages</h4>
              <div className="space-y-2">
                {fields.map((field, index) => (
                  <div className="flex items-start space-x-2" key={field.id}>
                    <FormField
                      control={form.control}
                      name={`standardShowPercentages.${index}.place`}
                      render={({ field: placeField }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <Input
                              placeholder="Place"
                              type="text"
                              {...placeField}
                              onChange={(e) =>
                                placeField.onChange(Number(e.target.value))
                              }
                              disabled={form.formState.isSubmitting}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`standardShowPercentages.${index}.percValue`}
                      render={({ field: percValueField }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <div className="relative">
                              <Input
                                placeholder="Percentage"
                                type="text"
                                {...percValueField}
                                onChange={(e) =>
                                  percValueField.onChange(Number(e.target.value))
                                }
                                disabled={form.formState.isSubmitting}
                                className="pr-8"
                              />
                              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                                %
                              </span>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      onClick={() => remove(index)}
                      disabled={form.formState.isSubmitting}
                    >
                      ×
                    </Button>
                  </div>
                ))}
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={() => append({ place: 1, percValue: 0 })}
                disabled={form.formState.isSubmitting}
                className="w-full"
              >
                Add Position
              </Button>
            </div>
          </div>
        </div>

        {/* WTA Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">WTA (Winner Takes All)</h3>
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5].map((num) => (
              <FormField
                key={`wta${num}`}
                control={form.control}
                name={`wta${num}` as any}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>WTA {num}</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder="0"
                          type="text"
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                          disabled={form.formState.isSubmitting}
                          className="pr-8"
                        />
                        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                          %
                        </span>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
          </div>
        </div>

        {/* Cut Percent Section */}
        <FormField
          control={form.control}
          name="bettingCutPercent"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Percent for Expenses</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    placeholder="0"
                    type="text"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    disabled={form.formState.isSubmitting}
                    className="pr-8 max-w-md"
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    %
                  </span>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Action Buttons */}
        <div className="flex gap-4 justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={form.formState.isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {action === "create" ? "Create Betting Schema" : "Update Betting Schema"}
          </Button>
        </div>
      </form>
    </Form>
  );
}

function FeeSchemaForm({
  action,
  id,
  defaultValues,
  onClose,
}: {
  action: "update" | "create";
  id?: string;
  defaultValues?: FullFeeSchema;
  onClose?: () => void;
}) {
  const { mutateAsync: createFee } = useCreateFee();
  const { mutateAsync: updateFee } = useUpdateFee(id ? id : "");
  const form = useForm<z.infer<typeof feeSchema>>({
    resolver: zodResolver(feeSchema),
    defaultValues: defaultValues || {
      name: "",
      entryFee: 0,
      isRefundable: false,
      minEntryFees: 0,
      maxBirdCount: 1,
      maxBackupBirdCount: 0,
      isFloatingBackup: false,
      feesCutPercent: 0,
      hotSpot1Fee: 0,
      hotSpot2Fee: 0,
      hotSpot3Fee: 0,
      hotSpotFinalFee: 0,
      perchFees: [{ birdNo: 1, perchFee: 0 }],
    },
  });

  const maxBirdCountValue = form.watch("maxBirdCount");

  // Update perchFees array when maxBirdCount changes
  const handleMaxBirdCountChange = (newMaxBirdCount: number) => {
    const currentPerchFees = form.getValues("perchFees") || [];
    const newPerchFees = Array.from({ length: newMaxBirdCount }, (_, i) => ({
      birdNo: i + 1,
      perchFee: currentPerchFees[i]?.perchFee ?? 0,
    }));
    form.setValue("perchFees", newPerchFees);
  };

  async function onSubmit(values: z.infer<typeof feeSchema>) {
    try {
      if (action === "create") {
        if (!createFee) return;
        const { data, error, status } = await createFee(values);
        if (error) {
          toast.error(error);
          return;
        }
        toast.success("Fee created successfully!");
        form.reset();
        onClose?.();
      } else if (action === "update" && id) {
        if (!updateFee) return;
        const { data, error, status } = await updateFee(values);
        if (error) {
          toast.error(error);
          return;
        }
        toast.success("Fee updated successfully!");
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
        className="space-y-4 max-w-5xl w-full mx-auto"
      >
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
        <div className="flex items-center space-x-4">
          <FormField
            control={form.control}
            name="entryFee"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Entry Fee</FormLabel>
                <FormControl>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                      $
                    </span>
                    <Input
                      placeholder=""
                      type="text"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      disabled={form.formState.isSubmitting}
                      className="pl-8"
                    />
                  </div>
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="feesCutPercent"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Fees Cut Percent</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      placeholder=""
                      type="text"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      disabled={form.formState.isSubmitting}
                      className="pr-8"
                    />
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                      %
                    </span>
                  </div>
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex space-x-4">
          <FormField
            control={form.control}
            name="minEntryFees"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Min entry fees per team</FormLabel>
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
            name="isRefundable"
            render={({ field }) => (
              <FormItem className="flex flex-row space-x-3 w-full space-y-0 p-2 self-end">
                <FormControl>
                  <Checkbox
                    className="border-black"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={form.formState.isSubmitting}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>
                    Allow entry fee refund when bird is lost
                  </FormLabel>

                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-4 gap-4">
          <FormField
            control={form.control}
            name="hotSpot1Fee"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hot Spot 1</FormLabel>
                <FormControl>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                      $
                    </span>
                    <Input
                      placeholder=""
                      type="text"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      disabled={form.formState.isSubmitting}
                      className="pl-8"
                    />
                  </div>
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="hotSpot2Fee"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hot Spot 2</FormLabel>
                <FormControl>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                      $
                    </span>
                    <Input
                      placeholder=""
                      type="text"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      disabled={form.formState.isSubmitting}
                      className="pl-8"
                    />
                  </div>
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="hotSpot3Fee"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hot Spot 3</FormLabel>
                <FormControl>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                      $
                    </span>
                    <Input
                      placeholder=""
                      type="text"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      disabled={form.formState.isSubmitting}
                      className="pl-8"
                    />
                  </div>
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="hotSpotFinalFee"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hot Spot Final</FormLabel>
                <FormControl>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                      $
                    </span>
                    <Input
                      placeholder=""
                      type="text"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      disabled={form.formState.isSubmitting}
                      className="pl-8"
                    />
                  </div>
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex space-x-4">
          <FormField
            control={form.control}
            name="maxBirdCount"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Maximum number of birds</FormLabel>
                <FormControl>
                  <Input
                    placeholder=""
                    type="text"
                    {...field}
                    onChange={(e) => {
                      const value = Number(e.target.value);
                      field.onChange(value);
                      if (value >= 0) {
                        handleMaxBirdCountChange(value);
                      }
                    }}
                    disabled={form.formState.isSubmitting}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="maxBackupBirdCount"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Maximum number of backup birds</FormLabel>
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
        
        {/* Dynamic Perch Fees Section */}
        {maxBirdCountValue > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Perch Fees</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: maxBirdCountValue }, (_, index) => (
                <FormField
                  key={index}
                  control={form.control}
                  name={`perchFees.${index}.perchFee`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bird {index + 1} - Perch Fee</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                            $
                          </span>
                          <Input
                            placeholder="0"
                            type="text"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                            disabled={form.formState.isSubmitting}
                            className="pl-8"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
            </div>
          </div>
        )}
        <FormField
          control={form.control}
          name="isFloatingBackup"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={form.formState.isSubmitting}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Floating Backup</FormLabel>

                <FormMessage />
              </div>
            </FormItem>
          )}
        />
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {action === "create" ? "Create Fee" : "Update Fee"}
        </Button>
      </form>
    </Form>
  );
}
