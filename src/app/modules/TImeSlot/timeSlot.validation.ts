import { z } from "zod";

const createTimeSlotValidation = z.object({
  body: z.object({
    stylistId: z.string({
      required_error: "Stylist ID is required",
    }),
    date: z
      .string({
        required_error: "Date is required",
      })
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
    startTime: z
      .string({
        required_error: "Start time is required",
      })
      .regex(
        /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
        "Start time must be in HH:MM format (e.g., 09:00)",
      ),
    endTime: z
      .string({
        required_error: "End time is required",
      })
      .regex(
        /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
        "End time must be in HH:MM format (e.g., 10:00)",
      ),
  }),
});

const createMultipleSlotsValidation = z.object({
  body: z.object({
    stylistId: z.string({
      required_error: "Stylist ID is required",
    }),
    date: z
      .string({
        required_error: "Date is required",
      })
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
    slots: z
      .array(
        z.object({
          startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
          endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
        }),
      )
      .min(1, "At least one slot is required")
      .max(8, "Maximum 8 slots per day"),
  }),
});

export const TimeSlotValidation = {
  createTimeSlotValidation,
  createMultipleSlotsValidation,
};
