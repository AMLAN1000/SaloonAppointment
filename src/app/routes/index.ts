// src/app/routes/index.ts
import express from "express";
import { AuthRoutes } from "../modules/Auth/auth.routes";
import { StylistRoutes } from "../modules/Stylist/stylish.routes";
import { ServiceRoutes } from "../modules/Service/service.routes";
import { TimeSlotRoutes } from "../modules/TImeSlot/timeSlot.routes";
import { AppointmentRoutes } from "../modules/Appointment/appointment.routes";

const router = express.Router();

const moduleRoutes = [
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/stylists",
    route: StylistRoutes,
  },
  {
    path: "/services",
    route: ServiceRoutes,
  },
  {
    path: "/time-slots",
    route: TimeSlotRoutes,
  },
  {
    path: "/appointments",
    route: AppointmentRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
