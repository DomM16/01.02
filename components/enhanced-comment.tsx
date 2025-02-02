"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { MessageSquare, Bug, Lightbulb, HelpCircle, Shield, Zap, Check, X } from 'lucide-react'
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { cn } from '@/lib/utils'
import type { Comment, CommentType } from '@/lib/types'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'

const typeIcons: Record<CommentType, React.ReactNode> = {
  suggestion: <Lightbulb className="h-4 w-4" />,
  bug: <Bug className="h-4 w-4" />,
  question: <HelpCircle className="h-4 w-4" />,
  praise: <MessageSquare className="h-4 w-4" />,
  security: <Shield className="h-4 w-4" />,
  performance: <Zap className="h-4 w-4" />
}

const reactions = ['👍', '👎', '❗', '💡', '❓']

interface EnhancedCommentProps {
  comment: Comment;
  onReaction: (commentId: string, reaction: string) => void;
  onStatusChange: (commentId: string, status: Comment['status']) => void;
  onDelete: (id: string) => void;
}

export function EnhancedComment({ 
  comment, 
  onReaction, 
  onStatusChange,
  onDelete 
}: EnhancedCommentProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      className="group relative rounded-lg border bg-background p-4 shadow-sm"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage src={comment.avatarUrl} />
            <AvatarFallback>{comment.author[0]}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium">{comment.author}</p>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="flex items-center gap-1">
                {typeIcons[comment.type]}
                {comment.type}
              </Badge>
              <Badge 
                variant={comment.status === 'resolved' ? 'default' : 'secondary'}
                className="flex items-center gap-1"
              >
                {comment.status === 'resolved' ? <Check className="h-3 w-3" /> : null}
                {comment.status}
              </Badge>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(comment.id)}
            className="opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="mt-3 prose prose-sm max-w-none">
        <ReactMarkdown
          components={{
            code(props: any) {
              const {inline, className, children} = props;
              const match = /language-(\w+)/.exec(className || '')
              return !inline && match ? (
                <SyntaxHighlighter
                  language={match[1]}
                  PreTag="div"
                >
                  {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
              ) : (
                <code className={className}>
                  {children}
                </code>
              )
            }
          }}
        >
          {comment.content}
        </ReactMarkdown>
      </div>

      {comment.codeSnippet && (
        <div className="mt-3">
          <SyntaxHighlighter language={comment.codeSnippet.language}>
            {comment.codeSnippet.code}
          </SyntaxHighlighter>
        </div>
      )}

      <div className="mt-4 flex items-center gap-2">
        {reactions.map((reaction) => {
          const hasReacted = comment.reactions
            .find(r => r.type === reaction)
            ?.users.includes(comment.author)
          
          return (
            <Button
              key={reaction}
              variant="ghost"
              size="sm"
              className={cn(
                "hover:bg-muted",
                hasReacted && "bg-muted"
              )}
              onClick={() => onReaction(comment.id, reaction)}
            >
              {reaction}
              <span className="ml-1 text-xs">
                {comment.reactions
                  .find(r => r.type === reaction)
                  ?.users.length || 0}
              </span>
            </Button>
          )
        })}

        <div className="ml-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onStatusChange(
              comment.id, 
              comment.status === 'resolved' ? 'open' : 'resolved'
            )}
          >
            {comment.status === 'resolved' ? 'Reopen' : 'Resolve'}
          </Button>
        </div>
      </div>
    </motion.div>
  )
} 