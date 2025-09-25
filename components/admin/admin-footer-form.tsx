// components/admin/AdminFooterForm.tsx

"use client";

import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
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

// Reuse the schema from API
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
    .min(1),
  customerServiceTitle: z.string().min(1, "Customer service title is required"),
  customerServiceLinks: z
    .array(
      z.object({
        text: z.string().min(1, "Link text is required"),
        href: z.string().min(1, "Link href is required"),
      })
    )
    .min(1),
  contactTitle: z.string().min(1, "Contact title is required"),
  contacts: z
    .array(
      z.object({
        icon: z.enum(["mail", "phone", "map"]),
        text: z.string().min(1, "Contact text is required"),
        href: z.string().optional(),
      })
    )
    .length(3),
  copyright: z.string().min(1, "Copyright text is required"),
});

type FooterFormData = z.infer<typeof footerSchema>;

export function AdminFooterForm() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FooterFormData>({
    resolver: zodResolver(footerSchema),
  });

  const { fields: socialFields } = useFieldArray({
    control,
    name: "socialLinks",
  });
  const {
    fields: serviceFields,
    append: appendService,
    remove: removeService,
  } = useFieldArray({ control, name: "customerServiceLinks" });
  const { fields: contactFields } = useFieldArray({
    control,
    name: "contacts",
  });

  useEffect(() => {
    async function fetchData() {
      const res = await fetch("/api/footer");
      if (res.ok) {
        const data = await res.json();
        reset(data);
      } else {
        setError("Failed to load footer data");
      }
    }
    fetchData();
  }, [reset]);

  const onSubmit = async (data: FooterFormData) => {
    setError(null);
    setSuccess(false);
    const res = await fetch("/api/footer", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      setSuccess(true);
    } else {
      const err = await res.json();
      setError(
        Array.isArray(err.error)
          ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
            err.error.map((e: any) => e.message).join(", ")
          : err.error
      );
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
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
      <div>
        <Label htmlFor="companyTitle">Company Title</Label>
        <Input id="companyTitle" {...register("companyTitle")} />
        {errors.companyTitle && (
          <p className="text-destructive text-sm">
            {errors.companyTitle.message}
          </p>
        )}
      </div>
      <div>
        <Label htmlFor="companyDescription">Company Description</Label>
        <Textarea id="companyDescription" {...register("companyDescription")} />
        {errors.companyDescription && (
          <p className="text-destructive text-sm">
            {errors.companyDescription.message}
          </p>
        )}
      </div>

      {/* Social Links */}
      <div>
        <Label>Social Links</Label>
        {socialFields.map((field, index) => (
          <div key={field.id} className="flex space-x-2 mt-2">
            <Select
              defaultValue={field.platform}
              {...register(`socialLinks.${index}.platform` as const)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="facebook">Facebook</SelectItem>
                <SelectItem value="twitter">Twitter</SelectItem>
                <SelectItem value="instagram">Instagram</SelectItem>
              </SelectContent>
            </Select>
            <Input
              placeholder="URL"
              {...register(`socialLinks.${index}.href` as const)}
            />
            {errors.socialLinks?.[index] && (
              <p className="text-destructive text-sm">
                {errors.socialLinks[index]?.href?.message ||
                  errors.socialLinks[index]?.platform?.message}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Customer Service */}
      <div>
        <Label htmlFor="customerServiceTitle">Customer Service Title</Label>
        <Input
          id="customerServiceTitle"
          {...register("customerServiceTitle")}
        />
        {errors.customerServiceTitle && (
          <p className="text-destructive text-sm">
            {errors.customerServiceTitle.message}
          </p>
        )}
      </div>
      <div>
        <Label>Customer Service Links</Label>
        {serviceFields.map((field, index) => (
          <div key={field.id} className="flex space-x-2 mt-2">
            <Input
              placeholder="Text"
              {...register(`customerServiceLinks.${index}.text` as const)}
            />
            <Input
              placeholder="Href"
              {...register(`customerServiceLinks.${index}.href` as const)}
            />
            <Button
              type="button"
              variant="destructive"
              onClick={() => removeService(index)}
            >
              Remove
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
          onClick={() => appendService({ text: "", href: "" })}
          className="mt-2"
        >
          Add Link
        </Button>
      </div>

      {/* Contact Info */}
      <div>
        <Label htmlFor="contactTitle">Contact Title</Label>
        <Input id="contactTitle" {...register("contactTitle")} />
        {errors.contactTitle && (
          <p className="text-destructive text-sm">
            {errors.contactTitle.message}
          </p>
        )}
      </div>
      <div>
        <Label>Contacts (Mail, Phone, Address)</Label>
        {contactFields.map((field, index) => (
          <div key={field.id} className="flex space-x-2 mt-2">
            <Select
              defaultValue={field.icon}
              {...register(`contacts.${index}.icon` as const)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mail">Mail</SelectItem>
                <SelectItem value="phone">Phone</SelectItem>
                <SelectItem value="map">Map</SelectItem>
              </SelectContent>
            </Select>
            <Input
              placeholder="Text"
              {...register(`contacts.${index}.text` as const)}
            />
            <Input
              placeholder="Href (optional)"
              {...register(`contacts.${index}.href` as const)}
            />
            {errors.contacts?.[index] && (
              <p className="text-destructive text-sm">
                {errors.contacts[index]?.text?.message ||
                  errors.contacts[index]?.icon?.message ||
                  errors.contacts[index]?.href?.message}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Copyright */}
      <div>
        <Label htmlFor="copyright">Copyright Text</Label>
        <Input id="copyright" {...register("copyright")} />
        {errors.copyright && (
          <p className="text-destructive text-sm">{errors.copyright.message}</p>
        )}
      </div>

      <Button type="submit">Save Changes</Button>
    </form>
  );
}
