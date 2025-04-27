"use client"

import { useSearchParams } from "next/navigation"
import { useFormState } from "react-dom"
import { verifyOtp } from "@/actions/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"

const initialState = {
  error: null,
}

export default function VerifyPage() {
  const searchParams = useSearchParams()
  const email = searchParams.get("email") || ""
  const [state, formAction] = useFormState(verifyOtp, initialState)

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Verify your email</h1>
          <p className="text-sm text-muted-foreground">Enter the verification code sent to your email</p>
        </div>

        <Card>
          <form action={formAction}>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {state.error && (
                  <Alert variant="destructive">
                    <AlertDescription>{state.error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" value={email} readOnly />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="otp">Verification Code</Label>
                  <Input id="otp" name="otp" placeholder="123456" required />
                </div>
              </div>
            </CardContent>

            <CardFooter>
              <Button type="submit" className="w-full">
                Verify
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}
