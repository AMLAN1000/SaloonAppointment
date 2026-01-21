import { z } from "zod";

const createAppointmentValidation = z.object({
  body: z.object({
    stylistId: z.string({
      required_error: "Stylist ID is required",
    }),
    serviceId: z.string({
      required_error: "Service ID is required",
    }),
    timeSlotId: z.string({
      required_error: "Time slot ID is required",
    }),
    notes: z.string().optional(),
  }),
});

const updateAppointmentStatusValidation = z.object({
  body: z.object({
    status: z.enum(["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"], {
      required_error: "Status is required",
    }),
    cancellationReason: z.string().optional(),
  }),
});

export const AppointmentValidation = {
  createAppointmentValidation,
  updateAppointmentStatusValidation,
};
