'use client'

import { ThemeProvider as NextThemeProvider } from 'next-themes'
import { ReactNode } from "react";
import dynamic from "next/dynamic";

const ToastProvider = dynamic(() => import('@/components/table/toast-provider'), { ssr: false })

export function ThemeProvider({ children }) {
    return (
        <ToastProvider>
            {children}
        </ToastProvider>
    )
}
