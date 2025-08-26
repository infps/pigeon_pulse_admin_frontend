"use client";
import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
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
import { Checkbox } from "@/components/ui/checkbox";
import {
  useCreateFee,
  useCreatePrize,
  useGetFee,
  useGetPrize,
  useUpdateFee,
  useUpdatePrize,
} from "@/lib/api/schema";
import { FullFeeSchema, FullPrizeSchema } from "@/lib/types";
import { DialogTitle } from "./ui/dialog";
import { toast } from "sonner";

const feeSchema = z.object({
  name: z.string().min(1, "Name is required"),
  entryFee: z.number().min(0, "Entry fee must be a positive number"),
  perchFee: z.number().min(0, "Perch fee must be a positive number"),
  expensePercentage: z
    .number()
    .min(0, "Percent for expenses must be a positive number")
    .max(100, "Percent for expenses cannot exceed 100"),
  minEntryFee: z.number().min(0, "Min entry fee must be a positive number"),
  entryFeeRefundable: z.boolean(),
  hs1Fee: z.number().min(0, "HS1 fee must be a positive number"),
  hs2Fee: z.number().min(0, "HS2 fee must be a positive number"),
  hs3Fee: z.number().min(0, "HS3 fee must be a positive number"),
  finalRaceFee: z.number().min(0, "Final race fee must be a positive number"),
  maxBirds: z
    .number()
    .min(1, "Limit of main birds per team must be at least 1"),
  maxBackupBirds: z
    .number()
    .min(0, "Limit of backup birds per team must be a positive number"),
  floatingBackup: z.boolean(),
});

const prizeSchema = z.object({
  name: z.string().min(1, "Name is required"),
  distributions: z.array(
    z.object({
      fromPosition: z.number().int().min(1, "From position must be at least 1"),
      toPosition: z.number().int().min(1, "To position must be at least 1"),
      percentage: z
        .number()
        .min(0, "Percentage must be a non-negative number")
        .max(100, "Percentage cannot exceed 100"),
    })
  ),
});

export default function SchemaForm({
  type,
  action,
  id,
  onClose,
}: {
  type?: "fee" | "prize";
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
}

function FeeSchemaFormFetch({ id, onClose }: { id: string; onClose?: () => void }) {
  const { data, isPending, error, isError, isSuccess } = useGetFee(id);
  const feeSchema: FullFeeSchema = data?.data;
  if (isPending) return <p>Loading...</p>;
  if (isError) return <p>Error: {error.message}</p>;
  return <FeeSchemaForm action="update" id={id} defaultValues={feeSchema} onClose={onClose} />;
}

function PrizeSchemaFormFetch({ id, onClose }: { id: string; onClose?: () => void }) {
  const { data, isPending, error, isError, isSuccess } = useGetPrize(id);
  const prizeSchema: FullPrizeSchema = data?.data;
  if (isPending) return <p>Loading...</p>;
  if (isError) return <p>Error: {error.message}</p>;
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
              name={`distributions.${index}.percentage`}
              render={({ field: percentageField }) => (
                <FormItem className="w-full">
                  <FormLabel>Percentage</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder=""
                        type="text"
                        {...percentageField}
                        onChange={(e) =>
                          percentageField.onChange(Number(e.target.value))
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
              append({ fromPosition: 1, toPosition: 1, percentage: 0 })
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
      perchFee: 0,
      expensePercentage: 0,
      minEntryFee: 0,
      entryFeeRefundable: false,
      hs1Fee: 0,
      hs2Fee: 0,
      hs3Fee: 0,
      finalRaceFee: 0,
      maxBirds: 1,
      maxBackupBirds: 0,
      floatingBackup: false,
    },
  });

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
            name="perchFee"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Perch Fee</FormLabel>
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
            name="expensePercentage"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Percent for expenses</FormLabel>
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
            name="minEntryFee"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Min entry fees per team</FormLabel>
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
            name="entryFeeRefundable"
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
            name="hs1Fee"
            render={({ field }) => (
              <FormItem>
                <FormLabel>HS1</FormLabel>
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
            name="hs2Fee"
            render={({ field }) => (
              <FormItem>
                <FormLabel>HS 2</FormLabel>
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
            name="hs3Fee"
            render={({ field }) => (
              <FormItem>
                <FormLabel>HS 3</FormLabel>
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
            name="finalRaceFee"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Final Race</FormLabel>
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
            name="maxBirds"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Limit of main birds per team</FormLabel>
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
            name="maxBackupBirds"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Limit of backup birds per team</FormLabel>
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
        <FormField
          control={form.control}
          name="floatingBackup"
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
