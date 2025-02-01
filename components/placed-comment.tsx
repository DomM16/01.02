"use client"

import { motion, AnimatePresence } from "framer-motion"
import { MessageSquare, MoreHorizontal, ArrowRight } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { formatDistanceToNow } from "date-fns"
import { Comment } from '@/lib/types'
import { CommentMarker } from './comment-marker'

interface PlacedCommentProps {
  comment: Comment
  onDelete: (id: string) => void
  onClick: (e: React.MouseEvent) => void
  isExpanded: boolean
  commentCount: number
}

export function PlacedComment({
  comment,
  onDelete,
  onClick,
  isExpanded,
  commentCount
}: PlacedCommentProps) {
  return (
    <CommentMarker
      count={commentCount}
      onClick={() => onClick(new MouseEvent('click') as any)}
      isNew={false}
    />
  )
} 