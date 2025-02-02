"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { X } from "lucide-react"
import { Button } from "./ui/button"
import { EnhancedComment } from "./enhanced-comment"
import { Comment } from "@/lib/types"

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
  // Calculate if thread should appear on left side
  const shouldShowOnLeft = position.x > 500 // Adjust this value based on your editor width

  return (
    <motion.div
      className="absolute z-50"
      style={{ 
        [shouldShowOnLeft ? 'right' : 'left']: shouldShowOnLeft ? '20px' : '-320px',
        top: '-20px',
      }}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
    >
      <div className="w-[300px] rounded-lg border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        {comments.map((comment) => (
          <EnhancedComment
            key={comment.id}
            comment={comment}
            onReaction={(commentId, reaction) => {
              // Handle reaction
            }}
            onStatusChange={(commentId, status) => {
              // Handle status change
            }}
            onDelete={onDeleteComment}
          />
        ))}
      </div>
    </motion.div>
  )
}

