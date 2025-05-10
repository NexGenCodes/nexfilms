"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import CustomInput from "@/components/customInput";
import { useActionState } from "react";
import { useSession } from "next-auth/react";
import { TabsContent } from "@/components/ui/tabs";
import { updatePassword, updateProfile } from "@/actions/update";
import LoadingSpinner from "../spinner";

export default function Settings() {
  const [profileState, profileAction, profilePending] = useActionState(
    updateProfile,
    undefined
  );
  const [pwdState, pwdAction, pwdPending] = useActionState(
    updatePassword,
    undefined
  );
  const { data: session, status } = useSession();

  const isLoading = status === "loading" || profilePending || pwdPending;

  const formSelection = () => {
    return (
      <div>
        <form action={profileAction} className="space-y-4">
          <h2 className="text-lg font-semibold">Update Profile</h2>
          <input
            type="hidden"
            name="userId"
            value={session?.user.id}
            readOnly
            required
          />
          <CustomInput
            name="name"
            type="text"
            errors={profileState?.errors?.name}
          />
          <div>
            <label htmlFor="bio" className="block text-sm font-medium">
              Bio
            </label>
            <Textarea
              id="bio"
              name="bio"
              rows={4}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
            {profileState?.errors?.bio && (
              <p className="text-red-500">{profileState.errors.bio}</p>
            )}
          </div>
          <Button type="submit" disabled={profilePending}>
            {profilePending ? "Updating..." : "Save Changes"}
          </Button>
        </form>

        {/* Password Update Form */}
        <form action={pwdAction} className="space-y-4 mt-8">
          <h2 className="text-lg font-semibold">Update Password</h2>
          <input
            type="hidden"
            name="userId"
            value={session?.user.id}
            readOnly
            required
          />
          <CustomInput
            name="currentPassword"
            type="password"
            errors={pwdState?.errors?.currentPassword}
          />
          <CustomInput
            name="newPassword"
            type="password"
            errors={pwdState?.errors?.newPassword}
          />
          <CustomInput
            name="confirmPassword"
            type="password"
            errors={pwdState?.errors?.confirmPassword}
          />
          <Button type="submit" disabled={pwdPending}>
            {pwdPending ? "Updating..." : "Update Password"}
          </Button>
        </form>
      </div>
    );
  };

  return (
    <TabsContent value="settings" className="mt-0">
      <Card>
        <CardHeader>
          <CardTitle>Settings</CardTitle>
          <CardDescription>Update your account details</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? <LoadingSpinner className="my-8" /> : formSelection()}
        </CardContent>
      </Card>
    </TabsContent>
  );
}
