import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { StylistService } from "./stylist.service";
import pick from "../../../shared/pick";

const createStylist = catchAsync(async (req: Request, res: Response) => {
  const result = await StylistService.createStylist(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Stylist created successfully",
    data: result,
  });
});

const getAllStylists = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, ["searchTerm", "isAvailable"]);
  const result = await StylistService.getAllStylists(filters);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Stylists retrieved successfully",
    data: result,
  });
});

const getStylistById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await StylistService.getStylistById(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Stylist retrieved successfully",
    data: result,
  });
});

const updateStylist = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await StylistService.updateStylist(id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Stylist updated successfully",
    data: result,
  });
});

const deleteStylist = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await StylistService.deleteStylist(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Stylist deleted successfully",
    data: result,
  });
});

export const StylistController = {
  createStylist,
  getAllStylists,
  getStylistById,
  updateStylist,
  deleteStylist,
};
