import { Film, Tv, PlayCircle, Users } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import prisma from "@/lib/prisma";
import { getContentStats } from "@/lib/db";
import { AdminContentTable } from "./admin-content.table";

export async function AdminOverview() {
  // Get content stats from database
  const stats = await getContentStats();

  // Get recent content
  const recentContent = await prisma.movie.findMany({
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  // Process content for display
  const processedContent = recentContent.map((content) => ({
    ...content,
    releaseDate: content.releaseDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }),
    rating: content.rating.toFixed(1),
  }));

  const totalMovies = stats.totalMovies;
  const totalSeries = stats.totalSeries;
  const totalAnimations = stats.totalAnimations;
  const totalUsers = stats.totalUsers;

  const statsData = [
    {
      title: "Total Movies",
      value: totalMovies.toString(),
      icon: Film,
      description: "Movies in database",
    },
    {
      title: "Total Series",
      value: totalSeries.toString(),
      icon: Tv,
      description: "Series in database",
    },
    {
      title: "Total Animations",
      value: totalAnimations.toString(),
      icon: PlayCircle,
      description: "Animations in database",
    },
    {
      title: "Total Users",
      value: totalUsers.toString(),
      icon: Users,
      description: "Registered users",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statsData.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Content</CardTitle>
          <CardDescription>Recently added or updated content</CardDescription>
        </CardHeader>
        <CardContent>
          <AdminContentTable content={processedContent} />
        </CardContent>
      </Card>
    </div>
  );
}
