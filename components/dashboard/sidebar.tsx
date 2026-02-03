'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
    Upload,
    MessageSquare,
    FileQuestion,
    BookOpen,
    Video,
    Trophy,
    LogOut
} from 'lucide-react'
import { supabase } from '@/lib/supabase-client'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import Image from 'next/image'

const navItems = [
    { href: '/dashboard', icon: Upload, label: 'Upload PDF' },
    { href: '/dashboard/chat', icon: MessageSquare, label: 'Talk With AI' },
    { href: '/dashboard/quiz', icon: FileQuestion, label: 'Quiz Generator' },
    { href: '/dashboard/assignment', icon: BookOpen, label: 'Assignment Solver' },
    { href: '/dashboard/video', icon: Video, label: 'Topic to Video' },
]

export default function DashboardSidebar() {
    const pathname = usePathname()
    const router = useRouter()

    const handleLogout = async () => {
        try {
            await supabase.auth.signOut()
            toast.success('Logged out successfully')
            router.push('/login')
        } catch (error) {
            toast.error('Logout failed')
        }
    }

    return (
        <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="h-screen w-64 glassmorphism border-r border-[#4E342E] p-6 flex flex-col"
        >
            <div className="mb-10 flex items-center gap-3">
                <Image src="/logo.png" alt="Logo" width={40} height={40} className="rounded-lg shadow-lg" />
                <div>
                    <h1 className="text-xl font-bold bg-gradient-to-r from-[#A1887F] to-[#D7CCC8] bg-clip-text text-transparent">
                        SmartStudy AI
                    </h1>
                    <p className="text-xs text-gray-400">Learning Platform</p>
                </div>
            </div>

            <nav className="space-y-2 flex-grow">
                {navItems.map((item) => {
                    const Icon = item.icon
                    const isActive = pathname === item.href

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive
                                ? 'bg-[#4E342E] text-white glow'
                                : 'text-gray-400 hover:text-white hover:bg-[#1A1A1A]'
                                }`}
                        >
                            <Icon className="w-5 h-5" />
                            <span className="font-medium">{item.label}</span>
                        </Link>
                    )
                })}
            </nav>

            <div className="mt-auto pt-6 border-t border-gray-800">
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-[#1A1A1A] rounded-lg transition-all w-full"
                >
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">Logout</span>
                </button>
            </div>
        </motion.div>
    )
}
