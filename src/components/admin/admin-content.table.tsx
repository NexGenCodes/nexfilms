"use client";

import { useState } from "react";
import { Edit, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DeleteContentDialog } from "@/components/admin/delete-content-dialog";
import { EditContentDialog } from "@/components/admin/edit-content-dialog";
import { Movie } from "@prisma/client";

interface AdminContentTableProps {
  content: Movie[];
}

export function AdminContentTable({ content }: AdminContentTableProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedContent, setSelectedContent] = useState<Movie | null>(null);

  const handleEdit = (content: Movie) => {
    setSelectedContent(content);
    setEditDialogOpen(true);
  };

  const handleDelete = (content: Movie) => {
    setSelectedContent(content);
    setDeleteDialogOpen(true);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "MOVIE":
        return "bg-blue-500 text-white";
      case "SERIES":
        return "bg-green-500 text-white";
      case "ANIMATION":
        return "bg-purple-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  return (
    <>
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
            {content.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.title}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={getTypeColor(item.type)}>
                    {item.type === "MOVIES"
                      ? "Movie"
                      : item.type === "SERIES"
                      ? "Series"
                      : "Animation"}
                  </Badge>
                </TableCell>
                <TableCell>
                  {item.releaseDate.toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                  })}
                </TableCell>
                <TableCell>
                  <span className="text-amber-500">{item.rating}</span>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {item.genres.map((genre, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="text-xs"
                      >
                        {genre}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleEdit(item)}
                    >
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive"
                      onClick={() => handleDelete(item)}
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

      {selectedContent && (
        <>
          <DeleteContentDialog
            open={deleteDialogOpen}
            onOpenChange={setDeleteDialogOpen}
            content={selectedContent}
          />
          <EditContentDialog
            open={editDialogOpen}
            onOpenChange={setEditDialogOpen}
            content={selectedContent}
          />
        </>
      )}
    </>
  );
}
