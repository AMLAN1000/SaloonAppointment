import prisma from "../../../shared/prisma";
import ApiError from "../../../errors/ApiErrors";
import httpStatus from "http-status";

const createTimeSlot = async (payload: any) => {
  const { stylistId, date, startTime, endTime } = payload;

  // Check if stylist exists
  const stylist = await prisma.stylist.findUnique({
    where: { id: stylistId },
  });

  if (!stylist) {
    throw new ApiError(httpStatus.NOT_FOUND, "Stylist not found");
  }

  // Parse date string to Date object
  const slotDate = new Date(date);

  // Check if date is in the past
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  slotDate.setHours(0, 0, 0, 0);

  if (slotDate < today) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Cannot create slots for past dates",
    );
  }

  // Check daily limit (max 8 slots per day per stylist)
  const existingSlotsCount = await prisma.timeSlot.count({
    where: {
      stylistId,
      date: slotDate,
    },
  });

  if (existingSlotsCount >= 8) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Daily limit reached: Maximum 8 slots per stylist per day",
    );
  }

  // Check for duplicate slot
  const existingSlot = await prisma.timeSlot.findFirst({
    where: {
      stylistId,
      date: slotDate,
      startTime,
    },
  });

  if (existingSlot) {
    throw new ApiError(
      httpStatus.CONFLICT,
      "This time slot already exists for this stylist",
    );
  }

  // Create the time slot
  const timeSlot = await prisma.timeSlot.create({
    data: {
      stylistId,
      date: slotDate,
      startTime,
      endTime,
      isBooked: false,
    },
    include: {
      stylist: {
        include: {
          user: {
            select: {
              fullName: true,
              email: true,
            },
          },
        },
      },
    },
  });

  return timeSlot;
};

const createMultipleTimeSlots = async (payload: any) => {
  const { stylistId, date, slots } = payload;

  // Check if stylist exists
  const stylist = await prisma.stylist.findUnique({
    where: { id: stylistId },
  });

  if (!stylist) {
    throw new ApiError(httpStatus.NOT_FOUND, "Stylist not found");
  }

  const slotDate = new Date(date);

  // Check if date is in the past
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  slotDate.setHours(0, 0, 0, 0);

  if (slotDate < today) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Cannot create slots for past dates",
    );
  }

  // Check existing slots for the day
  const existingSlotsCount = await prisma.timeSlot.count({
    where: {
      stylistId,
      date: slotDate,
    },
  });

  if (existingSlotsCount + slots.length > 8) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `Daily limit exceeded: Can only add ${8 - existingSlotsCount} more slot(s) for this day`,
    );
  }

  // Create all slots in a transaction
  const createdSlots = await prisma.$transaction(
    slots.map((slot: any) =>
      prisma.timeSlot.create({
        data: {
          stylistId,
          date: slotDate,
          startTime: slot.startTime,
          endTime: slot.endTime,
          isBooked: false,
        },
        include: {
          stylist: {
            include: {
              user: {
                select: {
                  fullName: true,
                  email: true,
                },
              },
            },
          },
        },
      }),
    ),
  );

  return createdSlots;
};

const getAllTimeSlots = async (filters: any) => {
  const { stylistId, date, isBooked } = filters;

  const whereConditions: any = {};

  if (stylistId) {
    whereConditions.stylistId = stylistId;
  }

  if (date) {
    // FIX: Create date range for the entire day
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);

    whereConditions.date = {
      gte: startDate,
      lte: endDate,
    };
  }

  if (isBooked !== undefined) {
    whereConditions.isBooked = isBooked === "true";
  }

  const timeSlots = await prisma.timeSlot.findMany({
    where: whereConditions,
    include: {
      stylist: {
        include: {
          user: {
            select: {
              fullName: true,
              email: true,
              profileImage: true,
            },
          },
        },
      },
      appointment: {
        include: {
          customer: {
            select: {
              fullName: true,
              email: true,
            },
          },
          service: true,
        },
      },
    },
    orderBy: [{ date: "asc" }, { startTime: "asc" }],
  });

  return timeSlots;
};

const getAvailableSlots = async (stylistId: string, date: string) => {
  // FIX: Create date range for the entire day
  const startDate = new Date(date);
  startDate.setHours(0, 0, 0, 0);

  const endDate = new Date(date);
  endDate.setHours(23, 59, 59, 999);

  const availableSlots = await prisma.timeSlot.findMany({
    where: {
      stylistId,
      date: {
        gte: startDate,
        lte: endDate,
      },
      isBooked: false,
    },
    include: {
      stylist: {
        include: {
          user: {
            select: {
              fullName: true,
              email: true,
            },
          },
        },
      },
    },
    orderBy: {
      startTime: "asc",
    },
  });

  return availableSlots;
};
const deleteTimeSlot = async (id: string) => {
  const timeSlot = await prisma.timeSlot.findUnique({
    where: { id },
    include: {
      appointment: true,
    },
  });

  if (!timeSlot) {
    throw new ApiError(httpStatus.NOT_FOUND, "Time slot not found");
  }

  if (timeSlot.isBooked || timeSlot.appointment) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Cannot delete a booked time slot. Cancel the appointment first.",
    );
  }

  await prisma.timeSlot.delete({
    where: { id },
  });

  return { message: "Time slot deleted successfully" };
};

export const TimeSlotService = {
  createTimeSlot,
  createMultipleTimeSlots,
  getAllTimeSlots,
  getAvailableSlots,
  deleteTimeSlot,
};
