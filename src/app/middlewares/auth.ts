import { NextFunction, Request, Response } from "express";
import config from "../../config";
import { Secret } from "jsonwebtoken";
import httpStatus from "http-status";
import ApiError from "../../errors/ApiErrors";
import { jwtHelpers } from "../../helpars/jwtHelpers";
import prisma from "../../shared/prisma";
import { UserStatus } from "@prisma/client";

const auth = (...roles: string[]) => {
  return async (
    req: Request & { user?: any },
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const token = req.headers.authorization;

      if (!token) {
        throw new ApiError(httpStatus.UNAUTHORIZED, "You are not authorized!");
      }

      const verifiedUser = jwtHelpers.verifyToken(
        token,
        config.jwt.jwt_secret as Secret,
      );

      const { userId, role } = verifiedUser;

      // 🔎 Check user in DB
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, "User not found!");
      }

      // Block deleted users
      if (user.isDeleted) {
        throw new ApiError(
          httpStatus.FORBIDDEN,
          "Your account has been deleted!",
        );
      }

      // Handle suspended users
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

      // Blocked users
      if (user.status === UserStatus.BLOCKED) {
        throw new ApiError(httpStatus.FORBIDDEN, "Your account is blocked!");
      }

      req.user = {
        userId: verifiedUser.userId,
        email: verifiedUser.email,
        role: verifiedUser.role,
      };

      // ✅ Role-based access
      if (roles.length && !roles.includes(role)) {
        throw new ApiError(httpStatus.FORBIDDEN, "Forbidden!");
      }

      next();
    } catch (err) {
      next(err);
    }
  };
};

export default auth;
