"use server";

import { RATE_LIMIT } from "@/constants";
import { signIn } from "@/lib/auth";
import { getUserByEmail } from "@/lib/db";
import { rateLimit } from "@/lib/rateLimit";
import { comparePasswords } from "@/lib/utils";
import { loginSchema } from "@/types/auth";

type Errors = {
  errors?: {
    email?: string[];
    password?: string[];
  };
  message?: string;
};

type FormState = Errors | undefined;

export default async function loginUser(_state: FormState, formData: FormData) {
  try {
    // Validate form data
    const validData = loginSchema.safeParse({
      email: formData.get("email"),
      password: formData.get("password"),
    });

    if (!validData.success) {
      return {
        errors: validData.error.flatten().fieldErrors,
        message: undefined,
      };
    }

    const { email, password } = validData.data;

    // Rate limit login attempts (5 attempts/5 minutes/email)
    const isRateLimited = await rateLimit(`rate:login:${email}`, 5, RATE_LIMIT);
    if (!isRateLimited) {
      return {
        error: "Too many login attempts. Please try again later.",
        errors: undefined,
      };
    }

    // Check if user exists in the database
    const user = await getUserByEmail(email);
    if (!user) {
      return {
        message: "User not found",
        errors: undefined,
      };
    }

    // Compare password with the hashed password in the database
    const isPasswordValid = await comparePasswords(password, user.password);
    if (!isPasswordValid) {
      return {
        error: "Invalid password",
        errors: undefined,
      };
    }

    // Sign in the user
    await signIn("credentials", {
      redirect: true,
      redirectTo: "/",
      ...user,
    });
  } catch (error) {
    console.error("Error during login:", error);
    return {
      error: "An unexpected error occurred. Please try again later.",
      errors: undefined,
    };
  }
}
