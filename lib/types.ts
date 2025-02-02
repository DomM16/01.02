export type CommentType = 'suggestion' | 'bug' | 'question' | 'praise' | 'security' | 'performance';

export interface Comment {
  id: string
  x: number
  y: number
  content: string
  author: string
  createdAt: Date
  avatarUrl?: string
  type: CommentType
  reactions: {
    type: '👍' | '👎' | '❗' | '💡' | '❓'
    users: string[]
  }[]
  codeSnippet?: {
    code: string
    language: string
  }
  status: 'open' | 'resolved' | 'wontfix'
  parentId?: string
}

export interface CodeAnalysis {
  suggestions: string
  mode: 'explain' | 'improve' | 'debug'
}

export interface CodeComment {
  id: string
  x: number
  y: number
  content: string
  author: string
  createdAt: Date
} 