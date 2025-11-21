"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { X, Plus } from "lucide-react";

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
        href: z.string()
          .min(1, "Link href is required")
          .refine(
            (href) => href.startsWith('/') || href.startsWith('http'),
            "Internal links must start with '/' (e.g., /contact) or be full URLs (e.g., https://example.com)"
          ),
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
  const [submitting, setSubmitting] = useState(false);

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

        let loadedCategories: { id: string; name: string }[] = [];
        
        if (categoriesRes.ok) {
          const categoriesData = await categoriesRes.json();
          console.log("Loaded categories:", categoriesData);
          setCategories(categoriesData);
          loadedCategories = categoriesData;
        } else {
          setError("Failed to load categories");
        }

        if (footerRes.ok) {
          const footerData = await footerRes.json();
          console.log("Loaded footer data:", footerData);
          
          // Filter out invalid category IDs (categories that no longer exist or are inactive)
          const validCategoryIds = Array.isArray(footerData.selectedCategoryIds)
            ? footerData.selectedCategoryIds.filter((id: string) => 
                loadedCategories.some(cat => cat.id === id)
              )
            : [];
          
          console.log("Filtered valid category IDs:", validCategoryIds);
          
          // Ensure selectedCategoryIds is always an array with only valid IDs
          const dataToReset = {
            ...footerData,
            selectedCategoryIds: validCategoryIds,
          };
          reset(dataToReset);
        } else {
          setError("Failed to load footer data");
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [reset]);

  // Handle adding a category
  const addCategory = (categoryId: string) => {
    console.log("Adding category:", categoryId);
    console.log("Current selectedCategoryIds:", selectedCategoryIds);
    
    if (!categoryId || selectedCategoryIds.includes(categoryId)) {
      console.log("Category already selected or invalid");
      return;
    }

    const newIds = [...(selectedCategoryIds || []), categoryId];
    console.log("New category IDs:", newIds);
    setValue("selectedCategoryIds", newIds, { shouldValidate: true, shouldDirty: true });
    toast.success("Category added!");
  };

  // Handle removing a category
  const removeCategory = (categoryId: string) => {
    const newIds = selectedCategoryIds.filter((id) => id !== categoryId);
    setValue("selectedCategoryIds", newIds);
  };

  // Get available categories (not already selected)
  const availableCategories = categories.filter(
    (cat) => !(selectedCategoryIds || []).includes(cat.id)
  );
  
  console.log("Available categories:", availableCategories.length);
  console.log("Selected category IDs:", selectedCategoryIds);

  // Handle form submission
  const onSubmit = async (data: FooterFormData) => {
    setError(null);
    setSuccess(false);
    setSubmitting(true);
    
    const loadingToast = toast.loading("Updating footer settings...");
    
    try {
      // Ensure selectedCategoryIds is always an array
      const submitData = {
        ...data,
        selectedCategoryIds: data.selectedCategoryIds || [],
      };
      
      console.log("Submitting footer data:", submitData);
      
      const res = await fetch("/api/footer", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submitData),
      });

      toast.dismiss(loadingToast);

      if (res.ok) {
        setSuccess(true);
        toast.success("Footer updated successfully! Changes will appear on the customer site.", {
          duration: 4000,
        });
        
        // Force multiple cache-busting requests to ensure update
        const timestamp = new Date().getTime();
        Promise.all([
          fetch(`/api/footer?t=${timestamp}`, { 
            cache: "no-store",
            headers: { "Cache-Control": "no-cache" }
          }),
          fetch(`/api/footer?t=${timestamp + 1}`, { 
            cache: "no-store",
            headers: { "Cache-Control": "no-cache" }
          }),
        ]).catch(() => {});
        
        setTimeout(() => setSuccess(false), 3000);
      } else {
        const err = await res.json();
        console.error("Footer update error:", err);
        const errorMsg = Array.isArray(err.error)
          ? err.error.map((e: { message: string }) => e.message).join(", ")
          : err.error;
        setError(errorMsg);
        toast.error(errorMsg || "Failed to update footer", {
          duration: 5000,
        });
      }
    } catch (err) {
      console.error("Footer submission error:", err);
      toast.dismiss(loadingToast);
      setError("Failed to update footer");
      toast.error("Failed to update footer", {
        duration: 5000,
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="mb-8">
          <div className="h-10 bg-gradient-to-r from-blue-200 to-purple-200 rounded-lg w-64 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-96 mt-2 animate-pulse"></div>
        </div>

        {/* Company Info Section Skeleton */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100/50 shadow-sm">
          <div className="mb-6">
            <div className="h-6 bg-gradient-to-r from-blue-200 to-indigo-200 rounded w-48 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-80 mt-2 animate-pulse"></div>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
              <div className="h-10 bg-white/80 rounded-lg w-full animate-pulse"></div>
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-40 animate-pulse"></div>
              <div className="h-24 bg-white/80 rounded-lg w-full animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Social Links Section Skeleton */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-100/50 shadow-sm">
          <div className="mb-6">
            <div className="h-6 bg-gradient-to-r from-purple-200 to-pink-200 rounded w-40 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-72 mt-2 animate-pulse"></div>
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-3 items-start p-4 bg-white/60 rounded-lg border border-gray-200">
                <div className="h-10 bg-gray-200 rounded w-36 animate-pulse"></div>
                <div className="h-10 bg-gray-200 rounded flex-1 animate-pulse"></div>
                <div className="h-8 bg-gray-200 rounded w-8 animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Customer Service Section Skeleton */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-100/50 shadow-sm">
          <div className="mb-6">
            <div className="h-6 bg-gradient-to-r from-green-200 to-emerald-200 rounded w-44 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-80 mt-2 animate-pulse"></div>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-28 animate-pulse"></div>
              <div className="h-10 bg-white/80 rounded-lg w-full animate-pulse"></div>
            </div>
            <div className="space-y-3 mt-2">
              {[1, 2].map((i) => (
                <div key={i} className="flex gap-3 items-start p-4 bg-white/60 rounded-lg border border-gray-200">
                  <div className="h-10 bg-gray-200 rounded flex-1 animate-pulse"></div>
                  <div className="h-10 bg-gray-200 rounded flex-1 animate-pulse"></div>
                  <div className="h-8 bg-gray-200 rounded w-8 animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Contact Info Section Skeleton */}
        <div className="bg-gradient-to-r from-cyan-50 to-blue-50 p-6 rounded-xl border border-cyan-100/50 shadow-sm">
          <div className="mb-6">
            <div className="h-6 bg-gradient-to-r from-cyan-200 to-blue-200 rounded w-40 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-72 mt-2 animate-pulse"></div>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-28 animate-pulse"></div>
              <div className="h-10 bg-white/80 rounded-lg w-full animate-pulse"></div>
            </div>
            <div className="space-y-3 mt-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-3 items-start p-4 bg-white/60 rounded-lg border border-gray-200">
                  <div className="h-10 bg-gray-200 rounded w-28 animate-pulse"></div>
                  <div className="h-10 bg-gray-200 rounded flex-1 animate-pulse"></div>
                  <div className="h-10 bg-gray-200 rounded flex-1 animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Links Categories Section Skeleton */}
        <div className="bg-gradient-to-r from-orange-50 to-amber-50 p-6 rounded-xl border border-orange-100/50 shadow-sm">
          <div className="mb-6">
            <div className="h-6 bg-gradient-to-r from-orange-200 to-amber-200 rounded w-52 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-96 mt-2 animate-pulse"></div>
          </div>
          <div className="space-y-4">
            <div className="h-10 bg-white/80 rounded-lg w-40 animate-pulse"></div>
            <div className="flex flex-wrap gap-3 mt-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-8 bg-gradient-to-r from-orange-100 to-amber-100 rounded-lg w-24 animate-pulse"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
          Footer Settings
        </h1>
        <p className="text-gray-600 mt-2">
          Configure footer content and links for your website
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Error and success messages */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <p className="text-red-800 font-medium">Error</p>
            </div>
            <p className="text-red-700 mt-1">{error}</p>
          </div>
        )}
        {success && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <p className="text-green-800 font-medium">Success</p>
            </div>
            <p className="text-green-700 mt-1">Footer updated successfully!</p>
          </div>
        )}

        {/* Company Info Section */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100/50 shadow-sm">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-1 flex items-center gap-2">
              <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></div>
              Company Information
            </h2>
            <p className="text-gray-600 text-sm">
              Basic information about your company displayed in the footer.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="companyTitle" className="text-sm font-semibold text-gray-700">Company Title</Label>
              <Input
                id="companyTitle"
                {...register("companyTitle")}
                placeholder="Your Company Name"
                className="mt-2 bg-white/80 backdrop-blur-sm border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
              {errors.companyTitle && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.companyTitle.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="companyDescription" className="text-sm font-semibold text-gray-700">Company Description</Label>
              <Textarea
                id="companyDescription"
                {...register("companyDescription")}
                placeholder="Brief description of your company..."
                className="mt-2 bg-white/80 backdrop-blur-sm border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 min-h-[100px]"
              />
              {errors.companyDescription && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.companyDescription.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Social Links Section */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-100/50 shadow-sm">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-1 flex items-center gap-2">
              <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
              Social Media Links
            </h2>
            <p className="text-gray-600 text-sm">
              Connect your social media profiles to the footer.
            </p>
          </div>

          <div className="space-y-4">
            {socialFields.map((field, index) => (
              <div key={field.id} className="flex gap-3 items-start p-4 bg-white/60 rounded-lg border border-gray-200">
                <Controller
                  name={`socialLinks.${index}.platform`}
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-36 bg-white/80 backdrop-blur-sm border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent">
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
                  className="flex-1 bg-white/80 backdrop-blur-sm border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  {...register(`socialLinks.${index}.href`)}
                />
                {socialFields.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => removeSocial(index)}
                    className="bg-white/80 hover:bg-white border-gray-200"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
                {errors.socialLinks?.[index] && (
                  <p className="text-red-600 text-sm absolute mt-12">
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
              disabled={socialFields.length >= 6}
              className="bg-white/80 hover:bg-white border-gray-200"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Social Link {socialFields.length >= 6 && "(Max 6 reached)"}
            </Button>
          </div>
        </div>

        {/* Customer Service Section */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-100/50 shadow-sm">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-1 flex items-center gap-2">
              <div className="w-2 h-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"></div>
              Customer Service
            </h2>
            <p className="text-gray-600 text-sm">
              Add helpful links for customer support and assistance.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="customerServiceTitle" className="text-sm font-semibold text-gray-700">Section Title</Label>
              <Input
                id="customerServiceTitle"
                {...register("customerServiceTitle")}
                placeholder="Customer Service"
                className="mt-2 bg-white/80 backdrop-blur-sm border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
              />
              {errors.customerServiceTitle && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.customerServiceTitle.message}
                </p>
              )}
            </div>

            <div>
              <Label className="text-sm font-semibold text-gray-700">Service Links</Label>
              <div className="space-y-3 mt-2">
                {serviceFields.map((field, index) => (
                  <div key={field.id} className="flex gap-3 items-start p-4 bg-white/60 rounded-lg border border-gray-200">
                    <Input
                      placeholder="Link text (e.g., Contact Us)"
                      className="flex-1 bg-white/80 backdrop-blur-sm border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      {...register(`customerServiceLinks.${index}.text`)}
                    />
                    <Input
                      placeholder="/contact or https://example.com"
                      className="flex-1 bg-white/80 backdrop-blur-sm border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      {...register(`customerServiceLinks.${index}.href`)}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => removeService(index)}
                      disabled={serviceFields.length <= 1}
                      className="bg-white/80 hover:bg-white border-gray-200"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                    {errors.customerServiceLinks?.[index] && (
                      <p className="text-red-600 text-sm absolute mt-16">
                        {errors.customerServiceLinks[index]?.text?.message ||
                          errors.customerServiceLinks[index]?.href?.message}
                      </p>
                    )}
                  </div>
                ))}
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={() => appendService({ text: "", href: "" })}
                className="mt-3 bg-white/80 hover:bg-white border-gray-200"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Service Link
              </Button>
            </div>
          </div>
        </div>

        {/* Contact Info Section */}
        <div className="bg-gradient-to-r from-cyan-50 to-blue-50 p-6 rounded-xl border border-cyan-100/50 shadow-sm">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-1 flex items-center gap-2">
              <div className="w-2 h-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"></div>
              Contact Information
            </h2>
            <p className="text-gray-600 text-sm">
              Add your contact details like email, phone, and address.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="contactTitle" className="text-sm font-semibold text-gray-700">Section Title</Label>
              <Input
                id="contactTitle"
                {...register("contactTitle")}
                placeholder="Contact Info"
                className="mt-2 bg-white/80 backdrop-blur-sm border-gray-200 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200"
              />
              {errors.contactTitle && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.contactTitle.message}
                </p>
              )}
            </div>

            <div>
              <Label className="text-sm font-semibold text-gray-700">Contact Details</Label>
              <div className="space-y-3 mt-2">
                {contactFields.map((field, index) => (
                  <div key={field.id} className="flex gap-3 items-start p-4 bg-white/60 rounded-lg border border-gray-200">
                    <Controller
                      name={`contacts.${index}.icon`}
                      control={control}
                      render={({ field }) => (
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger className="w-28 bg-white/80 backdrop-blur-sm border-gray-200 focus:ring-2 focus:ring-cyan-500 focus:border-transparent">
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
                      className="flex-1 bg-white/80 backdrop-blur-sm border-gray-200 focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                      {...register(`contacts.${index}.text`)}
                    />
                    <Input
                      placeholder="Link (optional)"
                      className="flex-1 bg-white/80 backdrop-blur-sm border-gray-200 focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                      {...register(`contacts.${index}.href`)}
                    />
                    {errors.contacts?.[index] && (
                      <p className="text-red-600 text-sm absolute mt-16">
                        {errors.contacts[index]?.text?.message ||
                          errors.contacts[index]?.icon?.message}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Links Categories Section */}
        <div className="bg-gradient-to-r from-orange-50 to-amber-50 p-6 rounded-xl border border-orange-100/50 shadow-sm">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-1 flex items-center gap-2">
              <div className="w-2 h-2 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full"></div>
              Quick Links Categories
            </h2>
            <p className="text-gray-600 text-sm">
              Select up to 3 categories to display in the footer Quick Links section.
            </p>
          </div>

          {/* Selected Categories */}
          {selectedCategoryIds.length > 0 && (
            <div className="mb-4">
              <Label className="text-sm font-semibold text-gray-700">Selected Categories:</Label>
              <div className="flex flex-wrap gap-3 mt-2">
                {selectedCategoryIds.map((categoryId) => {
                  const category = categories.find(
                    (cat) => cat.id === categoryId
                  );
                  if (!category) return null;

                  return (
                    <div
                      key={categoryId}
                      className="flex items-center gap-2 bg-gradient-to-r from-orange-100 to-amber-100 text-orange-800 px-4 py-2 rounded-lg text-sm border border-orange-200"
                    >
                      <span className="font-medium">{category.name}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-5 w-5 p-0 hover:bg-orange-200 rounded-full"
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

          {/* Add Category Button with Dialog */}
          <Dialog>
            <DialogTrigger asChild>
              <Button
                type="button"
                variant="outline"
                disabled={selectedCategoryIds.length >= 3 || availableCategories.length === 0}
                className="bg-white/80 hover:bg-white border-gray-200"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Category ({selectedCategoryIds.length}/3)
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Select a Category</DialogTitle>
                <DialogDescription>
                  Choose a category to add to the footer quick links section.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-2 py-4">
                {availableCategories.map((category) => (
                  <Button
                    key={category.id}
                    type="button"
                    variant="outline"
                    className="justify-start"
                    onClick={() => {
                      addCategory(category.id);
                      // Close dialog by clicking the trigger again
                      document.querySelector('[data-state="open"]')?.dispatchEvent(
                        new KeyboardEvent('keydown', { key: 'Escape' })
                      );
                    }}
                  >
                    {category.name}
                  </Button>
                ))}
                {availableCategories.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    {categories.length === 0 
                      ? "No categories available. Please create categories first." 
                      : "All categories have been selected."}
                  </p>
                )}
              </div>
            </DialogContent>
          </Dialog>

          {errors.selectedCategoryIds && (
            <p className="text-destructive text-sm">
              {errors.selectedCategoryIds.message}
            </p>
          )}
        </div>

        {/* Copyright Section */}
        <div className="bg-gradient-to-r from-gray-50 to-slate-50 p-6 rounded-xl border border-gray-100/50 shadow-sm">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-1 flex items-center gap-2">
              <div className="w-2 h-2 bg-gradient-to-r from-gray-500 to-slate-500 rounded-full"></div>
              Copyright
            </h2>
            <p className="text-gray-600 text-sm">
              Set the copyright text displayed at the bottom of the footer.
            </p>
          </div>

          <div>
            <Label htmlFor="copyright" className="text-sm font-semibold text-gray-700">Copyright Text</Label>
            <Input
              id="copyright"
              {...register("copyright")}
              placeholder="© 2024 Your Company. All rights reserved."
              className="mt-2 bg-white/80 backdrop-blur-sm border-gray-200 focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all duration-200"
            />
            {errors.copyright && (
              <p className="text-red-600 text-sm mt-1">
                {errors.copyright.message}
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-end pt-6 border-t border-gray-200">
          <Button
            type="submit"
            size="lg"
            disabled={submitting}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 px-8 py-3 text-lg font-semibold"
          >
            {submitting && (
              <svg
                className="animate-spin h-5 w-5 mr-3"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8z"
                ></path>
              </svg>
            )}
            Save Footer Settings
          </Button>
        </div>
      </form>
    </div>
  );
}
