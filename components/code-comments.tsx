'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface Comment {
  id: string
  x: number
  y: number
  content: string
  author: {
    name: string
    avatar?: string
  }
  createdAt: Date
}

interface CodeCommentsProps {
  code: string
  comments: Comment[]
  onAddComment: (comment: Omit<Comment, 'id' | 'createdAt'>) => void
  onDeleteComment: (id: string) => void
}

export function CodeComments({ code, comments, onAddComment, onDeleteComment }: CodeCommentsProps) {
  const [activeComment, setActiveComment] = useState<string | null>(null)
  const [newComment, setNewComment] = useState('')
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)

  const handleClick = (e: React.MouseEvent) => {
    if (!containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    setMousePos({ x, y })
    setActiveComment('new')
  }

  const handleSubmitComment = () => {
    if (!newComment.trim()) return

    onAddComment({
      x: mousePos.x,
      y: mousePos.y,
      content: newComment,
      author: {
        name: 'You',
        avatar: '/your-avatar.png'
      }
    })

    setNewComment('')
    setActiveComment(null)
  }

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-full"
      onClick={handleClick}
    >
      {comments.map((comment) => (
        <div
          key={comment.id}
          className="absolute"
          style={{
            left: `${comment.x}px`,
            top: `${comment.y}px`
          }}
        >
          <div className="relative group">
            <div className="w-6 h-6 rounded-full bg-blue-500 cursor-pointer"
                 onClick={(e) => {
                   e.stopPropagation()
                   setActiveComment(comment.id)
                 }}
            />
            {activeComment === comment.id && (
              <div className="absolute left-8 top-0 w-64 bg-white rounded-lg shadow-lg p-4">
                <div className="flex items-start gap-3">
                  <Avatar>
                    <AvatarImage src={comment.author.avatar} />
                    <AvatarFallback>{comment.author.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="font-medium">{comment.author.name}</div>
                    <div className="text-sm text-gray-500">
                      {comment.createdAt.toLocaleDateString()}
                    </div>
                    <p className="mt-2">{comment.content}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      onDeleteComment(comment.id)
                    }}
                  >
                    ×
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
      {activeComment === 'new' && (
        <div
          className="absolute bg-white rounded-lg shadow-lg p-4"
          style={{
            left: `${mousePos.x}px`,
            top: `${mousePos.y}px`
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <Textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="mb-2"
          />
          <div className="flex justify-end gap-2">
            <Button
              variant="ghost"
              onClick={() => setActiveComment(null)}
            >
              Cancel
            </Button>
            <Button onClick={handleSubmitComment}>
              Add Comment
            </Button>
          </div>
        </div>
      )}
    </div>
  )
} 