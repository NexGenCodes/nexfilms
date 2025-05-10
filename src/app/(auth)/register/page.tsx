"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useActionState } from "react";
import { registerUser } from "@/actions/register";
import CustomInput from "@/components/customInput";

export default function RegisterPage() {
  const [state, formAction, isPending] = useActionState(
    registerUser,
    undefined
  );

  return (
    <div className="container flex flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 md:w-[400px] xl:w-[500px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Create an account
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter your details to create an account
          </p>
        </div>

        <Card>
          <form action={formAction}>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {state?.error && (
                  <Alert variant="destructive">
                    <AlertDescription>{state.error}</AlertDescription>
                  </Alert>
                )}

                <CustomInput
                  name="name"
                  type="text"
                  placeholder="John Doe"
                  errors={state?.errors?.name}
                />
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

                <CustomInput
                  name="confirmPassword"
                  type="password"
                  placeholder="********"
                  errors={state?.errors?.confirmPassword}
                />
              </div>
            </CardContent>

            <CardFooter className="flex flex-col">
              <Button type="submit" className="w-full py-3">
                {isPending ? "Signing up..." : "Sign up"}
              </Button>

              <div className="mt-4 text-center text-sm">
                Already have an account?{" "}
                <Link href="/login" className="text-primary hover:underline">
                  Sign in
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
