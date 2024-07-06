"use client"
import React from 'react';
import {ChakraProvider as ChakProvider} from "@chakra-ui/react";

const ChakraProvider = ({children} : React.PropsWithChildren) => {
    return (
        <ChakProvider>
            {children}
        </ChakProvider>
    );
};

export default ChakraProvider;