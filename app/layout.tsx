import type {Metadata} from "next";
import {Inter} from "next/font/google";
import ReactQueryProvider from "@/providers/ReactQueryProvider";
import {ChakraProvider, Container} from '@chakra-ui/react';
import Navbar from "@/components/Navbar";
import theme from "@/theme";


const inter = Inter({subsets: ["latin"]});

export const metadata: Metadata = {
    title: "Create Next App",
    description: "Generated by create next app",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <body className={`${inter.className}`}>
        <ReactQueryProvider>
            <ChakraProvider theme={theme}>
                <Navbar/>
                {children}
            </ChakraProvider>
        </ReactQueryProvider>
        </body>
        </html>
    );
}
