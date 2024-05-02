import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/header/header'
import Providers from '@/components/Providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: '아시아 전기 조명',
    description: 'Modern ECommerce Website',
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <Providers>
                    <div className="min-h-screen flex flex-col">
                        <Header />
                        {children}
                        <footer className="footer footer-center p-4 bg-base-300 text-base-content">
                            <p>
                                Copyright © 2024 - All right reserved by Next
                                Asia{' '}
                            </p>
                        </footer>
                    </div>
                </Providers>
            </body>
        </html>
    )
}
