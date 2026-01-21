import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { TimeSlotService } from "./timeSlot.service";
import pick from "../../../shared/pick";

const createTimeSlot = catchAsync(async (req: Request, res: Response) => {
  const result = await TimeSlotService.createTimeSlot(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Time slot created successfully",
    data: result,
  });
});

const createMultipleTimeSlots = catchAsync(
  async (req: Request, res: Response) => {
    const result = await TimeSlotService.createMultipleTimeSlots(req.body);

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Time slots created successfully",
      data: result,
    });
  },
);

const getAllTimeSlots = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, ["stylistId", "date", "isBooked"]);
  const result = await TimeSlotService.getAllTimeSlots(filters);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Time slots retrieved successfully",
    data: result,
  });
});

const getAvailableSlots = catchAsync(async (req: Request, res: Response) => {
  const { stylistId, date } = req.query;

  if (!stylistId || !date) {
    return sendResponse(res, {
      statusCode: httpStatus.BAD_REQUEST,
      success: false,
      message: "stylistId and date are required",
      data: null,
    });
  }

  const result = await TimeSlotService.getAvailableSlots(
    stylistId as string,
    date as string,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Available slots retrieved successfully",
    data: result,
  });
});

const deleteTimeSlot = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await TimeSlotService.deleteTimeSlot(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Time slot deleted successfully",
    data: result,
  });
});

export const TimeSlotController = {
  createTimeSlot,
  createMultipleTimeSlots,
  getAllTimeSlots,
  getAvailableSlots,
  deleteTimeSlot,
};
