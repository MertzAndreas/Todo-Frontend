'use client';
import React from 'react';
import theme from '@/theme';
import { ChakraProvider } from '@chakra-ui/react';

const ThemeProvider = ({ children }: React.PropsWithChildren) => {
    return (
        <>
            <ChakraProvider theme={theme}>{children}</ChakraProvider>
        </>
    );
};

export default ThemeProvider;
