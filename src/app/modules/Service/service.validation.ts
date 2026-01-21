import { z } from "zod";

const createServiceValidation = z.object({
  body: z.object({
    name: z.string({
      required_error: "Service name is required",
    }),
    description: z.string().optional(),
    price: z
      .number({
        required_error: "Price is required",
      })
      .positive("Price must be positive"),
    stylistId: z.string({
      required_error: "Stylist ID is required",
    }),
    image: z.string().optional(),
  }),
});

const updateServiceValidation = z.object({
  body: z.object({
    name: z.string().optional(),
    description: z.string().optional(),
    price: z.number().positive().optional(),
    image: z.string().optional(),
    isActive: z.boolean().optional(),
  }),
});

export const ServiceValidation = {
  createServiceValidation,
  updateServiceValidation,
};
