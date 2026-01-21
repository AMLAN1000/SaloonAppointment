import { UserRole, UserStatus } from "@prisma/client";
import prisma from "../../shared/prisma";
import * as bcrypt from "bcrypt";
import config from "../../config";

export const initiateSuperAdmin = async () => {
  try {
    const hashedPassword = await bcrypt.hash(
      "Admin123",
      Number(config.bcrypt_salt_rounds),
    );

    const payload = {
      fullName: "Admin",
      email: "admin@salon.com",
      password: hashedPassword,
      phoneNumber: "+1234567890",
      role: UserRole.ADMIN,
      emailVerified: true,
      status: UserStatus.ACTIVE,
      isDeleted: false,
    };

    const isExistUser = await prisma.user.findUnique({
      where: {
        email: payload.email,
      },
    });

    if (isExistUser) {
      console.log("Admin already exists");
      return;
    }

    await prisma.user.create({
      data: payload,
    });

    console.log("Admin created successfully");
    console.log("Email: admin@salon.com");
    console.log("Password: Admin123");
  } catch (error) {
    console.error("❌ Error creating Super Admin:", error);
  }
};
