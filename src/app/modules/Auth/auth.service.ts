import { UserRole, UserStatus } from "@prisma/client";
import prisma from "../../../shared/prisma";
import * as bcrypt from "bcrypt";
import config from "../../../config";
import ApiError from "../../../errors/ApiErrors";
import httpStatus from "http-status";
import { jwtHelpers } from "../../../helpars/jwtHelpers";
import { Secret } from "jsonwebtoken";

const register = async (payload: any) => {
  const { fullName, email, password, phoneNumber } = payload;

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

  // Create user with CUSTOMER role
  const user = await prisma.user.create({
    data: {
      fullName,
      email,
      password: hashedPassword,
      phoneNumber: phoneNumber || null,
      role: UserRole.CUSTOMER,
      status: UserStatus.ACTIVE,
      emailVerified: true, // For simplicity, we're setting this to true
    },
    select: {
      id: true,
      fullName: true,
      email: true,
      phoneNumber: true,
      role: true,
      status: true,
      emailVerified: true,
      createdAt: true,
    },
  });

  // Generate JWT token
  const accessToken = jwtHelpers.generateToken(
    {
      userId: user.id,
      email: user.email,
      role: user.role,
    },
    config.jwt.jwt_secret as Secret,
    config.jwt.expires_in as string,
  );

  return {
    user,
    accessToken,
  };
};

const login = async (payload: any) => {
  const { email, password } = payload;

  // Check if user exists
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  // Check if user is deleted
  if (user.isDeleted) {
    throw new ApiError(httpStatus.FORBIDDEN, "Your account has been deleted");
  }

  // Check if user is blocked
  if (user.status === UserStatus.BLOCKED) {
    throw new ApiError(httpStatus.FORBIDDEN, "Your account is blocked");
  }

  // Check if user is suspended
  if (user.status === UserStatus.SUSPENDED) {
    const now = new Date();
    if (user.suspendedUntil && now < new Date(user.suspendedUntil)) {
      throw new ApiError(
        httpStatus.FORBIDDEN,
        `Account suspended until ${user.suspendedUntil}`,
      );
    }
    // Auto-reactivate after suspension ends
    await prisma.user.update({
      where: { id: user.id },
      data: {
        status: UserStatus.ACTIVE,
        suspendedUntil: null,
      },
    });
  }

  // Verify password
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid password");
  }

  // Update last login
  await prisma.user.update({
    where: { id: user.id },
    data: {
      lastLoginAt: new Date(),
    },
  });

  // Generate JWT token
  const accessToken = jwtHelpers.generateToken(
    {
      userId: user.id,
      email: user.email,
      role: user.role,
    },
    config.jwt.jwt_secret as Secret,
    config.jwt.expires_in as string,
  );

  return {
    user: {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      status: user.status,
      emailVerified: user.emailVerified,
    },
    accessToken,
  };
};

const getMyProfile = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      fullName: true,
      email: true,
      phoneNumber: true,
      role: true,
      status: true,
      emailVerified: true,
      profileImage: true,
      lastLoginAt: true,
      createdAt: true,
      updatedAt: true,
      stylistProfile: {
        include: {
          services: true,
          _count: {
            select: {
              appointments: true,
              timeSlots: true,
            },
          },
        },
      },
    },
  });

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  return user;
};

export const AuthService = {
  register,
  login,
  getMyProfile,
};
