import { z } from "zod";

export const carouselSchema = z
  .object({
    title: z.string().min(1, "Title is required"),
    imageUrl: z.string().url("Must be a valid URL"),
    link: z.string().url("Must be a valid URL").optional().or(z.literal("")),
    description: z.string().min(1, "Description is required"),
    startDate: z
      .string()
      .refine((val) => !isNaN(Date.parse(val)), "Invalid start date")
      .transform((val) => new Date(val).toISOString()),
    endDate: z
      .string()
      .refine((val) => !isNaN(Date.parse(val)), "Invalid end date")
      .transform((val) => new Date(val).toISOString()),
    isActive: z.boolean(),
    type: z.enum(["homepage", "product", "category"]),
    sortOrder: z
      .number()
      .int("Must be an integer")
      .min(0, "Sort order must be non-negative"),
  })
  .refine((data) => new Date(data.startDate) <= new Date(data.endDate), {
    message: "End date must be after start date",
    path: ["endDate"],
  });
