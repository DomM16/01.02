'use client'

import { useState, useRef } from 'react'
import { Comment } from '@/lib/types'
import { CommentMarker } from './comment-marker'
import { CommentThread } from './comment-thread'
import { PlacedComment } from './placed-comment'

interface CommentLayerProps {
  comments: Comment[]
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
  const [activeThread, setActiveThread] = useState<string | null>(null)
  const [newCommentPosition, setNewCommentPosition] = useState<{ x: number; y: number } | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleClick = (e: React.MouseEvent) => {
    if (!containerRef.current || !isCommentingEnabled) return

    const rect = containerRef.current.getBoundingClientRect()
    const scrollTop = containerRef.current.scrollTop
    const scrollLeft = containerRef.current.scrollLeft

    // Calculate the line and character position
    const x = Math.floor((e.clientX - rect.left + scrollLeft) / charWidth)
    const y = Math.floor((e.clientY - rect.top + scrollTop) / lineHeight)

    setNewCommentPosition({ x, y })
    setActiveThread("new")
  }

  const handleThreadClick = (key: string, x: number, y: number) => {
    setActiveThread(activeThread === key ? null : key)
    setNewCommentPosition({ x, y })
  }

  const handleAddComment = (content: string) => {
    if (newCommentPosition) {
      onAddComment(newCommentPosition.x, newCommentPosition.y, content)
      if (activeThread === "new") {
        onCommentComplete()
        // Don't close the thread after adding the first comment
        setActiveThread(`comment-${newCommentPosition.x}-${newCommentPosition.y}`)
      }
    }
  }

  // Group comments by their position
  const commentGroups = comments.reduce((groups, comment) => {
    const key = `${comment.x}-${comment.y}`
    if (!groups[key]) {
      groups[key] = []
    }
    groups[key].push(comment)
    return groups
  }, {} as Record<string, Comment[]>)

  // Helper function to determine if comment thread should appear on the left
  const shouldShowOnLeft = (x: number) => {
    if (!containerRef.current) return false
    const terminalWidth = containerRef.current.clientWidth
    return (x * charWidth) > terminalWidth - 400 // 400px is approximate thread width
  }

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-auto"
      onClick={handleClick}
      style={{ 
        pointerEvents: isCommentingEnabled ? "all" : "none",
        cursor: isCommentingEnabled ? "crosshair" : "default"
      }}
    >
      {Object.entries(commentGroups).map(([position, groupComments]) => {
        const [x, y] = position.split("-").map(Number)
        const key = `comment-${x}-${y}`
        const isActive = activeThread === key
        const showOnLeft = shouldShowOnLeft(x)

        return (
          <div 
            key={key} 
            style={{ 
              position: "absolute", 
              left: `${x * charWidth}px`,
              top: `${y * lineHeight}px`,
              pointerEvents: "all"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {isActive ? (
              <div style={{ 
                position: "relative",
                pointerEvents: "all" 
              }}>
                <CommentThread
                  comments={groupComments}
                  onAddComment={(content) => {
                    onAddComment(x, y, content)
                  }}
                  onDeleteComment={onDeleteComment}
                  position={{ x: showOnLeft ? -350 : 20, y: 0 }}
                  onClose={() => setActiveThread(null)}
                />
              </div>
            ) : (
              <div style={{ pointerEvents: "all" }}>
                <PlacedComment
                  comment={groupComments[groupComments.length - 1]}
                  onDelete={(id) => onDeleteComment(id)}
                  onClick={() => handleThreadClick(key, x, y)}
                  isExpanded={isActive}
                  commentCount={groupComments.length}
                />
              </div>
            )}
          </div>
        )
      })}

      {activeThread === "new" && newCommentPosition && (
        <div
          style={{ 
            position: "absolute", 
            left: `${newCommentPosition.x * charWidth}px`,
            top: `${newCommentPosition.y * lineHeight}px`,
            pointerEvents: "all"
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <CommentThread
            comments={[]}
            onAddComment={handleAddComment}
            onDeleteComment={onDeleteComment}
            position={{ 
              x: shouldShowOnLeft(newCommentPosition.x) ? -350 : 20, 
              y: 0 
            }}
            onClose={() => {
              setActiveThread(null)
              setNewCommentPosition(null)
              onCommentComplete()
            }}
          />
        </div>
      )}
    </div>
  )
} 