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
  try {
    const headerList = await headers();

    // Validate form data
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

    // Rate limit signup attempts
    const isRateLimited = await rateLimit(
      `rate:signup:${email}`,
      5,
      RATE_LIMIT
    );
    if (!isRateLimited) {
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

    // Hash the password
    const hashedPassword = await hashPassword(password);

    // Generate OTP
    const otpCode = generateOtp();
    if (!otpCode) {
      return {
        error: "An error occurred while generating your OTP",
        errors: undefined,
      };
    }

    // Encrypt user data and OTP
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

    // Store session data in cache
    const isCacheSet = setToCache(
      `signup:${sessionId}`,
      sessionData,
      OTP_EXPIRATION
    );
    if (!isCacheSet) {
      return {
        error: "An error occurred while creating your account cache",
        errors: undefined,
      };
    }

    // Send OTP to the user's email
    const isOtpSent = await sendOtp(email, otpCode);
    if (!isOtpSent) {
      return {
        error: "An error occurred while sending your OTP",
        errors: undefined,
      };
    }

    // Encrypt session ID for redirection
    const encryptedSession = await encrypt(sessionId);
    if (!encryptedSession) {
      return {
        error: "An error occurred while encrypting your session ID",
        errors: undefined,
      };
    }

    // Redirect to OTP verification page with encrypted session ID
    redirect(
      `/auth/otp?iv=${encodeURIComponent(
        encryptedSession.iv
      )}&encrypted=${encodeURIComponent(encryptedSession.encrypted)}`
    );
  } catch (error) {
    console.error("Error during user registration:", error);
    return {
      error: "An unexpected error occurred. Please try again later.",
      errors: undefined,
    };
  }
}
