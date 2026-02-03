'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '@/lib/supabase-client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'sonner'
import Image from 'next/image'

export default function SignupPage() {
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault()

        if (password !== confirmPassword) {
            toast.error('Passwords do not match')
            return
        }

        setLoading(true)

        try {
            const { error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    emailRedirectTo: `${window.location.origin}/auth/callback`,
                },
            })

            if (error) throw error

            toast.success('Account created! Please check your email to confirm.')
            router.push('/login')
        } catch (error: any) {
            toast.error(error.message || 'Signup failed')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glassmorphism rounded-2xl p-8 w-full max-w-md"
            >
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-4">
                        <Image src="/logo.png" alt="Logo" width={80} height={80} className="rounded-xl" />
                    </div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-[#A1887F] to-[#D7CCC8] bg-clip-text text-transparent">
                        Join SmartStudy AI
                    </h1>
                    <p className="text-gray-400 mt-2">Create your account to get started</p>
                </div>

                <form onSubmit={handleSignup} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Email Address
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 bg-[#1A1A1A] border border-[#4E342E] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A1887F] focus:border-transparent text-white"
                            placeholder="student@example.com"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 bg-[#1A1A1A] border border-[#4E342E] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A1887F] focus:border-transparent text-white"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full px-4 py-3 bg-[#1A1A1A] border border-[#4E342E] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A1887F] focus:border-transparent text-white"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-[#4E342E] to-[#A1887F] text-white py-3 rounded-lg font-semibold glow hover:glow-hover transition-all disabled:opacity-50"
                    >
                        {loading ? 'Creating account...' : 'Create Account'}
                    </motion.button>
                </form>

                <p className="text-center text-gray-400 mt-6">
                    Already have an account?{' '}
                    <Link
                        href="/login"
                        className="text-[#A1887F] hover:text-[#D7CCC8] font-semibold transition-colors"
                    >
                        Sign in here
                    </Link>
                </p>
            </motion.div>
        </div>
    )
}
