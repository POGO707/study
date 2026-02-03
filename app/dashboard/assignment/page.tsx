'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { BookOpen, Search, Download, FileText } from 'lucide-react'
import { toast } from 'sonner'

export default function AssignmentPage() {
    const [loading, setLoading] = useState(false)
    const [solution, setSolution] = useState<string | null>(null)
    const [text, setText] = useState('')

    const solveAssignment = async () => {
        if (!text.trim()) {
            toast.error('Please paste your assignment questions first.')
            return
        }

        setLoading(true)
        try {
            const response = await fetch('/api/gemini/assignment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ pdfText: text }),
            })

            const data = await response.json()
            if (data.success) {
                setSolution(data.solution)
                toast.success('Assignment solved!')
            } else {
                throw new Error(data.error)
            }
        } catch (error: any) {
            toast.error(error.message || 'Failed to solve assignment')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-8 pb-10">
            <div>
                <h1 className="text-2xl font-bold">Assignment Solver</h1>
                <p className="text-gray-400">Paste your assignment questions and get detailed step-by-step solutions.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-4">
                    <div className="glassmorphism p-6 rounded-2xl">
                        <h2 className="text-lg font-medium mb-4 flex items-center gap-2">
                            <FileText className="w-5 h-5 text-[#A1887F]" />
                            Assignment Questions
                        </h2>
                        <textarea
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            placeholder="Paste your questions here..."
                            className="w-full h-64 bg-black/40 border border-[#4E342E] rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-[#A1887F] resize-none text-white"
                        />
                        <button
                            onClick={solveAssignment}
                            disabled={loading}
                            className="w-full mt-4 bg-gradient-to-r from-[#4E342E] to-[#A1887F] text-white py-3 rounded-lg font-semibold glow hover:glow-hover transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            <Search className="w-5 h-5" />
                            {loading ? 'Solving...' : 'Solve Assignment'}
                        </button>
                    </div>
                </div>

                <div>
                    {solution ? (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="glassmorphism p-6 rounded-2xl h-full flex flex-col"
                        >
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-lg font-medium">Step-by-Step Solution</h2>
                                <button className="p-2 hover:bg-black/40 rounded-lg text-[#A1887F]">
                                    <Download className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="flex-1 overflow-y-auto prose prose-invert max-w-none prose-brown">
                                <div dangerouslySetInnerHTML={{ __html: solution.replace(/\n/g, '<br/>') }} />
                            </div>
                        </motion.div>
                    ) : (
                        <div className="glassmorphism rounded-2xl p-12 text-center border-dashed border-2 border-[#4E342E] h-full flex flex-col items-center justify-center">
                            <BookOpen className="w-16 h-16 mb-4 text-gray-400" />
                            <h2 className="text-xl font-medium mb-2">No Solution Yet</h2>
                            <p className="text-gray-400">Enter your questions on the left to see the AI-generated solution.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
