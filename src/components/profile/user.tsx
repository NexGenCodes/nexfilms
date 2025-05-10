"use client";

import { useEffect, useState, useTransition } from "react";
import { getUserProfile } from "@/actions/profile";
import { TabsContent } from "@/components/ui/tabs";
import { useSession } from "next-auth/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { User } from "@prisma/client";
import LoadingSpinner from "../spinner";

export default function UserProfile() {
  const [userData, setUserData] = useState<User | null>(null);
  const [isPending, startTransition] = useTransition();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (!session?.user?.id) return;
    startTransition(async () => {
      const user = await getUserProfile(session.user.id);
      setUserData(user);
    });
  }, [session?.user?.id]);

  const isLoading = status === "loading" || isPending;

  return (
    <TabsContent value="profile" className="mt-0">
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>
            {isLoading
              ? "Loading your profile..."
              : "Update your personal information"}
          </CardDescription>
        </CardHeader>
        <CardContent className={isLoading ? undefined : "space-y-4"}>
          {isLoading ? (
            <LoadingSpinner className="my-8" />
          ) : (
            <div className="space-y-2">
              <ProfileField label="Name" value={userData?.name} />
              <ProfileField label="Email" value={userData?.email} />
              <ProfileField label="Bio" value={userData?.bio} />
            </div>
          )}
        </CardContent>
      </Card>
    </TabsContent>
  );
}

function ProfileField({
  label,
  value,
}: {
  label: string;
  value?: string | null;
}) {
  return (
    <p>
      <strong>{label}:</strong>{" "}
      <span className={value ? "" : "text-muted-foreground"}>
        {value || "N/A"}
      </span>
    </p>
  );
}
