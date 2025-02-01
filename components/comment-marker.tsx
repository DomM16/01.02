"use client"

import { motion, AnimatePresence } from "framer-motion"
import { MessageSquare } from "lucide-react"

interface CommentMarkerProps {
  count?: number
  onClick: (e: React.MouseEvent) => void
  isNew?: boolean
}

export function CommentMarker({ count, onClick, isNew }: CommentMarkerProps) {
  return (
    <motion.button
      onClick={onClick}
      className="relative group"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      <div className={`
        flex h-6 w-6 items-center justify-center rounded-full
        ${isNew ? 'bg-blue-500' : 'bg-primary'} 
        text-white shadow-lg
        transition-shadow hover:shadow-xl
      `}>
        {count ? (
          <span className="text-xs font-medium">{count}</span>
        ) : (
          <MessageSquare className="h-3 w-3" />
        )}
      </div>
      
      <AnimatePresence>
        {isNew && (
          <motion.div
            className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-blue-500"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
          >
            <div className="absolute inset-0 rounded-full bg-blue-500 animate-ping" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  )
}

