import express from "express";
import { TimeSlotController } from "./timeSlot.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import validateRequest from "../../middlewares/validateRequest";
import { TimeSlotValidation } from "./timeSlot.validation";

const router = express.Router();

// Admin only routes
router.post(
  "/",
  auth(UserRole.ADMIN),
  validateRequest(TimeSlotValidation.createTimeSlotValidation),
  TimeSlotController.createTimeSlot,
);

router.post(
  "/bulk",
  auth(UserRole.ADMIN),
  validateRequest(TimeSlotValidation.createMultipleSlotsValidation),
  TimeSlotController.createMultipleTimeSlots,
);

router.delete("/:id", auth(UserRole.ADMIN), TimeSlotController.deleteTimeSlot);

// Public/Protected routes
router.get("/", TimeSlotController.getAllTimeSlots);

router.get("/available", TimeSlotController.getAvailableSlots);

export const TimeSlotRoutes = router;
