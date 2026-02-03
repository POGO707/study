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
      Analyze the following text and generate 10 high-quality multiple-choice questions (MCQs).
      Each question should have 4 options (A, B, C, D) and specify the correct answer.
      Format the response as a JSON array of objects:
      [
        {
          "id": 1,
          "question": "Question text?",
          "options": ["Option A", "Option B", "Option C", "Option D"],
          "answer": "Option A"
        },
        ...
      ]
      
      Text:
      ${pdfText}
    `

        const aiResponse = await generateContent(models.pro, prompt)

        // Extract JSON from response if Gemini adds markdown formatting
        const jsonMatch = aiResponse.match(/\[.*\]/s)
        const quizData = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(aiResponse)

        return NextResponse.json({
            success: true,
            data: quizData,
        })

    } catch (error: any) {
        console.error('Quiz generation error:', error)
        return NextResponse.json(
            { error: error.message || 'Quiz generation failed' },
            { status: 500 }
        )
    }
}
