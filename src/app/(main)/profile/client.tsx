"use client";

import { FormSkeleton } from "@/components/loading-skeletons";
import { useGetProfile, useUpdateProfile } from "@/lib/api/user";
import { CurrentUser } from "@/lib/types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useEffect } from "react";
import { toast } from "sonner";

const updateUserSchema = z.object({
  name: z.string().min(1, "Name is required").optional(),
  country: z.string().optional(),
  ssn: z.string().optional(),
  taxNumber: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zip: z.string().optional(),
  primaryPhone: z.string().optional(),
  cellPhone: z.string().optional(),
  fax: z.string().optional(),
  sms: z.string().optional(),
  alternativeEmail: z.string().email("Invalid email format").optional().or(z.literal("")),
  webAddress: z.string().url("Invalid URL format").optional().or(z.literal("")),
});

type UpdateUserFormData = z.infer<typeof updateUserSchema>;

export default function ProfilePage() {
  const { data, error, isError, isPending, isSuccess } = useGetProfile();
  const { mutateAsync: updateProfile } = useUpdateProfile();

  const form = useForm<UpdateUserFormData>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      name: "",
      country: "",
      ssn: "",
      taxNumber: "",
      address: "",
      city: "",
      state: "",
      zip: "",
      primaryPhone: "",
      cellPhone: "",
      fax: "",
      sms: "",
      alternativeEmail: "",
      webAddress: "",
    },
  });

  const userData: CurrentUser = data?.data;

  // Populate form with existing user data
  useEffect(() => {
    if (userData) {
      form.reset({
        name: userData.name || "",
        country: userData.country || "",
        ssn: userData.ssn || "",
        taxNumber: userData.taxNumber || "",
        address: userData.address || "",
        city: userData.city || "",
        state: userData.state || "",
        zip: userData.zip || "",
        primaryPhone: userData.primaryPhone || "",
        cellPhone: userData.cellPhone || "",
        fax: userData.fax || "",
        sms: userData.sms || "",
        alternativeEmail: userData.alternativeEmail || "",
        webAddress: userData.webAddress || "",
      });
    }
  }, [userData, form]);

  const onSubmit = async (data: UpdateUserFormData) => {
    try {
      if (!updateProfile) return;
      
      // Filter out empty strings and undefined values
      const filteredData = Object.fromEntries(
        Object.entries(data).filter(([_, value]) => value !== "" && value !== undefined)
      );

      const result = await updateProfile(filteredData);
      
      if (result.error) {
        toast.error(result.error);
        return;
      }
      
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error("Failed to update profile. Please try again.");
      console.error("Error updating profile:", error);
    }
  };

  if (isPending) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <FormSkeleton />
      </div>
    );
  }
  
  if (isError) {
    return (
      <div className="flex h-96 w-full items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-destructive mb-2">Failed to load profile</p>
          <p className="text-sm text-muted-foreground">{error?.message || "An error occurred"}</p>
        </div>
      </div>
    );
  }  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Profile Settings</h1>
          <p className="text-muted-foreground">
            Manage your account settings and personal information.
          </p>
        </div>

        <div className="bg-card rounded-lg border p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Basic Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Country</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your country" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Tax Information */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Tax Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="ssn"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>SSN</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your SSN" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="taxNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tax Number</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your tax number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Address Information */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Address Information</h2>
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your address" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your city" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="state"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>State</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your state" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="zip"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>ZIP Code</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your ZIP code" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Contact Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="primaryPhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Primary Phone</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your primary phone" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="cellPhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cell Phone</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your cell phone" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="fax"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Fax</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your fax number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="sms"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>SMS</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your SMS number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Online Information */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Online Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="alternativeEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Alternative Email</FormLabel>
                        <FormControl>
                          <Input 
                            type="email" 
                            placeholder="Enter your alternative email" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="webAddress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Web Address</FormLabel>
                        <FormControl>
                          <Input 
                            type="url" 
                            placeholder="Enter your website URL" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="flex justify-end pt-6">
                <Button 
                  type="submit" 
                  disabled={form.formState.isSubmitting}
                  className="min-w-[100px]"
                >
                  {form.formState.isSubmitting ? "Updating..." : "Update Profile"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
