"use server";

import { OTP_EXPIRATION, RATE_LIMIT } from "@/constants";
import { getFromCache, setToCache } from "@/lib/cache";
import { getUserByEmail } from "@/lib/db";
import { encrypt } from "@/lib/encrypt";
import { rateLimit } from "@/lib/rateLimit";
import { generateOtp, hashPassword } from "@/lib/utils";
import { registerSchema } from "@/types/auth";
import { randomUUID } from "crypto";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { sendOtp } from "@/email/email";

interface Errors {
  error?: string;
  errors?: {
    email?: string[];
    password?: string[];
    confirmPassword?: string[];
    name?: string[];
  };
}

type FormState = Errors | undefined;

export async function registerUser(_state: FormState, formData: FormData) {
  const headerList = await headers();
  const validatedFields = registerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!validatedFields.success) {
    return {
      error: undefined,
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { email, password } = validatedFields.data;

  // Check if user already exists
  const existingUser = await getUserByEmail(email);
  if (existingUser) {
    return {
      error: "User already exists",
      errors: undefined,
    };
  }

  // Rate limit resend attempts (3 attempts/5 minutes/email)
  const limit = await rateLimit(`rate:signup:${email}`, 5, RATE_LIMIT);
  if (!limit) {
    return {
      error: "Too many signup attempts. Please try again later.",
      errors: undefined,
    };
  }

  // Generate unique session ID
  let sessionId = randomUUID();
  while (getFromCache(`signup:${sessionId}`)) {
    sessionId = randomUUID();
  }

  // Hash password
  const hashedPassword = await hashPassword(password);

  // Generate OTP
  const otpCode = generateOtp();
  if (!otpCode) {
    return {
      error: "An error occurred while generating your OTP",
      errors: undefined,
    };
  }

  // Store user data in cache
  const userAgent = headerList.get("user-agent") || "unknown";
  const sessionData = await encrypt({
    userData: { ...validatedFields.data, password: hashedPassword },
    otp: otpCode,
    userAgent,
  });

  if (!sessionData) {
    return {
      error: "An error occurred while encrypting your data",
      errors: undefined,
    };
  }

  // set to cache
  const setCache = setToCache(
    `signup:${sessionId}`,
    sessionData,
    OTP_EXPIRATION
  );
  if (!setCache) {
    return {
      error: "An error occurred while creating your account cache",
      errors: undefined,
    };
  }

  // Send OTP
  const sendotp = await sendOtp(email, otpCode);
  if (!sendotp) {
    return {
      error: "An error occurred while sending your OTP",
      errors: undefined,
    };
  }

  // Encrypt sessionId for redirection
  const encryptedSession = await encrypt(sessionId);
  if (!encryptedSession) {
    return {
      error: "An error occurred while encrypting your session ID",
      errors: undefined,
    };
  }

  // Redirect with encrypted sessionId and iv as query params
  redirect(
    `/auth/otp?iv=${encodeURIComponent(
      encryptedSession.iv
    )}&encrypted=${encodeURIComponent(encryptedSession.encrypted)}`
  );
}
