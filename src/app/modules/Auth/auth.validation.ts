import { z } from "zod";

const registerValidation = z.object({
  body: z.object({
    fullName: z.string({
      required_error: "Full name is required",
    }),
    email: z
      .string({
        required_error: "Email is required",
      })
      .email("Invalid email format"),
    password: z
      .string({
        required_error: "Password is required",
      })
      .min(6, "Password must be at least 6 characters"),
    phoneNumber: z.string().optional(),
  }),
});

const loginValidation = z.object({
  body: z.object({
    email: z
      .string({
        required_error: "Email is required",
      })
      .email("Invalid email format"),
    password: z.string({
      required_error: "Password is required",
    }),
  }),
});
const updateProfileValidation = z.object({
  body: z.object({
    fullName: z.string().optional(),
    phoneNumber: z.string().optional(),
    profileImage: z.string().optional(),
  }),
});

export const AuthValidation = {
  registerValidation,
  loginValidation,
  updateProfileValidation
};
