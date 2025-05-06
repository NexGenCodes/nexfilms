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

  const sessionId = await decrypt<string>(encrypted, iv);
  if (!sessionId) {
    return {
      errors: undefined,
      error: "invalid session id ",
      success: undefined,
    };
  }

  // Rate limit resend attempts (3 attempts/5 minutes/sessionId)
  const limit = await rateLimit(`rate:resend_otp:${sessionId}`, 3, RATE_LIMIT);
  if (limit) {
    return {
      error:
        "You have exceeded the maximum number of OTP resend attempts. Please try again later.",
      errors: undefined,
      success: undefined,
    };
  }

  // Get session data from cache
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
  // Generate new OTP
  const newOtp = generateOtp();
  if (!newOtp) {
    return {
      error: "An error occurred while generating your OTP.",
      errors: undefined,
      success: undefined,
    };
  }

  // Update session data with new OTP
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

  const isCached = setToCache(
    `signup:${sessionId}`,
    updatedSessionData,
    OTP_EXPIRATION
  );
  if (!isCached) {
    return {
      error: "An error occurred while updating your session.",
      errors: undefined,
      success: undefined,
    };
  }

  // Store last OTP send time
  const lastOtpSet = setToCache(
    `last_otp_${sessionId}`,
    Date.now(),
    OTP_EXPIRATION
  );
  if (!lastOtpSet) {
    return {
      error: "An error occurred while storing the last OTP send time.",
      errors: undefined,
      success: undefined,
    };
  }

  // Send new OTP
  const isSent = await sendOtp(decryptedData.userData.email, newOtp);
  if (!isSent) {
    return {
      error: "An error occurred while sending your OTP.",
      errors: undefined,
      success: undefined,
    };
  }
  return { success: true, errors: undefined, error: undefined };
}
