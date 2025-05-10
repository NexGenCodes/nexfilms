"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { deleteContentItem } from "@/actions/admin"

interface DeleteContentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  content: {
    id: string
    title: string
  }
}

export function DeleteContentDialog({ open, onOpenChange, content }: DeleteContentDialogProps) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleDelete = async () => {
    setIsDeleting(true)
    setError(null)

    try {
      const result = await deleteContentItem(content.id)

      if (result.error) {
        setError(result.error)
        setIsDeleting(false)
        return
      }

      onOpenChange(false)
      router.refresh()
    } catch (error) {
      console.error("Error deleting content:", error)
      setError("An unexpected error occurred. Please try again.")
      setIsDeleting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Content</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete &quot;{content.title}&quot;? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        {error && <p className="text-sm font-medium text-destructive">{error}</p>}
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isDeleting}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
