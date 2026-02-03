import { NextRequest, NextResponse } from 'next/server'
import { generateContent, models } from '@/lib/gemini'
import { supabaseAdmin } from '@/lib/supabase-client'

export async function POST(request: NextRequest) {
    try {
        const { message, pdfText, userId } = await request.json()

        if (!message || !userId) {
            return NextResponse.json(
                { error: 'Message and userId are required' },
                { status: 400 }
            )
        }

        const prompt = `
      You are an expert AI tutor for the SmartStudy AI platform.
      
      User Question: ${message}
      
      Context from PDF (if provided):
      ${pdfText || 'No PDF context provided.'}
      
      Instructions:
      1. Be helpful, concise, and educational.
      2. If the user asks about the PDF, base your answer strictly on the context provided.
      3. If the user answers a question correctly, praise them.
    `

        const aiResponse = await generateContent(models.pro, prompt)

        // Optional: Update points if answer is correct (simple logic for now)
        if (aiResponse.toLowerCase().includes('correct') || aiResponse.toLowerCase().includes('well done')) {
            await supabaseAdmin.rpc('increment_points', { user_id: userId, amount: 1 })
        }

        return NextResponse.json({
            success: true,
            message: aiResponse,
        })

    } catch (error: any) {
        console.error('Gemini error:', error)
        return NextResponse.json(
            { error: error.message || 'AI request failed' },
            { status: 500 }
        )
    }
}
