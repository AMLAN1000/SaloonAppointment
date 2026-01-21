import prisma from "../../../shared/prisma";
import ApiError from "../../../errors/ApiErrors";
import httpStatus from "http-status";

const createService = async (payload: any) => {
  const { name, description, price, stylistId, image } = payload;

  // Check if stylist exists
  const stylist = await prisma.stylist.findUnique({
    where: { id: stylistId },
  });

  if (!stylist) {
    throw new ApiError(httpStatus.NOT_FOUND, "Stylist not found");
  }

  const service = await prisma.service.create({
    data: {
      name,
      description: description || "",
      price,
      duration: 60, // Fixed 1 hour
      stylistId,
      image: image || "",
      isActive: true,
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

  return service;
};

const getAllServices = async (filters: any) => {
  const { searchTerm, stylistId, isActive } = filters;

  const whereConditions: any = {};

  if (stylistId) {
    whereConditions.stylistId = stylistId;
  }

  if (isActive !== undefined) {
    whereConditions.isActive = isActive === "true";
  }

  if (searchTerm) {
    whereConditions.OR = [
      {
        name: {
          contains: searchTerm,
          mode: "insensitive",
        },
      },
      {
        description: {
          contains: searchTerm,
          mode: "insensitive",
        },
      },
    ];
  }

  const services = await prisma.service.findMany({
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
      _count: {
        select: {
          appointments: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return services;
};

const getServiceById = async (id: string) => {
  const service = await prisma.service.findUnique({
    where: { id },
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
    },
  });

  if (!service) {
    throw new ApiError(httpStatus.NOT_FOUND, "Service not found");
  }

  return service;
};

const updateService = async (id: string, payload: any) => {
  const service = await prisma.service.findUnique({
    where: { id },
  });

  if (!service) {
    throw new ApiError(httpStatus.NOT_FOUND, "Service not found");
  }

  const updatedService = await prisma.service.update({
    where: { id },
    data: payload,
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

  return updatedService;
};

const deleteService = async (id: string) => {
  const service = await prisma.service.findUnique({
    where: { id },
  });

  if (!service) {
    throw new ApiError(httpStatus.NOT_FOUND, "Service not found");
  }

  // Soft delete by setting isActive to false
  await prisma.service.update({
    where: { id },
    data: { isActive: false },
  });

  return { message: "Service deleted successfully" };
};

export const ServiceService = {
  createService,
  getAllServices,
  getServiceById,
  updateService,
  deleteService,
};
