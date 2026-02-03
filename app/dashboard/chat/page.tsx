'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Send, Bot, User, FileText } from 'lucide-react'
import { useUser } from '@/hooks/use-user'
import { toast } from 'sonner'

export default function ChatPage() {
    const { user } = useUser()
    const [messages, setMessages] = useState<any[]>([])
    const [input, setInput] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!input.trim() || !user) return

        const userMessage = { role: 'user', content: input }
        setMessages(prev => [...prev, userMessage])
        setInput('')
        setLoading(true)

        try {
            const response = await fetch('/api/gemini/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: input,
                    userId: user.id,
                }),
            })

            const data = await response.json()
            if (data.success) {
                setMessages(prev => [...prev, { role: 'bot', content: data.message }])
            } else {
                throw new Error(data.error)
            }
        } catch (error: any) {
            toast.error(error.message || 'Failed to get AI response')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex flex-col h-[calc(100vh-8rem)]">
            <div className="mb-6">
                <h1 className="text-2xl font-bold">Talk With AI</h1>
                <p className="text-gray-400">Ask questions about your uploaded PDFs or anything else.</p>
            </div>

            <div className="flex-1 glassmorphism rounded-2xl p-6 overflow-y-auto space-y-4 mb-4">
                {messages.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center text-center text-gray-400">
                        <Bot className="w-12 h-12 mb-4 text-[#A1887F]" />
                        <p>No messages yet. Send a message to start the conversation!</p>
                    </div>
                )}
                {messages.map((msg, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div className={`flex gap-3 max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                            <div className={`p-2 rounded-lg ${msg.role === 'user' ? 'bg-[#4E342E]' : 'bg-black/40'}`}>
                                {msg.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5 text-[#A1887F]" />}
                            </div>
                            <div className={`p-4 rounded-2xl ${msg.role === 'user' ? 'bg-[#4E342E] text-white' : 'bg-black/40 border border-[#4E342E]'}`}>
                                {msg.content}
                            </div>
                        </div>
                    </motion.div>
                ))}
                {loading && (
                    <div className="flex justify-start">
                        <div className="flex gap-3">
                            <div className="p-2 rounded-lg bg-black/40">
                                <Bot className="w-5 h-5 text-[#A1887F]" />
                            </div>
                            <div className="p-4 rounded-2xl bg-black/40 border border-[#4E342E] animate-pulse">
                                Thinking...
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <form onSubmit={handleSend} className="flex gap-4">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 bg-black/40 border border-[#4E342E] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#A1887F]"
                />
                <button
                    type="submit"
                    disabled={loading}
                    className="bg-[#4E342E] p-3 rounded-xl hover:bg-[#A1887F] transition-all disabled:opacity-50 glow"
                >
                    <Send className="w-6 h-6" />
                </button>
            </form>
        </div>
    )
}
