"use client";

import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { addContent } from "@/actions/admin";
import { useActionState } from "react";

interface AddContentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultType?: "SERIES" | "MOVIES" | "ANIMATION";
}

export function AddContentDialog({
  open,
  onOpenChange,
  defaultType = "MOVIES",
}: AddContentDialogProps) {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(addContent, undefined);

  if (state?.success) {
    onOpenChange(false);
    router.refresh();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Add New Content</DialogTitle>
          <DialogDescription>
            Fill in the details to add new content to the platform.
          </DialogDescription>
        </DialogHeader>
        <form action={formAction}>
          {state?.error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{state?.error}</AlertDescription>
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
              <Select name="type" defaultValue={defaultType}>
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
              <Label htmlFor="rating" className="text-right">
                Rating
              </Label>
              <Input
                id="rating"
                name="rating"
                defaultValue="★★★☆☆"
                className="col-span-3"
                required
              />
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
              <Input
                id="posterUrl"
                name="posterUrl"
                className="col-span-3"
                placeholder="Leave blank for default"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea
                id="description"
                name="description"
                className="col-span-3"
                rows={4}
                required
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">
              {isPending ? "Adding..." : "Add Content"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
