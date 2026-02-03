import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-client'

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData()
        const file = formData.get('file') as File
        const userId = formData.get('userId') as string

        if (!file || !userId) {
            return NextResponse.json(
                { error: 'File and userId are required' },
                { status: 400 }
            )
        }

        if (file.type !== 'application/pdf') {
            return NextResponse.json(
                { error: 'Only PDF files are allowed' },
                { status: 400 }
            )
        }

        const fileExt = file.name.split('.').pop()
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
        const filePath = `${userId}/${fileName}`

        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)

        const { error: uploadError } = await supabaseAdmin.storage
            .from('pdfs')
            .upload(filePath, buffer, {
                contentType: file.type,
                cacheControl: '3600',
                upsert: false
            })

        if (uploadError) throw uploadError

        const { data: { publicUrl } } = supabaseAdmin.storage
            .from('pdfs')
            .getPublicUrl(filePath)

        const { error: dbError } = await supabaseAdmin
            .from('pdf_files')
            .insert({
                user_id: userId,
                filename: file.name,
                file_url: publicUrl,
                file_size: file.size,
            })

        if (dbError) throw dbError

        return NextResponse.json({
            success: true,
            url: publicUrl,
            filename: file.name,
        })

    } catch (error: any) {
        console.error('Upload error:', error)
        return NextResponse.json(
            { error: error.message || 'Upload failed' },
            { status: 500 }
        )
    }
}
