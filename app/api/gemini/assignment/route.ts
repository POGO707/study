import { NextRequest, NextResponse } from 'next/server'
import { generateContent, models } from '@/lib/gemini'

export async function POST(request: NextRequest) {
    try {
        const { pdfText } = await request.json()

        if (!pdfText) {
            return NextResponse.json(
                { error: 'pdfText is required' },
                { status: 400 }
            )
        }

        const prompt = `
      You are an expert assignment solver. Analyze the following assignment text and provide a comprehensive, step-by-step solution.
      Format the response in clean, structured Markdown.
      Include explanations for each step and a final summary.
      
      Assignment Text:
      ${pdfText}
    `

        const aiResponse = await generateContent(models.pro, prompt)

        return NextResponse.json({
            success: true,
            solution: aiResponse,
        })

    } catch (error: any) {
        console.error('Assignment solving error:', error)
        return NextResponse.json(
            { error: error.message || 'Assignment solving failed' },
            { status: 500 }
        )
    }
}
