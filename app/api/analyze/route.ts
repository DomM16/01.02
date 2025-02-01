import { NextResponse } from 'next/server'
import { Groq } from 'groq-sdk'
import { config } from '@/lib/config'

const client = new Groq({
  apiKey: config.groqApiKey
})

const prompts = {
  explain: "Explain this code in detail:",
  improve: "Suggest improvements for this code:",
  debug: "Help debug this code and identify potential issues:"
}

export async function POST(request: Request) {
  try {
    const { code, mode } = await request.json()

    const response = await client.chat.completions.create({
      messages: [
        { 
          role: 'user', 
          content: `${prompts[mode as keyof typeof prompts]}\n\n${code}`
        }
      ],
      model: 'mixtral-8x7b-32768',
      temperature: 0.7,
      max_tokens: 2048,
    })

    return NextResponse.json({ 
      analysis: response.choices[0]?.message?.content 
    })

  } catch (error) {
    console.error('Analysis error:', error)
    return NextResponse.json(
      { error: 'Failed to analyze code' }, 
      { status: 500 }
    )
  }
} 