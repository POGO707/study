import { NextRequest, NextResponse } from 'next/server'
import { generateContent, models } from '@/lib/gemini'

export async function POST(request: NextRequest) {
    try {
        const { topic } = await request.json()

        if (!topic) {
            return NextResponse.json(
                { error: 'Topic is required' },
                { status: 400 }
            )
        }

        const prompt = `
      Generate an educational video script and image prompts for the topic: "${topic}".
      Provide:
      1. A clear, 3-sentence explanation of the topic.
      2. 5 visual frame prompts for an AI image generator to illustrate the concept.
      
      Format the response exactly like this:
      EXPLANATION: [The 3-sentence explanation]
      FRAMES:
      1. [Frame 1 description]
      2. [Frame 2 description]
      3. [Frame 3 description]
      4. [Frame 4 description]
      5. [Frame 5 description]
    `

        const aiResponse = await generateContent(models.pro, prompt)

        return NextResponse.json({
            success: true,
            data: aiResponse,
        })

    } catch (error: any) {
        console.error('Video gen error:', error)
        return NextResponse.json(
            { error: error.message || 'Video generation failed' },
            { status: 500 }
        )
    }
}
