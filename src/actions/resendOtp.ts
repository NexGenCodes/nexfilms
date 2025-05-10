"use server";

import { OTP_EXPIRATION, RATE_LIMIT } from "@/constants";
import { sendOtp } from "@/email/email";
import { setToCache, getFromCache } from "@/lib/cache";
import { decrypt, encrypt } from "@/lib/encrypt";
import { rateLimit } from "@/lib/rateLimit";
import { generateOtp } from "@/lib/utils";
import { RegisterSchema, resendOtpSchema } from "@/types/auth";

type FormState =
  | {
      error?: string;
      errors?: { iv?: string[]; encrypted?: string[] };
      success?: boolean;
    }
  | undefined;

type SessionData = {
  iv: string;
  encrypted: string;
};

type EncryptedData = {
  userData: RegisterSchema;
  otp: string;
  userAgent: string;
};

export default async function resendOtpAction(
  _state: FormState,
  formData: FormData
): Promise<FormState> {
  try {
    const validatedFields = await resendOtpSchema.safeParseAsync({
      iv: formData.get("iv"),
      encrypted: formData.get("encrypted"),
    });

    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
        error: undefined,
        success: undefined,
      };
    }

    const { iv, encrypted } = validatedFields.data;

    // Decrypt session ID
    const sessionId = await decrypt<string>(encrypted, iv);
    if (!sessionId) {
      return {
        error: "Invalid session ID.",
        errors: undefined,
        success: undefined,
      };
    }

    // Rate limit resend attempts (3 attempts/5 minutes/sessionId)
    const isRateLimited = await rateLimit(
      `rate:resend_otp:${sessionId}`,
      3,
      RATE_LIMIT
    );
    if (isRateLimited) {
      return {
        error:
          "You have exceeded the maximum number of OTP resend attempts. Please try again later.",
        errors: undefined,
        success: undefined,
      };
    }

    // Retrieve session data from cache
    const sessionData = getFromCache<SessionData>(`signup:${sessionId}`);
    if (!sessionData) {
      return {
        error: "Session expired or invalid. Please try signing up again.",
        errors: undefined,
        success: undefined,
      };
    }

    // Decrypt session data
    const decryptedData = await decrypt<EncryptedData>(
      sessionData.encrypted,
      sessionData.iv
    );
    if (!decryptedData) {
      return {
        error: "Session expired or invalid. Please try signing up again.",
        errors: undefined,
        success: undefined,
      };
    }

    // Generate a new OTP
    const newOtp = generateOtp();
    if (!newOtp) {
      return {
        error: "An error occurred while generating your OTP.",
        errors: undefined,
        success: undefined,
      };
    }

    // Update session data with the new OTP
    const updatedSessionData = await encrypt({
      userData: decryptedData.userData,
      otp: newOtp,
      userAgent: decryptedData.userAgent,
    });
    if (!updatedSessionData) {
      return {
        error: "An error occurred while updating your session.",
        errors: undefined,
        success: undefined,
      };
    }

    const isCacheUpdated = setToCache(
      `signup:${sessionId}`,
      updatedSessionData,
      OTP_EXPIRATION
    );
    if (!isCacheUpdated) {
      return {
        error: "An error occurred while updating your session.",
        errors: undefined,
        success: undefined,
      };
    }

    // Store the last OTP send time
    const isLastOtpSet = setToCache(
      `last_otp_${sessionId}`,
      Date.now(),
      OTP_EXPIRATION
    );
    if (!isLastOtpSet) {
      return {
        error: "An error occurred while storing the last OTP send time.",
        errors: undefined,
        success: undefined,
      };
    }

    // Send the new OTP
    const isOtpSent = await sendOtp(decryptedData.userData.email, newOtp);
    if (!isOtpSent) {
      return {
        error: "An error occurred while sending your OTP.",
        errors: undefined,
        success: undefined,
      };
    }

    return { success: true, errors: undefined, error: undefined };
  } catch (error) {
    console.error("Error during OTP resend:", error);
    return {
      error: "An unexpected error occurred. Please try again later.",
      errors: undefined,
      success: undefined,
    };
  }
}
