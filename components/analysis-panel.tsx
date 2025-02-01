'use client'

import { ScrollArea } from './ui/scroll-area'
import ReactMarkdown from 'react-markdown'

interface AnalysisPanelProps {
  analysis: string
}

export function AnalysisPanel({ analysis }: AnalysisPanelProps) {
  return (
    <ScrollArea className="h-[calc(100vh-116px)]">
      <div className="p-4">
        <ReactMarkdown className="prose dark:prose-invert">
          {analysis || 'No analysis yet. Click "Analyze Code" to begin.'}
        </ReactMarkdown>
      </div>
    </ScrollArea>
  )
} 