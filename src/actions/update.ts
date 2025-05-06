"use server";

import { RATE_LIMIT } from "@/constants";
import { getUserById, updateUser } from "@/lib/db";
import { rateLimit } from "@/lib/rateLimit";
import { comparePasswords, hashPassword } from "@/lib/utils";
import { passwordUpdateSchema, profileUpdateSchema } from "@/types/auth";

interface PasswordState {
  error?: string;
  errors?: {
    currentPassword?: string[];
    newPassword?: string[];
    confirmPassword?: string[];
  };
  success?: boolean;
}

interface ProfileState {
  error?: string;
  errors?: {
    name?: string[];
    bio?: string[];
    userId?: string[];
  };
  success?: boolean;
}

type FormState = PasswordState | undefined;
type FormState2 = ProfileState | undefined;

export async function updatePassword(_state: FormState, formData: FormData) {
  const validatedFields = passwordUpdateSchema.safeParse({
    currentPassword: formData.get("currentPassword"),
    newPassword: formData.get("newPassword"),
    confirmPassword: formData.get("confirmPassword"),
    userId: formData.get("userId") || "",
  });

  if (!validatedFields.success) {
    return {
      error: undefined,
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const userId = validatedFields.data.userId;

  // Rate limit resend attempts (3 attempts/5 minutes/sessionId)
  const limit = await rateLimit(`rate:updatePassword:${userId}`, 3, RATE_LIMIT);
  if (limit) {
    return {
      error:
        "You have exceeded the maximum password update attempts. Please try again later.",
      errors: undefined,
      success: undefined,
    };
  }

  // Get user
  const user = await getUserById(validatedFields.data?.userId || "");

  if (!user) {
    return { error: "User not found" };
  }

  // Check current password
  const passwordMatch = await comparePasswords(
    validatedFields.data?.currentPassword || "",
    user.password
  );

  if (!passwordMatch) {
    return { error: "Current password is incorrect", errors: undefined };
  }

  // Hash new password
  const hashedPassword = await hashPassword(
    validatedFields.data?.newPassword || ""
  );

  // Update user
  await updateUser(validatedFields.data?.userId || "", {
    password: hashedPassword,
  });

  return { success: true, error: "Password updated successfully" };
}

export default async function updateProfile(
  _state: FormState2,
  formData: FormData
) {
  const validatedFields = profileUpdateSchema.safeParse({
    name: formData.get("name"),
    bio: formData.get("bio"),
    userId: formData.get("userId") || "",
  });

  if (!validatedFields.success) {
    return {
      error: undefined,
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }
  const userId = validatedFields.data.userId;

  // Rate limit resend attempts (3 attempts/5 minutes/sessionId)
  const limit = await rateLimit(`rate:updateProfile:${userId}`, 3, RATE_LIMIT);
  if (limit) {
    return {
      error:
        "You have exceeded the maximum profile update attempts. Please try again later.",
      errors: undefined,
      success: undefined,
    };
  }

  // Update user
  await updateUser(validatedFields.data?.userId || "", {
    name: validatedFields.data?.name || "",
    bio: validatedFields.data?.bio || "",
  });

  return { success: true, error: "Profile updated successfully" };
}
