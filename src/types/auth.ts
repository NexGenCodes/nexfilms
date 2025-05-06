import { VALIDATION_MESSAGES } from "@/constants";
import { z } from "zod";

const password = z
  .string()
  .min(8, { message: VALIDATION_MESSAGES.PASSWORD_MIN });
const email = z.string().email({ message: VALIDATION_MESSAGES.EMAIL_INVALID });
const otp = z
  .string()
  .regex(/^\d{6}$/, { message: "OTP must be exactly 6 digits" });

// Utility to validate required fields
const requiredField = (field: z.ZodTypeAny, message: string) =>
  field.refine((value) => value !== "", { message });

// Schemas
export const loginSchema = z.object({
  email,
  password,
});

export const registerSchema = z
  .object({
    name: requiredField(z.string(), VALIDATION_MESSAGES.REQUIRED),
    email,
    password,
    confirmPassword: password,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const forgotPasswordSchema = z.object({
  email: requiredField(email, "Email is required"),
});

export const resetPasswordSchema = z
  .object({
    password,
    confirmPassword: password,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const verifyOtpSchema = z
  .object({
    otp: requiredField(otp, "OTP is required"),
    iv: requiredField(z.string(), "IV is required"),
    encrypted: requiredField(z.string(), "Encrypted data is required"),
  })
  .strict();

export const resendOtpSchema = z
  .object({
    iv: requiredField(z.string(), "IV is required"),
    encrypted: requiredField(z.string(), "Encrypted data is required"),
  })
  .strict();

export const profileUpdateSchema = z.object({
  name: z.string().min(1, { message: VALIDATION_MESSAGES.REQUIRED }).optional(),
  bio: z
    .string()
    .max(160, { message: VALIDATION_MESSAGES.REQUIRED })
    .optional(),
  userId: z.string().optional(),
});

export const passwordUpdateSchema = z
  .object({
    currentPassword: z
      .string()
      .min(8, { message: VALIDATION_MESSAGES.PASSWORD_MIN }),
    newPassword: z
      .string()
      .min(8, { message: VALIDATION_MESSAGES.PASSWORD_MIN }),
    confirmPassword: z
      .string()
      .min(8, { message: VALIDATION_MESSAGES.PASSWORD_MIN }),
      userId: z.string().optional(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })
  .refine((data) => data.currentPassword === data.newPassword, {
    message: "New password must be different from current password",
    path: ["newPassword"],
  })
  .refine((data) => data.newPassword !== data.confirmPassword, {
    message: "New password must be equal to confirm password",
    path: ["confirmPassword"],
  });

// Types
export type LoginSchema = z.infer<typeof loginSchema>;
export type RegisterSchema = z.infer<typeof registerSchema>;
export type ForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>;
export type VerifyOtpSchema = z.infer<typeof verifyOtpSchema>;
export type ResendOtpSchema = z.infer<typeof resendOtpSchema>;
export type ProfileUpdateSchema = z.infer<typeof profileUpdateSchema>;
export type PasswordUpdateSchema = z.infer<typeof passwordUpdateSchema>;
