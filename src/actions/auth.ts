"use server"

import { z } from "zod"
import { redirect } from "next/navigation"
import {
  findUserByEmail,
  createUser,
  updateUser,
  hashPassword,
  createVerificationToken,
  findVerificationToken,
  deleteVerificationToken,
  comparePasswords, // Import comparePasswords
} from "@/lib/db"
import { sendVerificationEmail } from "@/email/email"

// Schema for login
export const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
})

// Schema for registration
export const registerSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
})

// Schema for OTP verification
export const otpSchema = z.object({
  email: z.string().email(),
  otp: z.string().length(6, { message: "OTP must be 6 characters" }),
})

// Schema for profile update
export const profileUpdateSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  bio: z.string().optional(),
})

// Schema for password update
export const passwordUpdateSchema = z
  .object({
    currentPassword: z.string().min(8, { message: "Password must be at least 8 characters" }),
    newPassword: z.string().min(8, { message: "Password must be at least 8 characters" }),
    confirmPassword: z.string().min(8, { message: "Password must be at least 8 characters" }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

export async function registerUser(prevState: any, formData: FormData) {
  try {
    // Validate form data
    const validatedFields = registerSchema.parse({
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
    })

    // Check if user already exists
    const existingUser = await findUserByEmail(validatedFields.email)

    if (existingUser) {
      return { error: "User with this email already exists" }
    }

    // Hash password
    const hashedPassword = await hashPassword(validatedFields.password)

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    // Create verification token
    await createVerificationToken({
      identifier: validatedFields.email,
      token: otp,
      expires: otpExpiry,
    })

    // Create user (not verified yet)
    await createUser({
      name: validatedFields.name,
      email: validatedFields.email,
      password: hashedPassword,
    })

    // Send verification email with OTP
    await sendVerificationEmail(validatedFields.email, otp)

    // Redirect to OTP verification page
    redirect(`/verify?email=${encodeURIComponent(validatedFields.email)}`)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.errors[0].message }
    }
    return { error: "Something went wrong. Please try again." }
  }
}

export async function verifyOtp(prevState: any, formData: FormData) {
  try {
    // Validate form data
    const validatedFields = otpSchema.parse({
      email: formData.get("email"),
      otp: formData.get("otp"),
    })

    // Check if OTP is valid
    const verificationToken = await findVerificationToken(validatedFields.email, validatedFields.otp)

    if (!verificationToken) {
      return { error: "Invalid or expired OTP" }
    }

    if (verificationToken.expires < new Date()) {
      return { error: "OTP has expired" }
    }

    // Get user
    const user = await findUserByEmail(validatedFields.email)

    if (!user) {
      return { error: "User not found" }
    }

    // Mark user as verified
    await updateUser(user.id, { emailVerified: new Date() })

    // Delete used token
    await deleteVerificationToken(validatedFields.email, validatedFields.otp)

    // Redirect to login page
    redirect("/login")
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.errors[0].message }
    }
    return { error: "Something went wrong. Please try again." }
  }
}

export async function updateProfile(userId: string, prevState: any, formData: FormData) {
  try {
    // Validate form data
    const validatedFields = profileUpdateSchema.parse({
      name: formData.get("name"),
      bio: formData.get("bio"),
    })

    // Update user
    await updateUser(userId, {
      name: validatedFields.name,
      bio: validatedFields.bio || null,
    })

    return { success: "Profile updated successfully" }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.errors[0].message }
    }
    return { error: "Something went wrong. Please try again." }
  }
}

export async function updatePassword(userId: string, prevState: any, formData: FormData) {
  try {
    // Validate form data
    const validatedFields = passwordUpdateSchema.parse({
      currentPassword: formData.get("currentPassword"),
      newPassword: formData.get("newPassword"),
      confirmPassword: formData.get("confirmPassword"),
    })

    // Get user
    const user = await findUserByEmail("user@example.com") // This should be replaced with actual user lookup

    if (!user) {
      return { error: "User not found" }
    }

    // Check current password
    const passwordMatch = await comparePasswords(validatedFields.currentPassword, user.password)

    if (!passwordMatch) {
      return { error: "Current password is incorrect" }
    }

    // Hash new password
    const hashedPassword = await hashPassword(validatedFields.newPassword)

    // Update user
    await updateUser(userId, {
      password: hashedPassword,
    })

    return { success: "Password updated successfully" }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.errors[0].message }
    }
    return { error: "Something went wrong. Please try again." }
  }
}
