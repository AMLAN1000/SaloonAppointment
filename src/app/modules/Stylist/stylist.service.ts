import { UserRole, UserStatus } from "@prisma/client";
import prisma from "../../../shared/prisma";
import * as bcrypt from "bcrypt";
import config from "../../../config";
import ApiError from "../../../errors/ApiErrors";
import httpStatus from "http-status";

const createStylist = async (payload: any) => {
  const {
    fullName,
    email,
    password,
    phoneNumber,
    bio,
    specialization,
    experience,
  } = payload;

  // Check if email already exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new ApiError(httpStatus.CONFLICT, "Email already exists");
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(
    password,
    Number(config.bcrypt_salt_rounds),
  );

  // Create user and stylist in a transaction
  const result = await prisma.$transaction(async (tx) => {
    // Create user with STYLIST role
    const user = await tx.user.create({
      data: {
        fullName,
        email,
        password: hashedPassword,
        phoneNumber,
        role: UserRole.STYLIST,
        status: UserStatus.ACTIVE,
        emailVerified: true,
      },
    });

    // Create stylist profile
    const stylist = await tx.stylist.create({
      data: {
        userId: user.id,
        bio: bio || "",
        specialization: specialization || [],
        experience: experience || 0,
        isAvailable: true,
      },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            phoneNumber: true,
            role: true,
            status: true,
            profileImage: true,
          },
        },
      },
    });

    return stylist;
  });

  return result;
};

const getAllStylists = async (filters: any) => {
  const { searchTerm, isAvailable } = filters;

  const whereConditions: any = {
    user: {
      isDeleted: false,
      role: UserRole.STYLIST,
    },
  };

  if (isAvailable !== undefined) {
    whereConditions.isAvailable = isAvailable === "true";
  }

  if (searchTerm) {
    whereConditions.OR = [
      {
        user: {
          fullName: {
            contains: searchTerm,
            mode: "insensitive",
          },
        },
      },
      {
        user: {
          email: {
            contains: searchTerm,
            mode: "insensitive",
          },
        },
      },
    ];
  }

  const stylists = await prisma.stylist.findMany({
    where: whereConditions,
    include: {
      user: {
        select: {
          id: true,
          fullName: true,
          email: true,
          phoneNumber: true,
          role: true,
          status: true,
          profileImage: true,
          createdAt: true,
        },
      },
      services: {
        where: {
          isActive: true,
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

  return stylists;
};

const getStylistById = async (id: string) => {
  const stylist = await prisma.stylist.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          fullName: true,
          email: true,
          phoneNumber: true,
          role: true,
          status: true,
          profileImage: true,
          createdAt: true,
        },
      },
      services: {
        where: {
          isActive: true,
        },
      },
      _count: {
        select: {
          appointments: true,
          timeSlots: true,
        },
      },
    },
  });

  if (!stylist) {
    throw new ApiError(httpStatus.NOT_FOUND, "Stylist not found");
  }

  return stylist;
};

const updateStylist = async (id: string, payload: any) => {
  const stylist = await prisma.stylist.findUnique({
    where: { id },
  });

  if (!stylist) {
    throw new ApiError(httpStatus.NOT_FOUND, "Stylist not found");
  }

  const {
    fullName,
    phoneNumber,
    bio,
    specialization,
    experience,
    isAvailable,
  } = payload;

  const result = await prisma.$transaction(async (tx) => {
    // Update user fields if provided
    if (fullName || phoneNumber) {
      await tx.user.update({
        where: { id: stylist.userId },
        data: {
          ...(fullName && { fullName }),
          ...(phoneNumber && { phoneNumber }),
        },
      });
    }

    // Update stylist profile
    const updatedStylist = await tx.stylist.update({
      where: { id },
      data: {
        ...(bio !== undefined && { bio }),
        ...(specialization && { specialization }),
        ...(experience !== undefined && { experience }),
        ...(isAvailable !== undefined && { isAvailable }),
      },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            phoneNumber: true,
            role: true,
            status: true,
            profileImage: true,
          },
        },
      },
    });

    return updatedStylist;
  });

  return result;
};

const deleteStylist = async (id: string) => {
  const stylist = await prisma.stylist.findUnique({
    where: { id },
  });

  if (!stylist) {
    throw new ApiError(httpStatus.NOT_FOUND, "Stylist not found");
  }

  // Soft delete the user (which will cascade to stylist due to relation)
  await prisma.user.update({
    where: { id: stylist.userId },
    data: {
      isDeleted: true,
      status: UserStatus.INACTIVE,
    },
  });

  return { message: "Stylist deleted successfully" };
};

export const StylistService = {
  createStylist,
  getAllStylists,
  getStylistById,
  updateStylist,
  deleteStylist,
};
