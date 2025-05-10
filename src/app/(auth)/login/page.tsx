"use client";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import CustomInput from "@/components/customInput";
import { Button } from "@/components/ui/button";
import loginUser from "@/actions/login";
import { useActionState } from "react";
import type React from "react";
import Link from "next/link";

export default function LoginPage() {
  const [state, Action, isPending] = useActionState(loginUser, undefined);
  return (
    <div className="container flex flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 md:w-[400px] xl:w-[500px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Welcome back
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter your email and password to sign in
          </p>
        </div>

        <Card>
          <form action={Action} className="space-y-4">
            <CardContent className="pt-6">
              <div className="space-y-6">
                {state?.error && (
                  <Alert variant="destructive">
                    <AlertDescription>{state.error}</AlertDescription>
                  </Alert>
                )}

                <CustomInput
                  name="email"
                  type="email"
                  placeholder="name@example.com"
                  errors={state?.errors?.email}
                />

                <CustomInput
                  name="password"
                  type="password"
                  placeholder="********"
                  errors={state?.errors?.password}
                />
              </div>
            </CardContent>

            <CardFooter className="flex flex-col">
              <Button
                type="submit"
                className="w-full py-4"
                disabled={isPending}
              >
                {isPending ? "Signing in..." : "Sign in"}
              </Button>

              <div className="mt-4 text-center text-sm">
                Don&apos;t have an account?{" "}
                <Link href="/register" className="text-primary hover:underline">
                  Sign up
                </Link>
              </div>
              <div className="mt-4 text-center text-sm">
                <Link
                  href="/forgot-password"
                  className="text-primary hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
