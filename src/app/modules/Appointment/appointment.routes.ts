import express from "express";
import { AppointmentController } from "./appointment.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import validateRequest from "../../middlewares/validateRequest";
import { AppointmentValidation } from "./appointment.validation";

const router = express.Router();

// Customer routes
router.post(
  "/",
  auth(UserRole.CUSTOMER),
  validateRequest(AppointmentValidation.createAppointmentValidation),
  AppointmentController.createAppointment,
);

router.get(
  "/my-appointments",
  auth(UserRole.CUSTOMER),
  AppointmentController.getMyAppointments,
);

router.patch(
  "/:id/cancel",
  auth(UserRole.CUSTOMER, UserRole.ADMIN),
  AppointmentController.cancelAppointment,
);

// Stylist routes
router.get(
  "/stylist/:stylistId",
  auth(UserRole.STYLIST, UserRole.ADMIN),
  AppointmentController.getStylistAppointments,
);

// Admin routes
router.get("/", auth(UserRole.ADMIN), AppointmentController.getAllAppointments);

router.patch(
  "/:id/status",
  auth(UserRole.ADMIN),
  validateRequest(AppointmentValidation.updateAppointmentStatusValidation),
  AppointmentController.updateAppointmentStatus,
);

// Shared routes
router.get(
  "/:id",
  auth(UserRole.CUSTOMER, UserRole.STYLIST, UserRole.ADMIN),
  AppointmentController.getAppointmentById,
);

export const AppointmentRoutes = router;
