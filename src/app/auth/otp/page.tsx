"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  useActionState,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import OtpAction from "@/actions/otp";
import { TIMER_DURATION } from "@/constants";
import resendOtpAction from "@/actions/resendOtp";
import CustomInput from "@/components/customInput";

function Timer({ timeLeft }: { timeLeft: number }) {
  if (timeLeft <= 0) return null;

  const minutes = Math.floor(timeLeft / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (timeLeft % 60).toString().padStart(2, "0");

  return (
    <p className="text-gray-400 text-sm">
      Resend OTP in{" "}
      <span className="text-yellow-400 font-semibold">
        {minutes}:{seconds}
      </span>
    </p>
  );
}

export default function VerifyPage() {
  const [otpState, setOtpState] = useState({ iv: "", encrypted: "" });
  const [timeLeft, setTimeLeft] = useState(TIMER_DURATION);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [state, formAction] = useActionState(OtpAction, undefined);
  const [resendState, resendAction, resendPending] = useActionState(
    resendOtpAction,
    undefined
  );
  const searchParams = useSearchParams();
  const router = useRouter();

  const handleResendError = useCallback(
    (error: string) => {
      if (
        error.includes(
          "You have exceeded the maximum number of OTP resend attempts. Please try again later."
        )
      ) {
        router.push("/auth/register");
      }
    },
    [router]
  );

  // Extract query parameters and set OTP state
  useEffect(() => {
    const iv = searchParams.get("iv");
    const encrypted = searchParams.get("encrypted");

    if (iv && encrypted) {
      setOtpState({ iv, encrypted });
    } else {
      router.push("/auth/register");
    }
  }, [searchParams, router]);

  // Start the OTP resend timer
  const startTimer = useCallback(() => {
    setTimeLeft(TIMER_DURATION);
    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          timerRef.current = null;
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  useEffect(() => {
    startTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [startTimer]);

  // Handle resend OTP success or error
  useEffect(() => {
    if (resendState?.error) {
      handleResendError(resendState.error);
    }
    if (resendState?.success) {
      startTimer();
    }
  }, [handleResendError, resendState, startTimer]);

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Verify your email
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter the verification code sent to your email
          </p>
        </div>

        <Card>
          {/* Form for OTP submission */}
          <form action={formAction}>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {state?.error && (
                  <Alert variant="destructive">
                    <AlertDescription>{state.error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <input
                    name="iv"
                    required
                    hidden
                    defaultValue={otpState.iv}
                    readOnly
                  />
                  <input
                    name="encrypted"
                    required
                    hidden
                    defaultValue={otpState.encrypted}
                    readOnly
                  />
                </div>
                <CustomInput
                  name="otp"
                  type="number"
                  placeholder="Enter OTP"
                  errors={state?.errors?.otp}
                />
              </div>
            </CardContent>

            <CardFooter>
              <div className="text-center">
                <Timer timeLeft={timeLeft} />
              </div>
            </CardFooter>
          </form>

          {/* Form for Resend OTP */}
          {timeLeft === 0 && (
            <form action={resendAction}>
              <input
                name="iv"
                required
                hidden
                defaultValue={otpState.iv}
                readOnly
              />
              <input
                name="encrypted"
                required
                hidden
                defaultValue={otpState.encrypted}
                readOnly
              />
              <CardFooter>
                <div className="text-center">
                  <Button
                    type="submit"
                    className="text-blue-400 hover:text-yellow-400 hover:underline font-semibold"
                    disabled={resendPending}
                  >
                    {resendPending ? "Resending..." : "Resend OTP"}
                  </Button>
                </div>
              </CardFooter>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
}
