'use client'

import { Editor as MonacoEditor } from '@monaco-editor/react'
import { CommentLayer } from './comment-layer'
import { useState } from 'react'
import type { Comment } from '@/lib/types'

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
  const [editorInstance, setEditorInstance] = useState<any>(null)

  const handleAddComment = (x: number, y: number, content: string) => {
    const newComment: Comment = {
      id: Math.random().toString(36).substring(2),
      x,
      y,
      content,
      author: 'You',
      createdAt: new Date(),
    }
    setComments([...comments, newComment])
  }

  const handleDeleteComment = (id: string) => {
    setComments(comments.filter((comment) => comment.id !== id))
  }

  return (
    <div className="relative h-[600px] rounded-md border">
      <MonacoEditor
        height="100%"
        defaultLanguage="javascript"
        value={value}
        onChange={onChange}
        onMount={(editor) => setEditorInstance(editor)}
        theme="vs-light"
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          lineNumbers: 'on',
          scrollBeyondLastLine: false,
          wordWrap: 'on',
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
        editor={editorInstance}
      />
    </div>
  )
} 