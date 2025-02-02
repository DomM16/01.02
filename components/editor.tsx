'use client'

import { useState } from "react"
import MonacoEditor from "@monaco-editor/react"
import { CommentLayer } from "./comment-layer"
import { Comment } from "@/lib/types"

interface EditorProps {
  value: string
  onChange: (value: string | undefined) => void
  placeholder?: string
  isCommentingEnabled?: boolean
  onCommentComplete?: () => void
}

export function Editor({ 
  value, 
  onChange, 
  placeholder, 
  isCommentingEnabled = false, 
  onCommentComplete = () => {} 
}: EditorProps) {
  const [comments, setComments] = useState<Comment[]>([])

  const handleAddComment = (x: number, y: number, content: string) => {
    const newComment: Comment = {
      id: Math.random().toString(),
      content,
      author: "User",
      createdAt: new Date(),
      type: "suggestion",
      reactions: [],
      status: "open",
      x,
      y
    }
    setComments(prev => [...prev, newComment])
  }

  const handleDeleteComment = (id: string) => {
    setComments(prev => prev.filter(comment => comment.id !== id))
  }

  return (
    <div className="relative h-[600px] rounded-md border">
      <MonacoEditor
        height="100%"
        defaultLanguage="javascript"
        value={value}
        onChange={onChange}
        theme="vs-light"
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          lineNumbers: "on",
          scrollBeyondLastLine: false,
          wordWrap: "on",
          padding: { top: 16, bottom: 16 },
          readOnly: isCommentingEnabled
        }}
      />
      <CommentLayer
        comments={comments}
        onAddComment={handleAddComment}
        onDeleteComment={handleDeleteComment}
        isCommentingEnabled={isCommentingEnabled}
        onCommentComplete={onCommentComplete}
        lineHeight={20}
        charWidth={8}
      />
    </div>
  )
} 