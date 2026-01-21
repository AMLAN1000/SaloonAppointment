import express from "express";
import { AuthController } from "./auth.controller";
import validateRequest from "../../middlewares/validateRequest";
import { AuthValidation } from "./auth.validation";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = express.Router();

// Public routes
router.post(
  "/register",
  validateRequest(AuthValidation.registerValidation),
  AuthController.register,
);

router.post(
  "/login",
  validateRequest(AuthValidation.loginValidation),
  AuthController.login,
);

// Protected routes
router.get(
  "/me",
  auth(UserRole.ADMIN, UserRole.STYLIST, UserRole.CUSTOMER),
  AuthController.getMyProfile,
);

export const AuthRoutes = router;
