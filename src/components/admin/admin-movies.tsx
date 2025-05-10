"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AddContentDialog } from "@/components/admin/add-content-dialog";
import prisma from "@/lib/prisma";
import { Movie } from "@prisma/client";
import { AdminContentTable } from "./admin-content.table";

interface ContentSelection {
  title: string;
  description: string;
  content: Movie[];
  contentType: "MOVIES" | "SERIES" | "ANIMATION";
}

export async function AdminMovies() {
  // Get all movies
  const movies = await prisma.movie.findMany({
    where: { type: "MOVIES" },
    orderBy: { createdAt: "desc" },
  });

  return (
    <AdminContentSection
      title="Movies"
      description="Manage all movies in the database"
      content={movies}
      contentType="MOVIES"
    />
  );
}

export async function AdminSeries() {
  // Get all series
  const series = await prisma.movie.findMany({
    where: { type: "SERIES" },
    orderBy: { createdAt: "desc" },
  });

  return (
    <AdminContentSection
      title="Series"
      description="Manage all series in the database"
      content={series}
      contentType="SERIES"
    />
  );
}

export async function AdminAnimations() {
  // Get all animations
  const animations = await prisma.movie.findMany({
    where: { isAnimation: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <AdminContentSection
      title="Animations"
      description="Manage all animations in the database"
      content={animations}
      contentType="ANIMATION"
    />
  );
}

function AdminContentSection(props: ContentSelection) {
  const { title, description, content, contentType } = props;
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredContent = content.filter((item) =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Input
            placeholder={`Search ${title.toLowerCase()}...`}
            className="w-[250px]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button onClick={() => setAddDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add {title.slice(0, -1)}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <AdminContentTable content={filteredContent} />
      </CardContent>

      <AddContentDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        defaultType={contentType}
      />
    </Card>
  );
}
