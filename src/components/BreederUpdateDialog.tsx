"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { useUpdateBreeder, useGetBreeder } from "@/lib/api/user";
import { BreederAddressBook } from "@/lib/types";
import { toast } from "sonner";
import { LoadingSpinner } from "./loading-spinner";

const updateBreederSchema = z.object({
  firstName: z.string().min(1, "First Name is required").optional(),
  lastName: z.string().min(1, "Last Name is required").optional(),
  country: z.string().min(1, "Country is required").optional(),
  address1: z.string().min(1, "Address Line 1 is required").optional(),
  city1: z.string().min(1, "City is required").optional(),
  state1: z.string().min(1, "State is required").optional(),
  zip1: z.string().min(1, "ZIP Code is required").optional(),
  address2: z.string().optional(),
  city2: z.string().optional(),
  state2: z.string().optional(),
  zip2: z.string().optional(),
  phone: z.string().min(1, "Phone number is required").optional(),
  cell: z.string().optional(),
  fax: z.string().optional(),
  email: z.string().email("Invalid email address").optional(),
  email2: z.string().email("Invalid email address").optional().or(z.literal("")),
  webAddress: z.string().optional(),
  socialSecurityNumber: z.string().optional(),
  status: z.number().int().min(0).max(2).optional(),
  statusDate: z.string().optional(),
  note: z.string().optional(),
  loginName: z.string().optional(),
  loginPassword: z.string().optional().or(z.literal("")),
  sms: z.string().optional(),
  taxNumber: z.string().optional(),
  defNameAgn: z.string().optional(),
  defNameAs: z.string().optional(),
});

type UpdateBreederFormData = z.infer<typeof updateBreederSchema>;

interface BreederUpdateDialogProps {
  breederId: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BreederUpdateDialog({
  breederId,
  open,
  onOpenChange,
}: BreederUpdateDialogProps) {
  const { data: breederData, isPending: isLoadingBreeder } = useGetBreeder(breederId);
  const breeder = breederData?.data as BreederAddressBook | undefined;

  const [isDefaultAddress1, setIsDefaultAddress1] = useState(false);
  const [isDefaultAddress2, setIsDefaultAddress2] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<UpdateBreederFormData>({
    resolver: zodResolver(updateBreederSchema),
  });

  // Update form when breeder data is loaded
  useEffect(() => {
    if (breeder) {
      reset({
        firstName: breeder.firstName || "",
        lastName: breeder.lastName || "",
        country: breeder.country || "",
        address1: breeder.address1 || "",
        city1: breeder.city1 || "",
        state1: breeder.state1 || "",
        zip1: breeder.zip1 || "",
        address2: breeder.address2 || "",
        city2: breeder.city2 || "",
        state2: breeder.state2 || "",
        zip2: breeder.zip2 || "",
        phone: breeder.phone || "",
        cell: breeder.cell || "",
        fax: breeder.fax || "",
        email: breeder.email || "",
        email2: breeder.email2 || "",
        webAddress: breeder.webAddress || "",
        socialSecurityNumber: breeder.socialSecurityNumber || "",
        status: breeder.status || 0,
        statusDate: breeder.statusDate || "",
        note: breeder.note || "",
        loginName: breeder.loginName || "",
        loginPassword: "",
        sms: breeder.sms || "",
        taxNumber: breeder.taxNumber || "",
        defNameAgn: breeder.defNameAgn || "",
        defNameAs: breeder.defNameAs || "",
      });
      setIsDefaultAddress1(breeder.isDefaultAddress1 === 1);
      setIsDefaultAddress2(breeder.isDefaultAddress1 === 0);
    }
  }, [breeder, reset]);

  const { mutateAsync: updateBreeder, isPending } = useUpdateBreeder(breederId);

  const onSubmit = async (data: UpdateBreederFormData) => {
    try {
      // Remove empty password field
      if (!data.loginPassword) {
        delete data.loginPassword;
      }

      // Remove empty email2 field
      if (!data.email2) {
        delete data.email2;
      }
      if(!updateBreeder) return;
      await updateBreeder({ data });
      toast.success("Breeder profile updated successfully");
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error?.message || "Failed to update breeder profile");
    }
  };

  const statusValue = watch("status");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Breeder {breeder?.number || breeder?.idBreeder || ""}
          </DialogTitle>
        </DialogHeader>

        {isLoadingBreeder ? (
          <div className="flex items-center justify-center py-8">
            <LoadingSpinner />
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Name Section */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" {...register("firstName")} />
                {errors.firstName && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.firstName.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" {...register("lastName")} />
                {errors.lastName && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.lastName.message}
                  </p>
                )}
              </div>
            </div>

            {/* Country, SSN, Tax Number */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="country">Country</Label>
                <Input id="country" {...register("country")} />
                {errors.country && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.country.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="socialSecurityNumber">S.S. number</Label>
                <Input
                  id="socialSecurityNumber"
                  {...register("socialSecurityNumber")}
                />
              </div>
              <div>
                <Label htmlFor="taxNumber">Tax number</Label>
                <Input id="taxNumber" {...register("taxNumber")} />
              </div>
            </div>

            {/* Address 1 Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Address 1</h3>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="defaultAddress1"
                    checked={isDefaultAddress1}
                    onCheckedChange={(checked) => {
                      setIsDefaultAddress1(checked as boolean);
                      if (checked) setIsDefaultAddress2(false);
                    }}
                  />
                  <label htmlFor="defaultAddress1" className="text-sm">
                    Default address
                  </label>
                </div>
              </div>
              <div>
                <Label htmlFor="address1">Address</Label>
                <Input id="address1" {...register("address1")} />
                {errors.address1 && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.address1.message}
                  </p>
                )}
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="city1">City</Label>
                  <Input id="city1" {...register("city1")} />
                  {errors.city1 && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.city1.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="state1">State</Label>
                  <Input id="state1" {...register("state1")} />
                  {errors.state1 && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.state1.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="zip1">Zip</Label>
                  <Input id="zip1" {...register("zip1")} />
                  {errors.zip1 && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.zip1.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Address 2 Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Address 2</h3>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="defaultAddress2"
                    checked={isDefaultAddress2}
                    onCheckedChange={(checked) => {
                      setIsDefaultAddress2(checked as boolean);
                      if (checked) setIsDefaultAddress1(false);
                    }}
                  />
                  <label htmlFor="defaultAddress2" className="text-sm">
                    Default address
                  </label>
                </div>
              </div>
              <div>
                <Label htmlFor="address2">Address</Label>
                <Input id="address2" {...register("address2")} />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="city2">City</Label>
                  <Input id="city2" {...register("city2")} />
                </div>
                <div>
                  <Label htmlFor="state2">State</Label>
                  <Input id="state2" {...register("state2")} />
                </div>
                <div>
                  <Label htmlFor="zip2">Zip</Label>
                  <Input id="zip2" {...register("zip2")} />
                </div>
              </div>
            </div>

            {/* Contacts Section */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Contacts</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">Primary Phone</Label>
                  <Input id="phone" {...register("phone")} />
                  {errors.phone && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.phone.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="cell">Cell Phone</Label>
                  <Input id="cell" {...register("cell")} />
                </div>
                <div>
                  <Label htmlFor="fax">Fax</Label>
                  <Input id="fax" {...register("fax")} />
                </div>
                <div>
                  <Label htmlFor="sms">SMS</Label>
                  <Input id="sms" {...register("sms")} />
                </div>
                <div>
                  <Label htmlFor="email">E-Mail</Label>
                  <Input id="email" type="email" {...register("email")} />
                  {errors.email && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="email2">Alternative E-Mail</Label>
                  <Input id="email2" type="email" {...register("email2")} />
                  {errors.email2 && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.email2.message}
                    </p>
                  )}
                </div>
              </div>
              <div>
                <Label htmlFor="webAddress">Web address</Label>
                <Input id="webAddress" {...register("webAddress")} />
              </div>
            </div>

            {/* Status Section */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Status</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={statusValue?.toString()}
                    onValueChange={(value) => setValue("status", Number(value))}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Active</SelectItem>
                      <SelectItem value="1">Inactive</SelectItem>
                      <SelectItem value="2">Prospect</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="statusDate">Date</Label>
                  <Input id="statusDate" type="date" {...register("statusDate")} />
                </div>
              </div>
            </div>

            {/* Login Section */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Login</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="loginName">User name</Label>
                  <Input id="loginName" {...register("loginName")} />
                  {errors.loginName && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.loginName.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="loginPassword">Password</Label>
                  <Input
                    id="loginPassword"
                    type="password"
                    {...register("loginPassword")}
                    placeholder="Leave blank to keep current"
                  />
                  {errors.loginPassword && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.loginPassword.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Defaults Section */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Defaults</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="defNameAgn">AGN team name</Label>
                  <Input id="defNameAgn" {...register("defNameAgn")} />
                </div>
                <div>
                  <Label htmlFor="defNameAs">AS team name</Label>
                  <Input id="defNameAs" {...register("defNameAs")} />
                </div>
              </div>
            </div>

            {/* Note Section */}
            <div>
              <Label htmlFor="note">Note</Label>
              <Textarea id="note" {...register("note")} rows={4} />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isPending}
              >
                Cancel (Esc)
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Saving..." : "Save (Enter)"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}