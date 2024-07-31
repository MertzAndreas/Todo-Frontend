import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import ReactQueryProvider from '@/providers/ReactQueryProvider';
import { Box, ChakraProvider, Container, Flex } from '@chakra-ui/react';
import Navbar from '@/components/Navbar';
import { AuthProvider } from '@/providers/AuthProvider';
import ChatDrawer from '@/components/ChatDrawer/ChatDrawer';
import theme from '@/theme';

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
            <body className={`${inter.className}`}>
                <AuthProvider>
                    <ReactQueryProvider>
                        <ChakraProvider theme={theme}>
                            <Flex flexDirection={'column'} minHeight={'100vh'} bgColor={'gray.50'}>
                                <Navbar />
                                {children}
                                <ChatDrawer />
                            </Flex>
                        </ChakraProvider>
                    </ReactQueryProvider>
                </AuthProvider>
            </body>
        </html>
    );
}
