"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/lib/auth/auth-hooks"
import { findUserByEmail, verifyPassword, createMockToken } from "@/lib/auth/mock-auth"
import { VALIDATION_MESSAGES } from "@/lib/constants"

// Login form schema
const loginSchema = z.object({
  email: z.string().email({ message: VALIDATION_MESSAGES.EMAIL_INVALID }),
  password: z.string().min(8, { message: VALIDATION_MESSAGES.PASSWORD_MIN }),
})

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [error, setError] = useState<string | null>(null)
  const [isPending, setIsPending] = useState(false)

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setIsPending(true)

    const formData = new FormData(event.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    try {
      // Validate form data
      loginSchema.parse({ email, password })

      // Find user by email (mock authentication)
      const user = findUserByEmail(email)

      if (!user) {
        setError("Invalid email or password")
        setIsPending(false)
        return
      }

      // Verify password
      const isPasswordValid = verifyPassword(password, user.password)

      if (!isPasswordValid) {
        setError("Invalid email or password")
        setIsPending(false)
        return
      }

      // Check if email is verified
      if (!user.emailVerified) {
        setError("Email not verified")
        setIsPending(false)
        return
      }

      // Create user session
      const userSession = {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        image: user.imageUrl,
      }

      // Create mock token
      const token = createMockToken(user)

      // Login successful
      login(userSession, token)

      // Redirect to home page
      router.push("/")
      router.refresh()
    } catch (error) {
      if (error instanceof z.ZodError) {
        setError(error.errors[0].message)
      } else {
        setError("Something went wrong. Please try again.")
      }
      setIsPending(false)
    }
  }

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
          <p className="text-sm text-muted-foreground">Enter your email and password to sign in</p>
        </div>

        <Card>
          <form onSubmit={onSubmit}>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" placeholder="name@example.com" required />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Link href="/forgot-password" className="text-xs text-primary hover:underline">
                      Forgot password?
                    </Link>
                  </div>
                  <Input id="password" name="password" type="password" required />
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col">
              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? "Signing in..." : "Sign in"}
              </Button>

              <div className="mt-4 text-center text-sm">
                Don&apos;t have an account?{" "}
                <Link href="/register" className="text-primary hover:underline">
                  Sign up
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}
