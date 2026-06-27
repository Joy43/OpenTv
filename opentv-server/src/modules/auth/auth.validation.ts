import z from "zod";
const loginValidationSchema = z.object({
  body: z.object({
    email: z
      .string({ required_error: "Email is required" })
      .email({ message: "Invalid email address" }),
    password: z.string({ required_error: "Password is required" }),
  }),
});
const registrationValidationSchema = z.object({
  body: z.object({
    fullName: z.string().optional(),
    email: z
      .string({ required_error: "Email is required" })
      .email({ message: "Invalid email address" }),
    password: z
      .string({ required_error: "Password is required" })
      .min(6, "Password must be at least 6 characters"),
  }),
});

const changePasswordSchema = z.object({
  body: z.object({
    oldPassword: z
      .string({ required_error: "Old Password is required" })
      .min(6, "Password must be at least 6 characters"),
    newPassword: z
      .string({ required_error: "New Password is required" })
      .min(6, "Password must be at least 6 characters"),
    email: z.string({ required_error: "Email is required" }),
  }),
});
const forgetPasswordSchema = z.object({
  body: z.object({
    email: z.string({ required_error: "Email is required" }),
  }),
});
const resetPasswordSchema = z.object({
  body: z.object({
    email: z.string({ required_error: "Email is required" }),
    token: z.string({ required_error: "Token is required" }),
    newPassword: z.string({ required_error: "New Password is required" }),
  }),
});

export const authValidation = {
  loginValidationSchema,
  registrationValidationSchema,
  changePasswordSchema,
  forgetPasswordSchema,
  resetPasswordSchema,
};
