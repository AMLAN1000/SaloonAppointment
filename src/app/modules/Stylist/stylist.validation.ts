import { z } from "zod";
import { UserRole } from "@prisma/client";

const createStylistValidation = z.object({
  body: z.object({
    // User fields
    fullName: z.string({
      required_error: "Full name is required",
    }),
    email: z
      .string({
        required_error: "Email is required",
      })
      .email("Invalid email format"),
    password: z
      .string({
        required_error: "Password is required",
      })
      .min(6, "Password must be at least 6 characters"),
    phoneNumber: z.string().optional(),

    // Stylist specific fields
    bio: z.string().optional(),
    specialization: z.array(z.string()).optional(),
    experience: z.number().int().min(0).optional(),
  }),
});

const updateStylistValidation = z.object({
  body: z.object({
    fullName: z.string().optional(),
    phoneNumber: z.string().optional(),
    bio: z.string().optional(),
    specialization: z.array(z.string()).optional(),
    experience: z.number().int().min(0).optional(),
    isAvailable: z.boolean().optional(),
  }),
});

export const StylistValidation = {
  createStylistValidation,
  updateStylistValidation,
};
