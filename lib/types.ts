export interface Comment {
  id: string
  x: number
  y: number
  content: string
  author: string
  createdAt: Date
  avatarUrl?: string
}

export interface CodeAnalysis {
  suggestions: string
  mode: 'explain' | 'improve' | 'debug'
} 