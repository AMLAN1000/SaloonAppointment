import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { AppointmentService } from "./appointment.service";
import pick from "../../../shared/pick";

const createAppointment = catchAsync(async (req: Request, res: Response) => {
  const customerId = req.user!.userId;
  const result = await AppointmentService.createAppointment(
    customerId,
    req.body,
  );

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Appointment booked successfully",
    data: result,
  });
});

const getMyAppointments = catchAsync(async (req: Request, res: Response) => {
  const customerId = req.user!.userId;
  const filters = pick(req.query, ["status"]);
  const result = await AppointmentService.getMyAppointments(
    customerId,
    filters,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "My appointments retrieved successfully",
    data: result,
  });
});

const getStylistAppointments = catchAsync(
  async (req: Request, res: Response) => {
    const { stylistId } = req.params;
    const filters = pick(req.query, ["status", "date"]);
    const result = await AppointmentService.getStylistAppointments(
      stylistId,
      filters,
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Stylist appointments retrieved successfully",
      data: result,
    });
  },
);

const getAllAppointments = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, [
    "status",
    "stylistId",
    "customerId",
    "date",
  ]);
  const result = await AppointmentService.getAllAppointments(filters);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All appointments retrieved successfully",
    data: result,
  });
});

const getAppointmentById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await AppointmentService.getAppointmentById(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Appointment retrieved successfully",
    data: result,
  });
});

const cancelAppointment = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user!.userId;
  const userRole = req.user!.role;
  const { cancellationReason } = req.body;

  const result = await AppointmentService.cancelAppointment(
    id,
    userId,
    userRole,
    cancellationReason,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Appointment cancelled successfully",
    data: result,
  });
});

const updateAppointmentStatus = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await AppointmentService.updateAppointmentStatus(
      id,
      req.body,
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Appointment status updated successfully",
      data: result,
    });
  },
);

export const AppointmentController = {
  createAppointment,
  getMyAppointments,
  getStylistAppointments,
  getAllAppointments,
  getAppointmentById,
  cancelAppointment,
  updateAppointmentStatus,
};
