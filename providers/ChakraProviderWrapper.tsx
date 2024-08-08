'use client';
import React from 'react';
import { CacheProvider } from '@chakra-ui/next-js';
import { ChakraProvider } from '@chakra-ui/react';

const ChakraProviderWrapper = ({ children }: React.PropsWithChildren) => {
    return (
        <CacheProvider>
            <ChakraProvider
                toastOptions={{ defaultOptions: { position: 'bottom-right', duration: 1000 } }}
            >
                {children}
            </ChakraProvider>
        </CacheProvider>
    );
};

export default ChakraProviderWrapper;
