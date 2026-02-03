'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Video, Sparkles, Image as ImageIcon, Layout, ArrowRight } from 'lucide-react'
import { toast } from 'sonner'

export default function VideoPage() {
    const [topic, setTopic] = useState('')
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState<string | null>(null)

    const generateVideoPrompts = async () => {
        if (!topic.trim()) {
            toast.error('Please enter a topic.')
            return
        }

        setLoading(true)
        try {
            const response = await fetch('/api/gemini/video', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ topic }),
            })

            const result = await response.json()
            if (result.success) {
                setData(result.data)
                toast.success('Video script generated!')
            } else {
                throw new Error(result.error)
            }
        } catch (error: any) {
            toast.error(error.message || 'Generation failed')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-8 pb-10">
            <div>
                <h1 className="text-2xl font-bold">Topic to Video</h1>
                <p className="text-gray-400">Generate educational video scripts and visual frame prompts for any topic.</p>
            </div>

            <div className="max-w-3xl mx-auto space-y-8">
                <div className="glassmorphism p-8 rounded-2xl space-y-6">
                    <div className="space-y-4">
                        <label className="text-lg font-medium text-gray-200">What would you like to learn about?</label>
                        <div className="relative">
                            <input
                                type="text"
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                                placeholder="e.g. How Black Holes work, The French Revolution..."
                                className="w-full bg-black/40 border border-[#4E342E] rounded-xl px-4 py-4 pr-16 focus:outline-none focus:ring-2 focus:ring-[#A1887F] text-lg text-white"
                            />
                            <button
                                onClick={generateVideoPrompts}
                                disabled={loading}
                                className="absolute right-2 top-2 bottom-2 bg-[#4E342E] px-4 rounded-lg hover:bg-[#A1887F] transition-all disabled:opacity-50"
                            >
                                {loading ? <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white" /> : <ArrowRight className="w-6 h-6" />}
                            </button>
                        </div>
                    </div>
                </div>

                {data && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-8"
                    >
                        <div className="glassmorphism p-6 rounded-2xl">
                            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                                <Sparkles className="w-5 h-5 text-yellow-500" />
                                AI Explanation
                            </h2>
                            <p className="text-gray-300 leading-relaxed text-lg italic">
                                {data.split('FRAMES:')[0].replace('EXPLANATION:', '').trim()}
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {data.split('FRAMES:')[1]?.split('\n').filter(line => line.trim() && !line.includes('FRAMES')).map((frame, i) => (
                                <div key={i} className="glassmorphism p-6 rounded-2xl">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="p-2 rounded-lg bg-[#4E342E] text-sm font-bold">Frame {i + 1}</div>
                                        <ImageIcon className="w-5 h-5 text-[#A1887F]" />
                                    </div>
                                    <p className="text-sm text-gray-400 leading-relaxed">
                                        {frame.replace(/^\d+\.\s*/, '').trim()}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <div className="bg-[#4E342E]/20 border border-[#A1887F]/30 p-6 rounded-2xl text-center">
                            <Layout className="w-12 h-12 mx-auto mb-4 text-[#A1887F]" />
                            <h3 className="font-bold mb-2">Video Generation Ready</h3>
                            <p className="text-sm text-gray-400 mb-4">Click below to simulate real-time video compilation using these frames.</p>
                            <button className="bg-gradient-to-r from-[#4E342E] to-[#A1887F] px-8 py-3 rounded-xl font-bold glow">
                                Generate MP4 Video
                            </button>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    )
}
