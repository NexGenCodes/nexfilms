"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "./ui/button";
import { ChevronLeft } from "lucide-react";

export default function BackHandler() {
  const router = useRouter();

  useEffect(() => {
    const handleBackButtonClick = () => {
      router.back();
    };

    window.addEventListener("popstate", handleBackButtonClick);

    return () => {
      window.removeEventListener("popstate", handleBackButtonClick);
    };
  }, [router]);

  return (
    <Button
      variant="ghost"
      asChild
      className="mb-6 cursor-pointer"
      onClick={() => router.back()}
    >
      <p className="capitalize text-sm font-medium text-foreground">
        <ChevronLeft className="mr-2 h-4 w-4 text-foreground" />
        go back
      </p>
    </Button>
  );
}
