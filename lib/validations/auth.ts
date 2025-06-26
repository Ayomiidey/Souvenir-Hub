import { z } from "zod";

const emailSchema = z
  .string()
  .min(1, "Email is required")
  .email("Please enter a valid email address")
  .max(254, "Email is too long")
  .refine((email) => {
    // Additional email validation rules
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  }, "Please enter a valid email address");

const nameSchema = z
  .string()
  .min(1, "Full name is required")
  .min(2, "Name must be at least 2 characters")
  .max(50, "Name must be less than 50 characters")
  .refine((name) => {
    // Allow letters, spaces, hyphens, and apostrophes
    const nameRegex = /^[a-zA-Z\s\-']+$/;
    return nameRegex.test(name.trim());
  }, "Name can only contain letters, spaces, hyphens, and apostrophes")
  .refine((name) => {
    // Ensure name has at least one letter
    return /[a-zA-Z]/.test(name);
  }, "Name must contain at least one letter")
  .transform((name) => name.trim());

const passwordSchema = z
  .string()
  .min(1, "Password is required")
  .min(8, "Password must be at least 8 characters")
  .max(128, "Password is too long")
  .refine(
    (password) => /[a-z]/.test(password),
    "Password must contain at least one lowercase letter"
  )
  .refine(
    (password) => /[A-Z]/.test(password),
    "Password must contain at least one uppercase letter"
  )
  .refine(
    (password) => /\d/.test(password),
    "Password must contain at least one number"
  )
  .refine(
    (password) => /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password),
    "Password must contain at least one special character"
  );

export const signinSchema = z.object({
  email: emailSchema,
  password: z.string().min(6),
});

export const signUpFormSchema = z
  .object({
    name: nameSchema,
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(8, "Confirm password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// Schema for API validation (excludes confirmPassword)
export const signUpSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export type SignUpFormData = z.infer<typeof signUpFormSchema>;
export type SignUpApiData = z.infer<typeof signUpSchema>;
export type SignInData = z.infer<typeof signinSchema>;
