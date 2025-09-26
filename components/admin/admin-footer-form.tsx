"use client";

import { useEffect, useState } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { X } from "lucide-react";

// Zod schema matching the API schema for validation
const footerSchema = z.object({
  companyTitle: z.string().min(1, "Company title is required"),
  companyDescription: z.string().min(1, "Company description is required"),
  socialLinks: z
    .array(
      z.object({
        platform: z.enum(["facebook", "twitter", "instagram"]),
        href: z.string().url("Invalid URL"),
      })
    )
    .min(1, "At least one social link is required"),
  customerServiceTitle: z.string().min(1, "Customer service title is required"),
  customerServiceLinks: z
    .array(
      z.object({
        text: z.string().min(1, "Link text is required"),
        href: z.string().min(1, "Link href is required"),
      })
    )
    .min(1, "At least one customer service link is required"),
  contactTitle: z.string().min(1, "Contact title is required"),
  contacts: z
    .array(
      z.object({
        icon: z.enum(["mail", "phone", "map"]),
        text: z.string().min(1, "Contact text is required"),
        href: z.string().optional(),
      })
    )
    .length(3, "Exactly three contacts are required (mail, phone, address)"),
  copyright: z.string().min(1, "Copyright text is required"),
  selectedCategoryIds: z
    .array(z.string())
    .max(3, "Maximum three categories allowed"),
});

type FooterFormData = z.infer<typeof footerSchema>;

export function AdminFooterForm() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>(
    []
  );
  const [loading, setLoading] = useState(true);

  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FooterFormData>({
    resolver: zodResolver(footerSchema),
    defaultValues: {
      selectedCategoryIds: [],
      socialLinks: [{ platform: "facebook", href: "" }],
      customerServiceLinks: [{ text: "", href: "" }],
      contacts: [
        { icon: "mail", text: "", href: "" },
        { icon: "phone", text: "", href: "" },
        { icon: "map", text: "", href: "" },
      ],
    },
  });

  // Watch selectedCategoryIds for reactive updates
  const selectedCategoryIds = watch("selectedCategoryIds");

  // Field arrays for dynamic inputs (only for object arrays)
  const {
    fields: socialFields,
    append: appendSocial,
    remove: removeSocial,
  } = useFieldArray({
    control,
    name: "socialLinks",
  });

  const {
    fields: serviceFields,
    append: appendService,
    remove: removeService,
  } = useFieldArray({
    control,
    name: "customerServiceLinks",
  });

  const { fields: contactFields } = useFieldArray({
    control,
    name: "contacts",
  });

  // Fetch footer and categories data on mount
  useEffect(() => {
    async function fetchData() {
      try {
        const [footerRes, categoriesRes] = await Promise.all([
          fetch("/api/footer"),
          fetch("/api/categories"),
        ]);

        if (footerRes.ok) {
          const footerData = await footerRes.json();
          reset(footerData);
        } else {
          setError("Failed to load footer data");
        }

        if (categoriesRes.ok) {
          const categoriesData = await categoriesRes.json();
          setCategories(categoriesData);
        } else {
          setError("Failed to load categories");
        }
      } catch (err) {
        console.error(err);
        setError("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [reset]);

  // Handle adding a category
  const addCategory = (categoryId: string) => {
    if (!categoryId || selectedCategoryIds.includes(categoryId)) return;

    const newIds = [...selectedCategoryIds, categoryId];
    setValue("selectedCategoryIds", newIds);
  };

  // Handle removing a category
  const removeCategory = (categoryId: string) => {
    const newIds = selectedCategoryIds.filter((id) => id !== categoryId);
    setValue("selectedCategoryIds", newIds);
  };

  // Get available categories (not already selected)
  const availableCategories = categories.filter(
    (cat) => !selectedCategoryIds.includes(cat.id)
  );

  // Handle form submission
  const onSubmit = async (data: FooterFormData) => {
    setError(null);
    setSuccess(false);

    try {
      const res = await fetch("/api/footer", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000); // Hide success after 3s
      } else {
        const err = await res.json();
        setError(
          Array.isArray(err.error)
            ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
              err.error.map((e: any) => e.message).join(", ")
            : err.error
        );
      }
    } catch (err) {
      console.error(err);
      setError("Failed to update footer");
    }
  };

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Footer Settings</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Error and success messages */}
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {success && (
          <Alert>
            <AlertDescription>Footer updated successfully!</AlertDescription>
          </Alert>
        )}

        {/* Company Info */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Company Information</h2>

          <div>
            <Label htmlFor="companyTitle">Company Title</Label>
            <Input
              id="companyTitle"
              {...register("companyTitle")}
              placeholder="Your Company Name"
            />
            {errors.companyTitle && (
              <p className="text-destructive text-sm mt-1">
                {errors.companyTitle.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="companyDescription">Company Description</Label>
            <Textarea
              id="companyDescription"
              {...register("companyDescription")}
              placeholder="Brief description of your company..."
              rows={3}
            />
            {errors.companyDescription && (
              <p className="text-destructive text-sm mt-1">
                {errors.companyDescription.message}
              </p>
            )}
          </div>
        </div>

        {/* Social Links */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Social Media Links</h2>
          {socialFields.map((field, index) => (
            <div key={field.id} className="flex gap-2 items-start">
              <Controller
                name={`socialLinks.${index}.platform`}
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="facebook">Facebook</SelectItem>
                      <SelectItem value="twitter">Twitter</SelectItem>
                      <SelectItem value="instagram">Instagram</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              <Input
                placeholder="https://..."
                className="flex-1"
                {...register(`socialLinks.${index}.href`)}
              />
              {socialFields.length > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => removeSocial(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
              {errors.socialLinks?.[index] && (
                <p className="text-destructive text-sm">
                  {errors.socialLinks[index]?.href?.message ||
                    errors.socialLinks[index]?.platform?.message}
                </p>
              )}
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={() => appendSocial({ platform: "facebook", href: "" })}
            disabled={socialFields.length >= 3}
          >
            Add Social Link
          </Button>
        </div>

        {/* Customer Service */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="customerServiceTitle">
              Customer Service Section Title
            </Label>
            <Input
              id="customerServiceTitle"
              {...register("customerServiceTitle")}
              placeholder="Customer Service"
            />
            {errors.customerServiceTitle && (
              <p className="text-destructive text-sm mt-1">
                {errors.customerServiceTitle.message}
              </p>
            )}
          </div>

          <div>
            <Label>Customer Service Links</Label>
            {serviceFields.map((field, index) => (
              <div key={field.id} className="flex gap-2 items-start mt-2">
                <Input
                  placeholder="Link text"
                  className="flex-1"
                  {...register(`customerServiceLinks.${index}.text`)}
                />
                <Input
                  placeholder="Link URL"
                  className="flex-1"
                  {...register(`customerServiceLinks.${index}.href`)}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => removeService(index)}
                  disabled={serviceFields.length <= 1}
                >
                  <X className="h-4 w-4" />
                </Button>
                {errors.customerServiceLinks?.[index] && (
                  <p className="text-destructive text-sm">
                    {errors.customerServiceLinks[index]?.text?.message ||
                      errors.customerServiceLinks[index]?.href?.message}
                  </p>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={() => appendService({ text: "", href: "" })}
              className="mt-2"
            >
              Add Service Link
            </Button>
          </div>
        </div>

        {/* Contact Info */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="contactTitle">Contact Section Title</Label>
            <Input
              id="contactTitle"
              {...register("contactTitle")}
              placeholder="Contact Info"
            />
            {errors.contactTitle && (
              <p className="text-destructive text-sm mt-1">
                {errors.contactTitle.message}
              </p>
            )}
          </div>

          <div>
            <Label>Contact Details (Email, Phone, Address)</Label>
            {contactFields.map((field, index) => (
              <div key={field.id} className="flex gap-2 items-start mt-2">
                <Controller
                  name={`contacts.${index}.icon`}
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-24">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mail">Email</SelectItem>
                        <SelectItem value="phone">Phone</SelectItem>
                        <SelectItem value="map">Address</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                <Input
                  placeholder="Contact info"
                  className="flex-1"
                  {...register(`contacts.${index}.text`)}
                />
                <Input
                  placeholder="Link (optional)"
                  className="flex-1"
                  {...register(`contacts.${index}.href`)}
                />
                {errors.contacts?.[index] && (
                  <p className="text-destructive text-sm">
                    {errors.contacts[index]?.text?.message ||
                      errors.contacts[index]?.icon?.message}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Quick Links Categories */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Quick Links Categories</h2>
          <p className="text-sm text-muted-foreground">
            Select up to 3 categories to display in the footer Quick Links
            section.
          </p>

          {/* Selected Categories */}
          {selectedCategoryIds.length > 0 && (
            <div className="space-y-2">
              <Label>Selected Categories:</Label>
              <div className="flex flex-wrap gap-2">
                {selectedCategoryIds.map((categoryId) => {
                  const category = categories.find(
                    (cat) => cat.id === categoryId
                  );
                  if (!category) return null;

                  return (
                    <div
                      key={categoryId}
                      className="flex items-center gap-2 bg-primary text-primary-foreground px-3 py-1 rounded-md text-sm"
                    >
                      <span>{category.name}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0 hover:bg-primary-foreground/20"
                        onClick={() => removeCategory(categoryId)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Add Category Dropdown */}
          {selectedCategoryIds.length < 3 && availableCategories.length > 0 && (
            <div>
              <Label>Add Category:</Label>
              <Select onValueChange={(value) => addCategory(value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a category to add..." />
                </SelectTrigger>
                <SelectContent>
                  {availableCategories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {selectedCategoryIds.length >= 3 && (
            <p className="text-sm text-muted-foreground">
              Maximum of 3 categories reached. Remove a category to add another.
            </p>
          )}

          {errors.selectedCategoryIds && (
            <p className="text-destructive text-sm">
              {errors.selectedCategoryIds.message}
            </p>
          )}
        </div>

        {/* Copyright */}
        <div>
          <Label htmlFor="copyright">Copyright Text</Label>
          <Input
            id="copyright"
            {...register("copyright")}
            placeholder="© 2024 Your Company. All rights reserved."
          />
          {errors.copyright && (
            <p className="text-destructive text-sm mt-1">
              {errors.copyright.message}
            </p>
          )}
        </div>

        <div className="flex justify-end pt-4 border-t">
          <Button type="submit" size="lg">
            Save Footer Settings
          </Button>
        </div>
      </form>
    </div>
  );
}
