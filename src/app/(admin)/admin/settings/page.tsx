import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Admin Settings</h1>
        <p className="text-muted-foreground">Manage your application settings</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Site Settings</CardTitle>
            <CardDescription>Configure general site settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="site-name">Site Name</Label>
              <Input id="site-name" defaultValue="EntertainmentHub" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="site-description">Site Description</Label>
              <Textarea
                id="site-description"
                defaultValue="Your entertainment hub for movies, series, and animations"
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="maintenance-mode">Maintenance Mode</Label>
              <Switch id="maintenance-mode" />
            </div>
            <Button>Save Changes</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Content Settings</CardTitle>
            <CardDescription>Configure content display settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="items-per-page">Items Per Page</Label>
              <Input id="items-per-page" type="number" defaultValue="12" />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="show-ratings">Show Content Ratings</Label>
              <Switch id="show-ratings" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="allow-downloads">Allow Downloads</Label>
              <Switch id="allow-downloads" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="require-login">Require Login to View Content</Label>
              <Switch id="require-login" />
            </div>
            <Button>Save Changes</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
