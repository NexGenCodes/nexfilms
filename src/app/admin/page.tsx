"use client"

import { useState, useEffect } from "react"
import { useFormState } from "react-dom"
import { Film, Tv, PlayCircle, Users, Plus, Trash2, Edit } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { addContent, deleteContentItem, getStats } from "@/actions/admin"

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [stats, setStats] = useState({
    totalMovies: 0,
    totalSeries: 0,
    totalAnimations: 0,
    totalUsers: 0,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedContentId, setSelectedContentId] = useState("")

  const [addContentState, addContentAction] = useFormState(addContent, { error: null, success: null })

  // Mock content data
  const contentItems = [
    {
      id: "1",
      title: "The Last Journey",
      type: "Movie",
      year: "2023",
      rating: "★★★★☆",
      genres: ["Action", "Adventure"],
    },
    {
      id: "2",
      title: "Dark Nights",
      type: "Series",
      year: "2022",
      rating: "★★★★★",
      genres: ["Drama", "Thriller"],
    },
    {
      id: "3",
      title: "Cosmic Adventures",
      type: "Animation",
      year: "2023",
      rating: "★★★☆☆",
      genres: ["Animation", "Family"],
    },
    {
      id: "4",
      title: "City Lights",
      type: "Movie",
      year: "2021",
      rating: "★★★★☆",
      genres: ["Drama", "Romance"],
    },
    {
      id: "5",
      title: "Mystery Island",
      type: "Series",
      year: "2023",
      rating: "★★★★☆",
      genres: ["Mystery", "Adventure"],
    },
  ]

  useEffect(() => {
    async function fetchStats() {
      setIsLoading(true)
      try {
        const result = await getStats()
        if (result.stats) {
          setStats(result.stats)
        }
      } catch (error) {
        console.error("Failed to fetch stats:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [])

  const handleDeleteContent = async (id: string) => {
    try {
      await deleteContentItem(id)
      setDeleteDialogOpen(false)
      // In a real app, you would refresh the content list here
    } catch (error) {
      console.error("Failed to delete content:", error)
    }
  }

  const statsData = [
    {
      title: "Total Movies",
      value: isLoading ? "..." : stats.totalMovies.toString(),
      icon: Film,
      description: "Movies in database",
    },
    {
      title: "Total Series",
      value: isLoading ? "..." : stats.totalSeries.toString(),
      icon: Tv,
      description: "Series in database",
    },
    {
      title: "Total Animations",
      value: isLoading ? "..." : stats.totalAnimations.toString(),
      icon: PlayCircle,
      description: "Animations in database",
    },
    {
      title: "Total Users",
      value: isLoading ? "..." : stats.totalUsers.toString(),
      icon: Users,
      description: "Registered users",
    },
  ]

  return (
    <div className="container mx-auto py-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage your entertainment content and users</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add New Content
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>Add New Content</DialogTitle>
              <DialogDescription>Fill in the details to add new content to the platform.</DialogDescription>
            </DialogHeader>
            <form action={addContentAction}>
              {addContentState.error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertDescription>{addContentState.error}</AlertDescription>
                </Alert>
              )}

              {addContentState.success && (
                <Alert className="mb-4 bg-green-50 text-green-800 dark:bg-green-900 dark:text-green-50">
                  <AlertDescription>{addContentState.success}</AlertDescription>
                </Alert>
              )}

              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="title" className="text-right">
                    Title
                  </Label>
                  <Input id="title" name="title" className="col-span-3" required />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="type" className="text-right">
                    Type
                  </Label>
                  <Select name="type" required>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select content type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MOVIE">Movie</SelectItem>
                      <SelectItem value="SERIES">Series</SelectItem>
                      <SelectItem value="ANIMATION">Animation</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="year" className="text-right">
                    Year
                  </Label>
                  <Input id="year" name="year" className="col-span-3" required />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="genres" className="text-right">
                    Genres
                  </Label>
                  <Input
                    id="genres"
                    name="genres"
                    className="col-span-3"
                    placeholder="Action, Adventure, Drama (comma separated)"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="posterUrl" className="text-right">
                    Poster URL
                  </Label>
                  <Input id="posterUrl" name="posterUrl" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right">
                    Description
                  </Label>
                  <Textarea id="description" name="description" className="col-span-3" required />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Add Content</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {statsData.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="movies">Movies</TabsTrigger>
            <TabsTrigger value="series">Series</TabsTrigger>
            <TabsTrigger value="animations">Animations</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Content</CardTitle>
                <CardDescription>Recently added or updated content</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Year</TableHead>
                        <TableHead>Rating</TableHead>
                        <TableHead>Genres</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {contentItems.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.title}</TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={
                                item.type === "Movie"
                                  ? "bg-blue-500 text-white"
                                  : item.type === "Series"
                                    ? "bg-green-500 text-white"
                                    : "bg-purple-500 text-white"
                              }
                            >
                              {item.type}
                            </Badge>
                          </TableCell>
                          <TableCell>{item.year}</TableCell>
                          <TableCell>
                            <span className="text-amber-500">{item.rating}</span>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {item.genres.map((genre) => (
                                <Badge key={genre} variant="secondary" className="text-xs">
                                  {genre}
                                </Badge>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Edit className="h-4 w-4" />
                                <span className="sr-only">Edit</span>
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-destructive"
                                onClick={() => {
                                  setSelectedContentId(item.id)
                                  setDeleteDialogOpen(true)
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Delete</span>
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="movies" className="mt-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Movies</CardTitle>
                  <CardDescription>Manage all movies in the database</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Input placeholder="Search movies..." className="w-[250px]" />
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Movie
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-center py-10 text-muted-foreground">
                  Movie management interface will be displayed here
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="series" className="mt-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Series</CardTitle>
                  <CardDescription>Manage all series in the database</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Input placeholder="Search series..." className="w-[250px]" />
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Series
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-center py-10 text-muted-foreground">
                  Series management interface will be displayed here
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="animations" className="mt-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Animations</CardTitle>
                  <CardDescription>Manage all animations in the database</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Input placeholder="Search animations..." className="w-[250px]" />
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Animation
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-center py-10 text-muted-foreground">
                  Animation management interface will be displayed here
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="mt-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Users</CardTitle>
                  <CardDescription>Manage user accounts</CardDescription>
                </div>
                <Input placeholder="Search users..." className="w-[250px]" />
              </CardHeader>
              <CardContent>
                <div className="text-center py-10 text-muted-foreground">
                  User management interface will be displayed here
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this content? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={() => handleDeleteContent(selectedContentId)}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
