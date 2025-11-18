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
  firstName: z.string().min(1, "First name is required").optional(),
  lastName: z.string().min(1, "Last name is required").optional(),
  country: z.string().optional(),
  ssn: z.string().optional(),
  taxNumber: z.string().optional(),
  isDefaultAddress1: z.boolean().optional(),
  address1: z.string().optional(),
  city1: z.string().optional(),
  state1: z.string().optional(),
  zip1: z.string().optional(),
  address2: z.string().optional(),
  city2: z.string().optional(),
  state2: z.string().optional(),
  zip2: z.string().optional(),
  phone: z.string().optional(),
  cell: z.string().optional(),
  fax: z.string().optional(),
  sms: z.string().optional(),
  email2: z.string().email("Invalid email format").optional().or(z.literal("")),
  webAddress: z.string().url("Invalid URL format").optional().or(z.literal("")),
  note: z.string().optional(),
  defaultNameAgn: z.string().optional(),
  defaultNameAs: z.string().optional(),
});

type UpdateUserFormData = z.infer<typeof updateUserSchema>;

export default function ProfilePage() {
  const { data, error, isError, isPending, isSuccess } = useGetProfile();
  const { mutateAsync: updateProfile } = useUpdateProfile();

  const form = useForm<UpdateUserFormData>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      country: "",
      ssn: "",
      taxNumber: "",
      isDefaultAddress1: false,
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
      sms: "",
      email2: "",
      webAddress: "",
      note: "",
      defaultNameAgn: "",
      defaultNameAs: "",
    },
  });

  const userData: CurrentUser = data?.data;

  // Populate form with existing user data
  useEffect(() => {
    if (userData) {
      form.reset({
        firstName: userData.firstName || "",
        lastName: userData.lastName || "",
        country: userData.country || "",
        ssn: userData.ssn || "",
        taxNumber: userData.taxNumber || "",
        isDefaultAddress1: userData.isDefaultAddress1 || false,
        address1: userData.address1 || "",
        city1: userData.city1 || "",
        state1: userData.state1 || "",
        zip1: userData.zip1 || "",
        address2: userData.address2 || "",
        city2: userData.city2 || "",
        state2: userData.state2 || "",
        zip2: userData.zip2 || "",
        phone: userData.phone || "",
        cell: userData.cell || "",
        fax: userData.fax || "",
        sms: userData.sms || "",
        email2: userData.email2 || "",
        webAddress: userData.webAddress || "",
        note: userData.note || "",
        defaultNameAgn: userData.defaultNameAgn || "",
        defaultNameAs: userData.defaultNameAs || "",
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
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your first name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your last name" {...field} />
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
                  <FormField
                    control={form.control}
                    name="defaultNameAgn"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Default Name (AGN)</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter default AGN name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="defaultNameAs"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Default Name (AS)</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter default AS name" {...field} />
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

              {/* Primary Address Information */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Primary Address</h2>
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="address1"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your primary address" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="city1"
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
                      name="state1"
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
                      name="zip1"
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

              {/* Secondary Address Information */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Secondary Address</h2>
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="address2"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your secondary address" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="city2"
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
                      name="state2"
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
                      name="zip2"
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
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your phone number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="cell"
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
                    name="email2"
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

              {/* Additional Information */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Additional Information</h2>
                <FormField
                  control={form.control}
                  name="note"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter any additional notes" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
