"use client"

import * as React from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { X } from "lucide-react"

interface CommentPopoverProps {
  position: { x: number; y: number }
  onClose: () => void
  onSubmit: (comment: string) => void
}

export function CommentPopover({ position, onClose, onSubmit }: CommentPopoverProps) {
  const [comment, setComment] = React.useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (comment.trim()) {
      onSubmit(comment)
      setComment("")
    }
  }

  return (
    <div
      className="absolute z-50 w-[320px] rounded-lg border bg-background shadow-lg animate-in fade-in-0 zoom-in-95"
      style={{
        top: position.y,
        left: position.x,
        transform: "translate(-50%, -100%)",
      }}
    >
      <div className="flex items-center justify-between border-b p-3">
        <div className="flex items-center gap-2">
          <Avatar className="h-6 w-6">
            <AvatarImage src="/placeholder-user.jpg" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium">Add Comment</span>
        </div>
        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-3 p-3">
        <Textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Add your comment..."
          className="min-h-[80px] resize-none"
          autoFocus
        />
        <div className="flex justify-end gap-2">
          <Button type="button" variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" size="sm" disabled={!comment.trim()}>
            Comment
          </Button>
        </div>
      </form>
      <div className="absolute -bottom-2 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 transform border-r border-b bg-background" />
    </div>
  )
}

