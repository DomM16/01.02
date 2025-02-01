"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Plus, MessageSquare, Share2, Download } from "lucide-react"
import { useState } from "react"

export function FloatingActions() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="fixed bottom-6 right-6">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute bottom-16 right-0 flex flex-col gap-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            {[
              { icon: MessageSquare, label: "Comment" },
              { icon: Share2, label: "Share" },
              { icon: Download, label: "Export" },
            ].map((action, i) => (
              <motion.button
                key={action.label}
                className="flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-lg hover:bg-gray-50"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <action.icon className="w-4 h-4" />
                <span>{action.label}</span>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      
      <motion.button
        className="bg-primary text-primary-foreground rounded-full p-4 shadow-lg hover:shadow-xl transition-shadow"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
      >
        <Plus className="w-6 h-6" />
      </motion.button>
    </div>
  )
} 