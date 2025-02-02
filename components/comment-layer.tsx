'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CodeComment } from "@/lib/types"
import { CommentMarker } from './comment-marker'
import { CommentThread } from './comment-thread'
import { PlacedComment } from './placed-comment'
import { CommentPopover } from './comment-popover'

interface CommentLayerProps {
  comments: CodeComment[]
  onAddComment: (x: number, y: number, content: string) => void
  onDeleteComment: (id: string) => void
  isCommentingEnabled: boolean
  onCommentComplete: () => void
  lineHeight: number // Height of each line in pixels
  charWidth: number  // Average width of a character in pixels
  editor?: any // Monaco editor instance
}

export function CommentLayer({
  comments,
  onAddComment,
  onDeleteComment,
  isCommentingEnabled,
  onCommentComplete,
  lineHeight = 20, // Default line height
  charWidth = 8,   // Default char width
  editor,
}: CommentLayerProps) {
  const [activeComment, setActiveComment] = useState<string | null>(null)
  const [newCommentPosition, setNewCommentPosition] = useState<{ x: number; y: number } | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleClick = (e: React.MouseEvent) => {
    if (!containerRef.current || !isCommentingEnabled) return
    e.stopPropagation()

    const rect = containerRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    setNewCommentPosition({ x, y })
  }

  const handleAddComment = (content: string) => {
    if (newCommentPosition) {
      onAddComment(newCommentPosition.x, newCommentPosition.y, content)
      setNewCommentPosition(null)
      onCommentComplete()
    }
  }

  return (
    <div
      ref={containerRef}
      className="absolute inset-0"
      onClick={handleClick}
      style={{ 
        pointerEvents: isCommentingEnabled ? 'all' : 'none',
        cursor: isCommentingEnabled ? 'crosshair' : 'default'
      }}
    >
      {comments.map((comment) => (
        <div
          key={comment.id}
          style={{
            position: 'absolute',
            left: comment.x,
            top: comment.y,
            pointerEvents: 'all', // Enable pointer events for comments always
          }}
        >
          <CommentMarker
            onClick={(e) => {
              e.stopPropagation()
              setActiveComment(activeComment === comment.id ? null : comment.id)
            }}
            count={1}
          />
          <AnimatePresence>
            {activeComment === comment.id && (
              <CommentPopover
                position={{ x: 20, y: 0 }}
                onClose={() => setActiveComment(null)}
                onSubmit={(content) => {
                  onAddComment(comment.x, comment.y, content)
                  setActiveComment(null)
                }}
                existingComment={comment}
              />
            )}
          </AnimatePresence>
        </div>
      ))}

      <AnimatePresence>
        {newCommentPosition && (
          <div
            style={{
              position: 'absolute',
              left: newCommentPosition.x,
              top: newCommentPosition.y,
              pointerEvents: 'all',
            }}
          >
            <CommentPopover
              position={{ x: 20, y: 0 }}
              onClose={() => setNewCommentPosition(null)}
              onSubmit={handleAddComment}
            />
          </div>
        )}
      </AnimatePresence>
    </div>
  )
} 