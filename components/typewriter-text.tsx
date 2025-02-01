"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import ReactMarkdown from "react-markdown"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism"

interface TypewriterTextProps {
  content: string
  speed?: number
}

export function TypewriterText({ content, speed = 2 }: TypewriterTextProps) {
  const [displayedContent, setDisplayedContent] = useState("")
  const [isComplete, setIsComplete] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    setDisplayedContent("")
    setCurrentIndex(0)
    setIsComplete(false)
  }, [content])

  useEffect(() => {
    if (!content || currentIndex >= content.length) {
      setIsComplete(true)
      return
    }

    const timer = setTimeout(() => {
      const chunkSize = 5
      const nextIndex = Math.min(currentIndex + chunkSize, content.length)
      const chunk = content.slice(currentIndex, nextIndex)
      setDisplayedContent(prev => prev + chunk)
      setCurrentIndex(nextIndex)
    }, speed)

    return () => clearTimeout(timer)
  }, [content, currentIndex, speed])

  return (
    <div className="relative">
      <AnimatePresence>
        {!isComplete && (
          <motion.div
            className="absolute -right-8 top-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="w-1.5 h-4 bg-primary animate-pulse rounded" />
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="prose prose-sm dark:prose-invert max-w-none">
        <ReactMarkdown
          components={{
            code(props: any) {
              const {inline, className, children} = props;
              const match = /language-(\w+)/.exec(className || '')
              return !inline && match ? (
                <SyntaxHighlighter
                  style={oneDark}
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
          {displayedContent}
        </ReactMarkdown>
      </div>
    </div>
  )
} 