"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { useFormState } from "react-dom"
import Image from "next/image"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { updateProfile, updatePassword } from "@/actions/auth"

export default function ProfilePage() {
  const { data: session } = useSession()
  const [activeTab, setActiveTab] = useState("profile")

  const profileAction = useFormState((state, formData) => updateProfile(session?.user?.id || "", state, formData), {
    error: null,
    success: null,
  })

  const passwordAction = useFormState((state, formData) => updatePassword(session?.user?.id || "", state, formData), {
    error: null,
    success: null,
  })

  if (!session?.user) {
    return <div>Loading...</div>
  }

  const user = session.user

  return (
    <div className="container mx-auto py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">My Account</h1>
        <p className="text-muted-foreground">Manage your account settings and preferences</p>
      </div>

      <div className="grid gap-6 md:grid-cols-[240px_1fr]">
        <Card className="h-fit">
          <CardHeader className="pb-4">
            <div className="flex flex-col items-center space-y-2">
              <Avatar className="h-20 w-20">
                <AvatarImage src={user.image || ""} alt={user.name || ""} />
                <AvatarFallback>{user.name?.charAt(0) || "U"}</AvatarFallback>
              </Avatar>
              <div className="text-center">
                <CardTitle>{user.name}</CardTitle>
                <CardDescription>{user.email}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <TabsList className="grid w-full grid-cols-1 gap-2">
              <TabsTrigger value="profile" onClick={() => setActiveTab("profile")}>
                Profile
              </TabsTrigger>
              <TabsTrigger value="settings" onClick={() => setActiveTab("settings")}>
                Settings
              </TabsTrigger>
              <TabsTrigger value="watchlist" onClick={() => setActiveTab("watchlist")}>
                Watchlist
              </TabsTrigger>
            </TabsList>
          </CardContent>
        </Card>

        <Tabs value={activeTab} className="w-full">
          <TabsContent value="profile" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Update your personal information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <form action={profileAction[0]}>
                  {profileAction[0].error && (
                    <Alert variant="destructive" className="mb-4">
                      <AlertDescription>{profileAction[0].error}</AlertDescription>
                    </Alert>
                  )}

                  {profileAction[0].success && (
                    <Alert className="mb-4 bg-green-50 text-green-800 dark:bg-green-900 dark:text-green-50">
                      <AlertDescription>{profileAction[0].success}</AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" name="name" defaultValue={user.name || ""} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" defaultValue={user.email || ""} disabled />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea id="bio" name="bio" placeholder="Tell us about yourself" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="avatar">Profile Picture</Label>
                    <div className="flex items-center gap-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={user.image || ""} alt={user.name || ""} />
                        <AvatarFallback>{user.name?.charAt(0) || "U"}</AvatarFallback>
                      </Avatar>
                      <Input id="avatar" type="file" className="w-auto" />
                    </div>
                  </div>
                  <Button type="submit">Save Changes</Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>Manage your account preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <form action={passwordAction[0]}>
                  {passwordAction[0].error && (
                    <Alert variant="destructive" className="mb-4">
                      <AlertDescription>{passwordAction[0].error}</AlertDescription>
                    </Alert>
                  )}

                  {passwordAction[0].success && (
                    <Alert className="mb-4 bg-green-50 text-green-800 dark:bg-green-900 dark:text-green-50">
                      <AlertDescription>{passwordAction[0].success}</AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input id="currentPassword" name="currentPassword" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input id="newPassword" name="newPassword" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input id="confirmPassword" name="confirmPassword" type="password" />
                  </div>
                  <Button type="submit">Update Password</Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="watchlist" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle>My Watchlist</CardTitle>
                <CardDescription>Content you've saved to watch later</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="group relative overflow-hidden rounded-lg">
                      <div className="relative aspect-[2/3] w-full overflow-hidden">
                        <Image
                          src={`/placeholder.svg?height=450&width=300&text=Watchlist ${i + 1}`}
                          alt={`Watchlist item ${i + 1}`}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                      </div>
                      <div className="absolute bottom-0 w-full p-4">
                        <h3 className="font-semibold text-white">Watchlist Title {i + 1}</h3>
                        <p className="text-sm text-white/80">Action, Adventure • 2023</p>
                      </div>
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute right-2 top-2 h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-4 w-4"
                        >
                          <path d="M18 6 6 18" />
                          <path d="m6 6 12 12" />
                        </svg>
                        <span className="sr-only">Remove</span>
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
