import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import ReactQueryProvider from '@/providers/ReactQueryProvider';
import { Flex, Stack } from '@chakra-ui/react';
import Navbar from '@/components/Navbar';
import { AuthProvider } from '@/providers/AuthProvider';
import ChatDrawer from '@/components/ChatDrawer/ChatDrawer';
import ThemeProvider from '@/providers/ThemeProvider';
import React from 'react';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'Cool Todo App',
    description:
        'Todo list application in the works, which utilises websockets to provide the best user experience. Built with Next.js, Chakra UI, and SignalR.',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`${inter.className}`} style={{ maxHeight: '100vh' }}>
                <AuthProvider>
                    <ReactQueryProvider>
                        <ThemeProvider>
                            <Flex height="100vh" flexDirection={'column'}>
                                <Navbar />
                                {children}
                                <ChatDrawer />
                            </Flex>
                        </ThemeProvider>
                    </ReactQueryProvider>
                </AuthProvider>
            </body>
        </html>
    );
}
