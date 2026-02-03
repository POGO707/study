'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { FileQuestion, Upload, CheckCircle2, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'

export default function QuizPage() {
    const [loading, setLoading] = useState(false)
    const [quiz, setQuiz] = useState<any[] | null>(null)
    const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({})
    const [showResults, setShowResults] = useState(false)

    const generateQuiz = async () => {
        // For demo purposes, we'll use a hardcoded sample text or ask the user to upload one
        // In a real app, you'd select an uploaded PDF or paste text
        const sampleText = "Photosynthesis is the process by which green plants and some other organisms use sunlight to synthesize foods with the help of chlorophyll pigments. In plants, photosynthesis normally occurs in leaves, and involves the green pigment chlorophyll and generates oxygen as a byproduct."

        setLoading(true)
        try {
            const response = await fetch('/api/gemini/quiz', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ pdfText: sampleText }),
            })

            const data = await response.json()
            if (data.success) {
                setQuiz(data.data)
                setSelectedAnswers({})
                setShowResults(false)
                toast.success('Quiz generated!')
            } else {
                throw new Error(data.error)
            }
        } catch (error: any) {
            toast.error(error.message || 'Failed to generate quiz')
        } finally {
            setLoading(false)
        }
    }

    const handleAnswerSelect = (qId: number, option: string) => {
        if (showResults) return
        setSelectedAnswers(prev => ({ ...prev, [qId]: option }))
    }

    const calculateScore = () => {
        if (!quiz) return 0
        return quiz.reduce((score, q) => {
            return score + (selectedAnswers[q.id] === q.answer ? 1 : 0)
        }, 0)
    }

    return (
        <div className="space-y-8 pb-10">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold">Quiz Generator</h1>
                    <p className="text-gray-400">Generate MCQs from your study materials.</p>
                </div>
                {!quiz && (
                    <button
                        onClick={generateQuiz}
                        disabled={loading}
                        className="bg-[#4E342E] px-6 py-2 rounded-lg font-semibold hover:bg-[#A1887F] transition-all glow disabled:opacity-50"
                    >
                        {loading ? 'Generating...' : 'Generate New Quiz'}
                    </button>
                )}
            </div>

            {!quiz ? (
                <div className="glassmorphism rounded-2xl p-12 text-center border-dashed border-2 border-[#4E342E]">
                    <FileQuestion className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                    <h2 className="text-xl font-medium mb-2">No Quiz Generated</h2>
                    <p className="text-gray-400 mb-6">Click the button above to generate a quiz from your latest materials.</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {quiz.map((q, i) => (
                        <motion.div
                            key={q.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="glassmorphism p-6 rounded-2xl"
                        >
                            <h3 className="text-lg font-medium mb-4">{q.id}. {q.question}</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {q.options.map((option: string) => {
                                    const isSelected = selectedAnswers[q.id] === option
                                    const isCorrect = q.answer === option
                                    const showCorrect = showResults && isCorrect
                                    const showWrong = showResults && isSelected && !isCorrect

                                    return (
                                        <button
                                            key={option}
                                            onClick={() => handleAnswerSelect(q.id, option)}
                                            className={`p-4 rounded-xl border transition-all text-left flex justify-between items-center ${isSelected
                                                    ? 'border-[#A1887F] bg-[#4E342E]/20'
                                                    : 'border-[#4E342E] hover:border-[#A1887F]'
                                                } ${showCorrect ? 'border-green-500 bg-green-500/10' : ''} ${showWrong ? 'border-red-500 bg-red-500/10' : ''
                                                }`}
                                        >
                                            <span>{option}</span>
                                            {showCorrect && <CheckCircle2 className="w-5 h-5 text-green-500" />}
                                            {showWrong && <AlertCircle className="w-5 h-5 text-red-500" />}
                                        </button>
                                    )
                                })}
                            </div>
                        </motion.div>
                    ))}

                    <div className="flex justify-between items-center pt-8 border-t border-gray-800">
                        {showResults ? (
                            <div className="text-2xl font-bold">
                                Final Score: <span className="text-[#A1887F]">{calculateScore()} / {quiz.length}</span>
                            </div>
                        ) : (
                            <div className="text-gray-400">
                                {Object.keys(selectedAnswers).length} of {quiz.length} answered
                            </div>
                        )}
                        <div className="flex gap-4">
                            <button
                                onClick={() => setQuiz(null)}
                                className="px-6 py-2 rounded-lg font-semibold border border-[#4E342E] hover:bg-[#1A1A1A] transition-all"
                            >
                                Reset
                            </button>
                            {!showResults && (
                                <button
                                    onClick={() => setShowResults(true)}
                                    disabled={Object.keys(selectedAnswers).length < quiz.length}
                                    className="bg-gradient-to-r from-[#4E342E] to-[#A1887F] px-8 py-2 rounded-lg font-semibold glow hover:glow-hover transition-all disabled:opacity-50"
                                >
                                    Submit Quiz
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
