import express from "express";
import { StylistController } from "./stylist.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import validateRequest from "../../middlewares/validateRequest";
import { StylistValidation } from "./stylist.validation";

const router = express.Router();

// Admin only routes
router.post(
  "/",
  auth(UserRole.ADMIN),
  validateRequest(StylistValidation.createStylistValidation),
  StylistController.createStylist,
);

router.patch(
  "/:id",
  auth(UserRole.ADMIN),
  validateRequest(StylistValidation.updateStylistValidation),
  StylistController.updateStylist,
);

router.delete("/:id", auth(UserRole.ADMIN), StylistController.deleteStylist);

// Public routes (customers can view stylists)
router.get("/", StylistController.getAllStylists);

router.get("/:id", StylistController.getStylistById);

export const StylistRoutes = router;
