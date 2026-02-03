'use client'

import PDFUploader from '@/components/dashboard/pdf-uploader'
import { useUser } from '@/hooks/use-user'
import { motion } from 'framer-motion'
import { Trophy, Star, BookOpen, Clock } from 'lucide-react'

export default function DashboardPage() {
    const { user, points } = useUser()

    const stats = [
        { label: 'Total Points', value: points, icon: Trophy, color: 'text-yellow-500' },
        { label: 'Books Read', value: '12', icon: BookOpen, color: 'text-blue-500' },
        { label: 'Study Streak', value: '5 Days', icon: Star, color: 'text-purple-500' },
        { label: 'Hours Spent', value: '48.5', icon: Clock, color: 'text-green-500' },
    ]

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">Welcome back, {user?.email?.split('@')[0]}!</h1>
                    <p className="text-gray-400 mt-1">Ready to start your learning journey today?</p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => {
                    const Icon = stat.icon
                    return (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="glassmorphism p-6 rounded-2xl flex items-center gap-4"
                        >
                            <div className={`p-3 rounded-xl bg-black/40 ${stat.color}`}>
                                <Icon className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-400">{stat.label}</p>
                                <p className="text-2xl font-bold">{stat.value}</p>
                            </div>
                        </motion.div>
                    )
                })}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <PDFUploader />
                </div>

                <div className="space-y-8">
                    <div className="glassmorphism p-6 rounded-2xl">
                        <h2 className="text-xl font-bold mb-4">Daily Goal</h2>
                        <div className="space-y-4">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-400">Progress</span>
                                <span>75%</span>
                            </div>
                            <div className="h-2 bg-black/40 rounded-full overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-[#4E342E] to-[#A1887F] w-[75%]" />
                            </div>
                            <p className="text-xs text-gray-400">
                                You&apos;re almost there! Complete one more quiz to reach your daily goal.
                            </p>
                        </div>
                    </div>

                    <div className="glassmorphism p-6 rounded-2xl">
                        <h2 className="text-xl font-bold mb-4">Quick Tips</h2>
                        <ul className="space-y-3 text-sm text-gray-300">
                            <li className="flex gap-2">
                                <span className="text-[#A1887F]">•</span>
                                Upload any PDF to start chatting with AI.
                            </li>
                            <li className="flex gap-2">
                                <span className="text-[#A1887F]">•</span>
                                Use the Quiz Generator for quick revision.
                            </li>
                            <li className="flex gap-2">
                                <span className="text-[#A1887F]">•</span>
                                Earn points for every correct answer in the chat!
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}
