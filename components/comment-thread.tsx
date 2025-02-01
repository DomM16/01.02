"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { formatDistanceToNow } from "date-fns"
import { X, Send, Smile } from "lucide-react"

interface Comment {
  id: string
  content: string
  author: string
  createdAt: Date
  avatarUrl?: string
}

interface CommentThreadProps {
  comments: Comment[]
  onAddComment: (content: string) => void
  onDeleteComment: (id: string) => void
  position: { x: number; y: number }
  onClose: () => void
}

export function CommentThread({
  comments,
  onAddComment,
  onDeleteComment,
  position,
  onClose,
}: CommentThreadProps) {
  const [newComment, setNewComment] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim()) return
    onAddComment(newComment)
    setNewComment("")
  }

  return (
    <motion.div
      className="absolute z-50"
      style={{ 
        right: "-330px",
        top: "-20px"
      }}
      initial={{ opacity: 0, scale: 0.95, x: -20 }}
      animate={{ opacity: 1, scale: 1, x: 0 }}
      exit={{ opacity: 0, scale: 0.95, x: -20 }}
    >
      <div className="w-[320px] rounded-lg border bg-background/95 backdrop-blur-sm shadow-lg">
        <div className="flex items-center justify-between border-b p-3">
          <motion.h3 
            className="font-semibold"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            Comments ({comments.length})
          </motion.h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="max-h-[320px] overflow-y-auto p-4 space-y-4">
          <AnimatePresence mode="popLayout">
            {comments.map((comment) => (
              <motion.div
                key={comment.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="group"
              >
                <div className="flex items-start gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={comment.avatarUrl} />
                    <AvatarFallback>
                      {comment.author[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{comment.author}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDeleteComment(comment.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(comment.createdAt, { addSuffix: true })}
                    </p>
                    <p className="mt-1 text-sm">{comment.content}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <motion.form 
          onSubmit={handleSubmit}
          className="border-t p-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="relative">
            <Textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="min-h-[80px] pr-10 resize-none"
            />
            <div className="absolute right-2 bottom-2 flex items-center gap-2">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8"
              >
                <Smile className="h-4 w-4" />
              </Button>
              <Button
                type="submit"
                size="icon"
                className="h-8 w-8"
                disabled={!newComment.trim()}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </motion.form>
      </div>
    </motion.div>
  )
}

