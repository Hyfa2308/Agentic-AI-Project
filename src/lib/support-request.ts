import { z } from "zod";
import { issueCategories, requestedPriorities } from "@/types/support";

export const MAX_ATTACHMENT_BYTES = 5 * 1024 * 1024;
export const ATTACHMENT_TYPES = ["image/png", "image/jpeg", "application/pdf"];
export const ATTACHMENT_EXT = /\.(png|jpe?g|pdf)$/i;

export const supportRequestSchema = z.object({
  fullName: z.string().trim().min(2, "Please enter your full name.").max(100, "Name must be under 100 characters."),
  email: z.string().trim().min(1, "Email address is required.").email("Enter a valid email, e.g. name@company.com.").max(255),
  phone: z
    .string()
    .trim()
    .max(20, "Phone number is too long.")
    .refine((v) => v === "" || /^\+?[0-9\s\-().]{7,20}$/.test(v), "Enter a valid phone number (digits, spaces, +, - only).")
    .refine((v) => v === "" || v.replace(/\D/g, "").length >= 7, "Phone number needs at least 7 digits."),
  category: z.enum(issueCategories, { message: "Choose a category." }),
  subject: z.string().trim().min(1, "Subject is required.").max(255, "Subject must be 255 characters or fewer."),
  description: z
    .string()
    .trim()
    .min(20, "Please describe the issue in at least 20 characters.")
    .max(5000, "Description must be 5,000 characters or fewer."),
  requestedPriority: z.enum(requestedPriorities, { message: "Choose a priority." }),
  productAffected: z.string().trim().max(150, "Must be 150 characters or fewer."),
});

export type SupportRequestForm = Record<keyof z.infer<typeof supportRequestSchema>, string>;
export const emptyForm: SupportRequestForm = {
  fullName: "", email: "", phone: "", category: "", subject: "",
  description: "", requestedPriority: "", productAffected: "",
};

export function validateAttachment(file: File): string | null {
  if (!ATTACHMENT_TYPES.includes(file.type) && !ATTACHMENT_EXT.test(file.name))
    return "Only PNG, JPG, JPEG or PDF files are allowed.";
  if (!ATTACHMENT_EXT.test(file.name)) return "Only PNG, JPG, JPEG or PDF files are allowed.";
  if (file.size > MAX_ATTACHMENT_BYTES) return "File must be 5 MB or smaller.";
  return null;
}
