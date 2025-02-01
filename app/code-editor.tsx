"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"
import { CommentPopover } from "@/components/comment-popover"
import { CommentMarker } from "@/components/comment-marker"
import { CommentThread } from "@/components/comment-thread"

interface Comment {
  id: string
  user: {
    name: string
    avatar: string
  }
  content: string
  createdAt: Date
  position: { x: number; y: number }
}

interface CodeEditorProps {
  code: string
  onChange: (code: string) => void
  onAnalyze: () => void
  isLoading: boolean
  waitTime: number
}

export function CodeEditor({ code, onChange, onAnalyze, isLoading, waitTime }: CodeEditorProps) {
  const [isCommenting, setIsCommenting] = React.useState(false)
  const [comments, setComments] = React.useState<Comment[]>([])
  const [activeComment, setActiveComment] = React.useState<string | null>(null)
  const [commentPosition, setCommentPosition] = React.useState({ x: 0, y: 0 })
  const editorRef = React.useRef<HTMLDivElement>(null)

  const handleEditorClick = (e: React.MouseEvent) => {
    if (!isCommenting) return

    const rect = editorRef.current?.getBoundingClientRect()
    if (rect) {
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      setCommentPosition({ x, y })
    }
    setIsCommenting(false)
    setActiveComment("new")
  }

  const handleAddComment = (content: string) => {
    const newComment: Comment = {
      id: Math.random().toString(),
      user: {
        name: "User",
        avatar: "/placeholder-user.jpg",
      },
      content,
      createdAt: new Date(),
      position: commentPosition,
    }
    setComments((prev) => [...prev, newComment])
    setActiveComment(null)
  }

  const handleDeleteComment = (commentId: string) => {
    setComments((prev) => prev.filter((comment) => comment.id !== commentId))
    setActiveComment(null)
  }

  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
      <div className="flex items-center justify-between border-b bg-muted/50 px-4 py-2">
        <h2 className="text-sm font-medium">Code Analysis</h2>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsCommenting(true)}
            className={cn(isCommenting && "bg-primary text-primary-foreground")}
          >
            Add Comment
          </Button>
          <Button onClick={onAnalyze} disabled={isLoading || !code || waitTime > 0} size="sm" className="gap-2">
            {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
            {isLoading ? "Analyzing..." : waitTime > 0 ? `Wait ${waitTime}s` : "Analyze Code"}
          </Button>
        </div>
      </div>
      <div className="relative" ref={editorRef}>
        <textarea
          value={code}
          onChange={(e) => onChange(e.target.value)}
          className={cn(
            "min-h-[500px] w-full resize-none border-0 bg-background px-3 py-2",
            "font-mono text-sm focus-visible:outline-none focus-visible:ring-0",
            "disabled:cursor-not-allowed disabled:opacity-50",
          )}
          placeholder="Paste your code here..."
          style={{ cursor: isCommenting ? "crosshair" : "text" }}
          onClick={handleEditorClick}
        />
        {comments.map((comment) => (
          <div
            key={comment.id}
            style={{
              position: "absolute",
              left: comment.position.x,
              top: comment.position.y,
            }}
          >
            <CommentMarker count={1} onClick={() => setActiveComment(comment.id)} />
          </div>
        ))}
        {activeComment === "new" && (
          <CommentPopover
            position={commentPosition}
            onClose={() => setActiveComment(null)}
            onSubmit={handleAddComment}
          />
        )}
        {activeComment && activeComment !== "new" && (
          <CommentThread
            comments={[comments.find((c) => c.id === activeComment)!]}
            position={comments.find((c) => c.id === activeComment)!.position}
            onClose={() => setActiveComment(null)}
            onReply={handleAddComment}
            onDelete={handleDeleteComment}
          />
        )}
      </div>
    </div>
  )
}

