'use client'

import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { UploadCloud, FileText, X } from 'lucide-react'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase-client'
import { useUser } from '@/hooks/use-user'

export default function PDFUploader() {
    const { user } = useUser()
    const [file, setFile] = useState<File | null>(null)
    const [uploading, setUploading] = useState(false)
    const [progress, setProgress] = useState(0)
    const [uploadedFiles, setUploadedFiles] = useState<any[]>([])

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const uploadedFile = acceptedFiles[0]
        if (uploadedFile.type === 'application/pdf') {
            setFile(uploadedFile)
        } else {
            toast.error('Please upload a PDF file')
        }
    }, [])

    const handleUpload = async () => {
        if (!file || !user) {
            toast.error('Please select a file')
            return
        }

        setUploading(true)
        setProgress(0)

        try {
            const formData = new FormData()
            formData.append('file', file)
            formData.append('userId', user.id)

            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            })

            const data = await response.json()

            if (!response.ok) throw new Error(data.error || 'Upload failed')

            toast.success('PDF uploaded successfully!')

            setUploadedFiles(prev => [{
                name: file.name,
                url: data.url,
                size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
                uploaded_at: new Date().toISOString()
            }, ...prev])

            setFile(null)
        } catch (error: any) {
            toast.error(error.message || 'Upload failed')
        } finally {
            setUploading(false)
            setProgress(0)
        }
    }

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        const files = Array.from(e.dataTransfer.files)
        onDrop(files)
    }

    return (
        <div className="glassmorphism rounded-2xl p-6">
            <h2 className="text-xl font-bold mb-4">Upload Study Materials</h2>

            <div
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${file ? 'border-[#A1887F] bg-[#4E342E]/20' : 'border-[#4E342E] hover:border-[#A1887F]'
                    }`}
            >
                <UploadCloud className="w-12 h-12 mx-auto mb-4 text-gray-400" />

                {file ? (
                    <div className="space-y-4">
                        <div className="flex items-center justify-center gap-3">
                            <FileText className="w-8 h-8 text-[#A1887F]" />
                            <div className="text-left">
                                <p className="font-medium">{file.name}</p>
                                <p className="text-sm text-gray-400">
                                    {(file.size / 1024 / 1024).toFixed(2)} MB
                                </p>
                            </div>
                            <button
                                onClick={() => setFile(null)}
                                className="p-1 hover:bg-[#1A1A1A] rounded"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {uploading && (
                            <div className="space-y-2">
                                <div className="h-2 bg-[#1A1A1A] rounded-full overflow-hidden">
                                    <motion.div
                                        className="h-full progress-glow rounded-full"
                                        initial={{ width: '0%' }}
                                        animate={{ width: `${progress || 50}%` }}
                                        transition={{ duration: 0.3 }}
                                    />
                                </div>
                            </div>
                        )}

                        <button
                            onClick={handleUpload}
                            disabled={uploading}
                            className="w-full bg-gradient-to-r from-[#4E342E] to-[#A1887F] text-white py-3 rounded-lg font-semibold glow hover:glow-hover transition-all disabled:opacity-50"
                        >
                            {uploading ? 'Uploading...' : 'Upload PDF'}
                        </button>
                    </div>
                ) : (
                    <div>
                        <p className="text-gray-300 mb-2">
                            Drag & drop your PDF here, or click to browse
                        </p>
                        <input
                            type="file"
                            accept=".pdf"
                            onChange={(e) => e.target.files && onDrop(Array.from(e.target.files))}
                            className="hidden"
                            id="pdf-upload"
                        />
                        <label
                            htmlFor="pdf-upload"
                            className="inline-block px-6 py-2 bg-[#1A1A1A] border border-[#4E342E] rounded-lg cursor-pointer hover:border-[#A1887F] transition-colors"
                        >
                            Browse Files
                        </label>
                        <p className="text-sm text-gray-400 mt-4">
                            Supports PDF files up to 50MB
                        </p>
                    </div>
                )}
            </div>

            {uploadedFiles.length > 0 && (
                <div className="mt-6">
                    <h3 className="font-medium mb-3">Recent Uploads</h3>
                    <div className="space-y-2">
                        {uploadedFiles.map((uploadedFile, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="flex items-center justify-between p-3 bg-[#1A1A1A] rounded-lg"
                            >
                                <div className="flex items-center gap-3">
                                    <FileText className="w-5 h-5 text-[#A1887F]" />
                                    <div>
                                        <p className="font-medium text-sm">{uploadedFile.name}</p>
                                        <p className="text-xs text-gray-400">{uploadedFile.size}</p>
                                    </div>
                                </div>
                                <a
                                    href={uploadedFile.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-[#A1887F] hover:text-[#D7CCC8] transition-colors"
                                >
                                    Preview
                                </a>
                            </motion.div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
