"use client";

import { useState } from "react";
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
import { useCreateBreeder } from "@/lib/api/user";
import { toast } from "sonner";

const createBreederSchema = z.object({
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
  email2: z
    .string()
    .email("Invalid email address")
    .optional()
    .or(z.literal("")),
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

type CreateBreederFormData = z.infer<typeof createBreederSchema>;

interface BreederCreateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BreederCreateDialog({
  open,
  onOpenChange,
}: BreederCreateDialogProps) {
  const [isDefaultAddress1, setIsDefaultAddress1] = useState(false);
  const [isDefaultAddress2, setIsDefaultAddress2] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<CreateBreederFormData>({
    resolver: zodResolver(createBreederSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      country: "",
      address1: "",
      city1: "",
      state1: "",
      zip1: "",
      address2: "",
      city2: "",
      state2: "",
      zip2: "",
      phone: "",
      cell: "",
      fax: "",
      email: "",
      email2: "",
      webAddress: "",
      socialSecurityNumber: "",
      status: 0,
      statusDate: "",
      note: "",
      loginName: "",
      loginPassword: "",
      sms: "",
      taxNumber: "",
      defNameAgn: "",
      defNameAs: "",
    },
  });

  const { mutateAsync: createBreeder, isPending } = useCreateBreeder();

  const onSubmit = async (data: CreateBreederFormData) => {
    try {
      // Remove empty password field
      if (!data.loginPassword) {
        delete data.loginPassword;
      }
      // Remove empty email2 field
      if (!data.email2) {
        delete data.email2;
      }
      if (!createBreeder) return;
      await createBreeder(data);
      toast.success("Breeder created successfully");
      reset();
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error?.message || "Failed to create breeder");
    }
  };

  const statusValue = watch("status");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Breeder</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Name Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                {...register("firstName")}
                placeholder="First Name"
              />
              {errors.firstName && (
                <p className="text-sm text-destructive">
                  {errors.firstName.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                {...register("lastName")}
                placeholder="Last Name"
              />
              {errors.lastName && (
                <p className="text-sm text-destructive">
                  {errors.lastName.message}
                </p>
              )}
            </div>
          </div>

          {/* Country, SSN, Tax Number */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input id="country" {...register("country")} placeholder="USA" />
              {errors.country && (
                <p className="text-sm text-destructive">
                  {errors.country.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="socialSecurityNumber">S.S. number</Label>
              <Input
                id="socialSecurityNumber"
                {...register("socialSecurityNumber")}
                placeholder="- -"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="taxNumber">Tax number</Label>
              <Input
                id="taxNumber"
                {...register("taxNumber")}
                placeholder="-"
              />
            </div>
          </div>

          {/* Address 1 Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Label className="text-base font-semibold">Address 1</Label>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isDefaultAddress1"
                  checked={isDefaultAddress1}
                  onCheckedChange={(checked) => {
                    setIsDefaultAddress1(!!checked);
                    if (checked) setIsDefaultAddress2(false);
                  }}
                />
                <Label
                  htmlFor="isDefaultAddress1"
                  className="text-sm font-normal"
                >
                  Set as default
                </Label>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address1">Address</Label>
              <Input
                id="address1"
                {...register("address1")}
                placeholder="Address Line 1"
              />
              {errors.address1 && (
                <p className="text-sm text-destructive">
                  {errors.address1.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city1">City</Label>
                <Input id="city1" {...register("city1")} placeholder="City" />
                {errors.city1 && (
                  <p className="text-sm text-destructive">
                    {errors.city1.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="state1">State</Label>
                <Input
                  id="state1"
                  {...register("state1")}
                  placeholder="State"
                />
                {errors.state1 && (
                  <p className="text-sm text-destructive">
                    {errors.state1.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="zip1">ZIP</Label>
                <Input id="zip1" {...register("zip1")} placeholder="ZIP" />
                {errors.zip1 && (
                  <p className="text-sm text-destructive">
                    {errors.zip1.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Address 2 Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Label className="text-base font-semibold">Address 2</Label>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isDefaultAddress2"
                  checked={isDefaultAddress2}
                  onCheckedChange={(checked) => {
                    setIsDefaultAddress2(!!checked);
                    if (checked) setIsDefaultAddress1(false);
                  }}
                />
                <Label
                  htmlFor="isDefaultAddress2"
                  className="text-sm font-normal"
                >
                  Set as default
                </Label>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address2">Address</Label>
              <Input
                id="address2"
                {...register("address2")}
                placeholder="Address Line 2"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city2">City</Label>
                <Input id="city2" {...register("city2")} placeholder="City" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="state2">State</Label>
                <Input
                  id="state2"
                  {...register("state2")}
                  placeholder="State"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="zip2">ZIP</Label>
                <Input id="zip2" {...register("zip2")} placeholder="ZIP" />
              </div>
            </div>
          </div>

          {/* Contacts Section */}
          <div className="space-y-4">
            <Label className="text-base font-semibold">Contacts</Label>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" {...register("phone")} placeholder="( ) -" />
                {errors.phone && (
                  <p className="text-sm text-destructive">
                    {errors.phone.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="cell">Cell</Label>
                <Input id="cell" {...register("cell")} placeholder="( ) -" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fax">Fax</Label>
                <Input id="fax" {...register("fax")} placeholder="( ) -" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="sms">SMS</Label>
              <Input id="sms" {...register("sms")} placeholder="SMS" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">E-Mail</Label>
              <Input
                id="email"
                type="email"
                {...register("email")}
                placeholder="Email"
              />
              {errors.email && (
                <p className="text-sm text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email2">Alternative E-Mail</Label>
              <Input
                id="email2"
                type="email"
                {...register("email2")}
                placeholder="Alternative Email"
              />
              {errors.email2 && (
                <p className="text-sm text-destructive">
                  {errors.email2.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="webAddress">Web address</Label>
              <Input
                id="webAddress"
                {...register("webAddress")}
                placeholder="Website URL"
              />
            </div>
          </div>

          {/* Status Section */}
          <div className="space-y-4">
            <Label className="text-base font-semibold">Status</Label>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={String(statusValue)}
                  onValueChange={(value) => setValue("status", parseInt(value))}
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

              <div className="space-y-2">
                <Label htmlFor="statusDate">Status Date</Label>
                <Input
                  id="statusDate"
                  type="date"
                  {...register("statusDate")}
                />
              </div>
            </div>
          </div>

          {/* Login Section */}
          <div className="space-y-4">
            <Label className="text-base font-semibold">Login</Label>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="loginName">User name</Label>
                <Input
                  id="loginName"
                  {...register("loginName")}
                  placeholder="Username"
                />
                {errors.loginName && (
                  <p className="text-sm text-destructive">
                    {errors.loginName.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="loginPassword">Password</Label>
                <Input
                  id="loginPassword"
                  type="password"
                  {...register("loginPassword")}
                  placeholder="Password"
                />
                {errors.loginPassword && (
                  <p className="text-sm text-destructive">
                    {errors.loginPassword.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Defaults Section */}
          <div className="space-y-4">
            <Label className="text-base font-semibold">Defaults</Label>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="defNameAgn">Default AGN Team Name</Label>
                <Input
                  id="defNameAgn"
                  {...register("defNameAgn")}
                  placeholder="AGN Team Name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="defNameAs">Default AS Team Name</Label>
                <Input
                  id="defNameAs"
                  {...register("defNameAs")}
                  placeholder="AS Team Name"
                />
              </div>
            </div>
          </div>

          {/* Note Section */}
          <div className="space-y-2">
            <Label htmlFor="note">Note</Label>
            <Textarea
              id="note"
              {...register("note")}
              placeholder="Additional notes..."
              rows={4}
            />
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
              {isPending ? "Creating..." : "Create Breeder"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
