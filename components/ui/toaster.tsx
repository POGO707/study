'use client'

import { Toaster as Sonner } from 'sonner'

export function Toaster() {
    return (
        <Sonner
            position="top-right"
            toastOptions={{
                style: {
                    background: '#1a1a1a',
                    color: '#fff',
                    border: '1px solid #4E342E',
                },
            }}
        />
    )
}
