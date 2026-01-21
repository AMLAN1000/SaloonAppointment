import express from "express";
import { ServiceController } from "./service.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import validateRequest from "../../middlewares/validateRequest";
import { ServiceValidation } from "./service.validation";

const router = express.Router();

// Admin only routes
router.post(
  "/",
  auth(UserRole.ADMIN),
  validateRequest(ServiceValidation.createServiceValidation),
  ServiceController.createService,
);

router.patch(
  "/:id",
  auth(UserRole.ADMIN),
  validateRequest(ServiceValidation.updateServiceValidation),
  ServiceController.updateService,
);

router.delete("/:id", auth(UserRole.ADMIN), ServiceController.deleteService);

// Public routes (customers can view services)
router.get("/", ServiceController.getAllServices);

router.get("/:id", ServiceController.getServiceById);

export const ServiceRoutes = router;
