import prisma from "../../../shared/prisma";
import ApiError from "../../../errors/ApiErrors";
import httpStatus from "http-status";
import { AppointmentStatus } from "@prisma/client";

const createAppointment = async (customerId: string, payload: any) => {
  const { stylistId, serviceId, timeSlotId, notes } = payload;

  // 1. Validate stylist exists
  const stylist = await prisma.stylist.findUnique({
    where: { id: stylistId },
  });

  if (!stylist) {
    throw new ApiError(httpStatus.NOT_FOUND, "Stylist not found");
  }

  // 2. Validate service exists and belongs to stylist
  const service = await prisma.service.findUnique({
    where: { id: serviceId },
  });

  if (!service) {
    throw new ApiError(httpStatus.NOT_FOUND, "Service not found");
  }

  if (service.stylistId !== stylistId) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "This service is not offered by the selected stylist",
    );
  }

  // 3. Validate time slot exists and is available
  const timeSlot = await prisma.timeSlot.findUnique({
    where: { id: timeSlotId },
    include: {
      appointment: true,
    },
  });

  if (!timeSlot) {
    throw new ApiError(httpStatus.NOT_FOUND, "Time slot not found");
  }

  if (timeSlot.stylistId !== stylistId) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "This time slot does not belong to the selected stylist",
    );
  }

  if (timeSlot.isBooked || timeSlot.appointment) {
    throw new ApiError(
      httpStatus.CONFLICT,
      "The selected time slot is already booked for this stylist",
    );
  }

  // 4. Check if customer already has an appointment at the same time
  const conflictingAppointment = await prisma.appointment.findFirst({
    where: {
      customerId,
      timeSlot: {
        date: timeSlot.date,
        startTime: timeSlot.startTime,
      },
      status: {
        in: [AppointmentStatus.PENDING, AppointmentStatus.CONFIRMED],
      },
    },
  });

  if (conflictingAppointment) {
    throw new ApiError(
      httpStatus.CONFLICT,
      "You already have an appointment at this time",
    );
  }

  // 5. Create appointment and mark slot as booked (transaction)
  const result = await prisma.$transaction(async (tx) => {
    // Mark time slot as booked
    await tx.timeSlot.update({
      where: { id: timeSlotId },
      data: { isBooked: true },
    });

    // Create appointment
    const appointment = await tx.appointment.create({
      data: {
        customerId,
        stylistId,
        serviceId,
        timeSlotId,
        notes: notes || "",
        status: AppointmentStatus.PENDING,
      },
      include: {
        customer: {
          select: {
            id: true,
            fullName: true,
            email: true,
            phoneNumber: true,
          },
        },
        stylist: {
          include: {
            user: {
              select: {
                fullName: true,
                email: true,
                phoneNumber: true,
              },
            },
          },
        },
        service: true,
        timeSlot: true,
      },
    });

    return appointment;
  });

  return result;
};

const getMyAppointments = async (customerId: string, filters: any) => {
  const { status } = filters;

  const whereConditions: any = {
    customerId,
  };

  if (status) {
    whereConditions.status = status;
  }

  const appointments = await prisma.appointment.findMany({
    where: whereConditions,
    include: {
      stylist: {
        include: {
          user: {
            select: {
              fullName: true,
              email: true,
              phoneNumber: true,
              profileImage: true,
            },
          },
        },
      },
      service: true,
      timeSlot: true,
    },
    orderBy: [
      { timeSlot: { date: "desc" } },
      { timeSlot: { startTime: "desc" } },
    ],
  });

  return appointments;
};

const getStylistAppointments = async (stylistId: string, filters: any) => {
  const { status, date } = filters;

  // First get the stylist
  const stylist = await prisma.stylist.findUnique({
    where: { id: stylistId },
  });

  if (!stylist) {
    throw new ApiError(httpStatus.NOT_FOUND, "Stylist not found");
  }

  const whereConditions: any = {
    stylistId,
  };

  if (status) {
    whereConditions.status = status;
  }

  if (date) {
    const slotDate = new Date(date);
    whereConditions.timeSlot = {
      date: slotDate,
    };
  }

  const appointments = await prisma.appointment.findMany({
    where: whereConditions,
    include: {
      customer: {
        select: {
          id: true,
          fullName: true,
          email: true,
          phoneNumber: true,
        },
      },
      service: true,
      timeSlot: true,
    },
    orderBy: [
      { timeSlot: { date: "asc" } },
      { timeSlot: { startTime: "asc" } },
    ],
  });

  return appointments;
};

const getAllAppointments = async (filters: any) => {
  const { status, stylistId, customerId, date } = filters;

  const whereConditions: any = {};

  if (status) {
    whereConditions.status = status;
  }

  if (stylistId) {
    whereConditions.stylistId = stylistId;
  }

  if (customerId) {
    whereConditions.customerId = customerId;
  }

  if (date) {
    const slotDate = new Date(date);
    whereConditions.timeSlot = {
      date: slotDate,
    };
  }

  const appointments = await prisma.appointment.findMany({
    where: whereConditions,
    include: {
      customer: {
        select: {
          id: true,
          fullName: true,
          email: true,
          phoneNumber: true,
        },
      },
      stylist: {
        include: {
          user: {
            select: {
              fullName: true,
              email: true,
              phoneNumber: true,
            },
          },
        },
      },
      service: true,
      timeSlot: true,
    },
    orderBy: [
      { timeSlot: { date: "desc" } },
      { timeSlot: { startTime: "desc" } },
    ],
  });

  return appointments;
};

const getAppointmentById = async (id: string) => {
  const appointment = await prisma.appointment.findUnique({
    where: { id },
    include: {
      customer: {
        select: {
          id: true,
          fullName: true,
          email: true,
          phoneNumber: true,
        },
      },
      stylist: {
        include: {
          user: {
            select: {
              fullName: true,
              email: true,
              phoneNumber: true,
            },
          },
        },
      },
      service: true,
      timeSlot: true,
    },
  });

  if (!appointment) {
    throw new ApiError(httpStatus.NOT_FOUND, "Appointment not found");
  }

  return appointment;
};

const cancelAppointment = async (
  appointmentId: string,
  userId: string,
  userRole: string,
  cancellationReason?: string,
) => {
  const appointment = await prisma.appointment.findUnique({
    where: { id: appointmentId },
    include: {
      timeSlot: true,
    },
  });

  if (!appointment) {
    throw new ApiError(httpStatus.NOT_FOUND, "Appointment not found");
  }

  // Check if user has permission to cancel
  if (userRole === "CUSTOMER" && appointment.customerId !== userId) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "You can only cancel your own appointments",
    );
  }

  // Check if already cancelled
  if (appointment.status === AppointmentStatus.CANCELLED) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "This appointment is already cancelled",
    );
  }

  // Business Rule: Customer can cancel at least 2 hours before scheduled time
  if (userRole === "CUSTOMER") {
    const appointmentDateTime = new Date(appointment.timeSlot.date);
    const [hours, minutes] = appointment.timeSlot.startTime.split(":");
    appointmentDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

    const now = new Date();
    const hoursUntilAppointment =
      (appointmentDateTime.getTime() - now.getTime()) / (1000 * 60 * 60);

    if (hoursUntilAppointment < 2) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "Appointments can only be cancelled at least 2 hours before the scheduled time",
      );
    }
  }

  // Cancel appointment and free the slot
  const result = await prisma.$transaction(async (tx) => {
    // Update appointment status
    const cancelledAppointment = await tx.appointment.update({
      where: { id: appointmentId },
      data: {
        status: AppointmentStatus.CANCELLED,
        cancellationReason: cancellationReason || "Cancelled by user",
      },
      include: {
        customer: {
          select: {
            fullName: true,
            email: true,
          },
        },
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
        service: true,
        timeSlot: true,
      },
    });

    // Free up the time slot
    await tx.timeSlot.update({
      where: { id: appointment.timeSlotId },
      data: { isBooked: false },
    });

    return cancelledAppointment;
  });

  return result;
};

const updateAppointmentStatus = async (appointmentId: string, payload: any) => {
  const appointment = await prisma.appointment.findUnique({
    where: { id: appointmentId },
  });

  if (!appointment) {
    throw new ApiError(httpStatus.NOT_FOUND, "Appointment not found");
  }

  const updatedAppointment = await prisma.appointment.update({
    where: { id: appointmentId },
    data: {
      status: payload.status,
      ...(payload.cancellationReason && {
        cancellationReason: payload.cancellationReason,
      }),
    },
    include: {
      customer: {
        select: {
          fullName: true,
          email: true,
        },
      },
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
      service: true,
      timeSlot: true,
    },
  });

  return updatedAppointment;
};

export const AppointmentService = {
  createAppointment,
  getMyAppointments,
  getStylistAppointments,
  getAllAppointments,
  getAppointmentById,
  cancelAppointment,
  updateAppointmentStatus,
};
