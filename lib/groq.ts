import { Groq } from 'groq-sdk'
import { config } from './config'

if (!config.groqApiKey) {
  throw new Error('NEXT_PUBLIC_GROQ_API_KEY is not defined in environment variables')
}

const client = new Groq({
  apiKey: config.groqApiKey,
  dangerouslyAllowBrowser: true
})

const prompts = {
  explain: "Explain this code in detail:",
  improve: "Suggest improvements for this code:",
  debug: "Help debug this code and identify potential issues:"
}

export async function analyzeCode(code: string, mode: string, subMode?: string) {
  const getExplanationPrompt = (depth: string) => {
    if (depth === 'detailed') {
      return `Provide an in-depth code analysis with the following structure:

# Comprehensive Code Analysis

## 🎯 Overview
- High-level summary of the code's purpose
- Key technologies and patterns used
- Architecture overview

## 🔍 Detailed Breakdown

### Component Structure
- Detailed explanation of each component
- Props and state management
- Component lifecycle and side effects

### Implementation Details
- Line-by-line explanation of complex logic
- Data flow analysis
- State management approach

### Technical Considerations
- Performance implications
- Memory usage
- Browser compatibility
- Edge cases

## 💡 Best Practices
- Identified patterns
- Adherence to React/TypeScript conventions
- Potential improvements

## 📚 Additional Resources
- Related documentation
- Useful libraries
- Learning materials`
    }
    
    return `Provide a brief code overview with the following structure:

# Quick Code Analysis

## 🎯 Summary
- Main purpose
- Key functionality
- Basic structure

## 💡 Key Points
- Important features
- Notable patterns
- Basic implementation details

## 📝 Quick Notes
- Any immediate observations
- Simple suggestions`
  }

  const prompts = {
    explain: getExplanationPrompt(subMode || 'brief'),
    improve: "Suggest improvements for this code:",
    debug: "Help debug this code and identify potential issues:"
  }

  try {
    const response = await fetch('/api/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        code, 
        mode,
        subMode,
        systemPrompt: `You are an expert code analyst. Format your response in a clear, visually appealing way using markdown:

${prompts[mode as keyof typeof prompts]}

Please ensure explanations are technical yet clear, with proper code formatting and markdown styling.
Use concrete examples where appropriate:

\`\`\`typescript
// Code examples here
\`\`\`
`
      }),
    })

    if (!response.ok) {
      throw new Error('Analysis failed')
    }

    const data = await response.json()
    return data.analysis
  } catch (error) {
    console.error('Analysis error:', error)
    throw error
  }
} 