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

  // Rate limit resend attempts (3 attempts/5 minutes/email)
  const limit = await rateLimit(`rate:login:${email}`, 5, RATE_LIMIT);
  if (!limit) {
    return {
      error: "Too many login attempts. Please try again later.",
      errors: undefined,
    };
  }

  // check if user exists in the database
  const user = await getUserByEmail(email);
  if (!user) {
    return {
      message: "User not found",
      errors: undefined,
    };
  }

  // compare password with the hashed password in the database
  const isPasswordValid = await comparePasswords(password, user.password);
  if (!isPasswordValid) {
    return {
      error: "Invalid password",
      errors: undefined,
    };
  }

  await signIn("credentials", {
    redirect: true,
    redirectTo: "/",
    ...user,
  });
}
